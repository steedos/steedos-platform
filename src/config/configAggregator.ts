/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { AsyncOptionalCreatable, merge, snakeCase, sortBy } from '@salesforce/kit';
import { AnyJson, definiteEntriesOf, Dictionary, get, isJsonMap, JsonMap, Optional } from '@salesforce/ts-types';
import { Config, ConfigPropertyMeta } from './config';

const propertyToEnvName = (property: string) => `STEEDOS_${snakeCase(property).toUpperCase()}`;

/**
 * Information about a config property.
 */
export interface ConfigInfo {
  /**
   * key The config key.
   */
  key: string;

  /**
   * The location of the config property.
   */
  location?: ConfigAggregator.Location;

  /**
   * The config value.
   */
  value?: AnyJson;

  /**
   * The path of the config value.
   */
  path?: string;
  /**
   * `true` if the config property is in the local project.
   */
  isLocal: () => boolean;

  /**
   * `true` if the config property is in the global space.
   */
  isGlobal: () => boolean;

  /**
   * `true` if the config property is an environment variable.
   */
  isEnvVar: () => boolean;
}

/**
 * Aggregate global and local project config files, as well as environment variables for
 * `steedos-config.json`. The resolution happens in the following bottom-up order:
 *
 * 1. Environment variables  (`SFDX_LOG_LEVEL`)
 * 1. Workspace settings  (`<workspace-root>/.steedos/steedos-config.json`)
 * 1. Global settings  (`$HOME/.steedos/steedos-config.json`)
 *
 * Use {@link ConfigAggregator.create} to instantiate the aggregator.
 *
 * ```
 * const aggregator = await ConfigAggregator.create();
 * console.log(aggregator.getPropertyValue('defaultusername'));
 * ```
 */
export class ConfigAggregator extends AsyncOptionalCreatable<JsonMap> {
  // Initialized in loadProperties
  private allowedProperties!: ConfigPropertyMeta[];
  private localConfig!: Config;
  private globalConfig!: Config;
  private envVars!: Dictionary<string>;
  private config!: JsonMap;

  /**
   * **Do not directly construct instances of this class -- use {@link ConfigAggregator.create} instead.**
   * @ignore
   */
  public constructor(options?: JsonMap) {
    super(options || {});
  }

  /**
   * Initialize this instances async dependencies.
   */
  public async init(): Promise<void> {
    await this.loadProperties();
  }

  /**
   * Get a resolved config property.
   *
   * **Throws** *{@link SfdxError}{ name: 'UnknownConfigKey' }* An attempt to get a property that's not supported.
   *
   * @param key The key of the property.
   */
  public getPropertyValue(key: string): Optional<AnyJson> {
    if (this.getAllowedProperties().some(element => key === element.key)) {
      return this.getConfig()[key];
    } else {
      throw new Error(`Unknown config key: ${key}`);
    }
  }

  /**
   * Get a resolved config property.
   *
   * @param key The key of the property.
   */
  public getInfo(key: string): ConfigInfo {
    const location = this.getLocation(key);
    return {
      key,
      location,
      value: this.getPropertyValue(key),
      path: this.getPath(key),
      isLocal: () => location === ConfigAggregator.Location.LOCAL,
      isGlobal: () => location === ConfigAggregator.Location.GLOBAL,
      isEnvVar: () => location === ConfigAggregator.Location.ENVIRONMENT
    };
  }

  /**
   * Gets a resolved config property location.
   *
   * For example, `getLocation('logLevel')` will return:
   * 1. `Location.GLOBAL` if resolved to an environment variable.
   * 1. `Location.LOCAL` if resolved to local project config.
   * 1. `Location.ENVIRONMENT` if resolved to the global config.
   *
   * @param key The key of the property.
   */
  public getLocation(key: string): Optional<ConfigAggregator.Location> {
    if (this.getEnvVars().get(key) != null) {
      return ConfigAggregator.Location.ENVIRONMENT;
    }
    if (this.getLocalConfig() && this.getLocalConfig().get(key)) {
      return ConfigAggregator.Location.LOCAL;
    }
    if (this.getGlobalConfig() && this.getGlobalConfig().get(key)) {
      return ConfigAggregator.Location.GLOBAL;
    }
  }

  /**
   * Get a resolved file path or environment variable name of the property.
   *
   * For example, `getPath('logLevel')` will return:
   * 1. `$SFDX_LOG_LEVEL` if resolved to an environment variable.
   * 1. `./.steedos/steedos-config.json` if resolved to the local config.
   * 1. `~/.steedos/steedos-config.json` if resolved to the global config.
   * 1. `undefined`, if not resolved.
   *
   * **Note:** that the path returned may be the absolute path instead of
   * relative paths such as `./` and `~/`.
   *
   * @param key The key of the property.
   */
  public getPath(key: string): Optional<string> {
    if (this.envVars[key] != null) {
      return `\$${propertyToEnvName(key)}`;
    }
    if (get(this.getLocalConfig(), `contents[${key}]`) != null) {
      return this.getLocalConfig().getPath();
    }
    if (get(this.getGlobalConfig(), `contents[${key}]`) != null) {
      return this.getGlobalConfig().getPath();
    }
  }

  /**
   * Get all resolved config property keys, values, locations, and paths.
   *
   * ```
   * > console.log(aggregator.getConfigInfo());
   * [
   *     { key: 'logLevel', val: 'INFO', location: 'Environment', path: '$SFDX_LOG_LEVEL'}
   *     { key: 'defaultusername', val: '<username>', location: 'Local', path: './.sfdx/sfdx-config.json'}
   * ]
   * ```
   */
  public getConfigInfo(): ConfigInfo[] {
    const infos = Object.keys(this.getConfig())
      .map(key => this.getInfo(key))
      .filter((info): info is ConfigInfo => !!info);
    return sortBy(infos, 'key');
  }

  /**
   * Get the local project config instance.
   */
  public getLocalConfig(): Config {
    return this.localConfig;
  }

  /**
   * Get the global config instance.
   */
  public getGlobalConfig(): Config {
    return this.globalConfig;
  }

  /**
   * Get the resolved config object from the local, global and environment config instances.
   */
  public getConfig(): JsonMap {
    return this.config;
  }

  /**
   * Get the config properties that are environment variables.
   */
  public getEnvVars(): Map<string, string> {
    return new Map<string, string>(definiteEntriesOf(this.envVars));
  }

  /**
   * Re-read all property configurations from disk.
   */
  public async reload(): Promise<ConfigAggregator> {
    await this.loadProperties();
    return this;
  }

  /**
   * Loads all the properties and aggregates them according to location.
   */
  private async loadProperties(): Promise<void> {
    // Don't throw an project error with the aggregator, since it should resolve to global if
    // there is no project.
    try {
      this.setLocalConfig(await Config.create(Config.getDefaultOptions(false)));
    } catch (err) {
      if (err.name !== 'InvalidProjectWorkspace') {
        throw err;
      }
    }

    this.setGlobalConfig(await Config.create(Config.getDefaultOptions(true)));

    this.setAllowedProperties(Config.getAllowedProperties());

    const accumulator: Dictionary<string> = {};
    this.setEnvVars(
      this.getAllowedProperties().reduce((obj, property) => {
        const val = process.env[propertyToEnvName(property.key)];
        if (val != null) {
          obj[property.key] = val;
        }
        return obj;
      }, accumulator)
    );

    // Global config must be read first so it is on the left hand of the
    // object assign and is overwritten by the local config.

    await this.globalConfig.read();
    const configs = [this.globalConfig.toObject()];

    // We might not be in a project workspace
    if (this.localConfig) {
      await this.localConfig.read();
      configs.push(this.localConfig.toObject());
    }

    configs.push(this.envVars);

    const json: JsonMap = {};
    const reduced = configs.filter(isJsonMap).reduce((acc: JsonMap, el: AnyJson) => merge(acc, el), json);
    this.setConfig(reduced);
  }

  /**
   * Set the resolved config object.
   * @param config The config object to set.
   */
  private setConfig(config: JsonMap) {
    this.config = config;
  }

  /**
   * Set the local config object.
   * @param config The config object value to set.
   */
  private setLocalConfig(config: Config) {
    this.localConfig = config;
  }

  /**
   * Set the global config object.
   * @param config The config object value to set.
   */
  private setGlobalConfig(config: Config) {
    this.globalConfig = config;
  }

  /**
   * Get the allowed properties.
   */
  private getAllowedProperties(): ConfigPropertyMeta[] {
    return this.allowedProperties;
  }

  /**
   * Set the allowed properties.
   * @param properties The properties to set.
   */
  private setAllowedProperties(properties: ConfigPropertyMeta[]) {
    this.allowedProperties = properties;
  }

  /**
   * Sets the env variables.
   * @param envVars The env variables to set.
   */
  private setEnvVars(envVars: Dictionary<string>) {
    this.envVars = envVars;
  }
}

export namespace ConfigAggregator {
  /**
   * An enum of all possible locations for a config value.
   */
  export const enum Location {
    /**
     * Represents the global config.
     */
    GLOBAL = 'Global',

    /**
     * Represents the local project config.
     */
    LOCAL = 'Local',

    /**
     * Represents environment variables.
     */
    ENVIRONMENT = 'Environment'
  }
}
