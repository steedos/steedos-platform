
import { STEEDOS_PROJECT_JSON } from '../util/internal';
import { ConfigFile } from '../config/configFile';
import { ConfigContents } from '../config/configStore';
import util from '../util';

/**
 * The sfdx-project.json config object. This file determines if a folder is a valid sfdx project.
 *
 * *Note:* Any non-standard (not owned by Salesforce) properties stored in sfdx-project.json should
 * be in a top level property that represents your project or plugin.
 *
 * ```
 * const project = await SfdxProjectJson.retrieve();
 * const myPluginProperties = project.get('myplugin') || {};
 * myPluginProperties.myprop = 'someValue';
 * project.set('myplugin', myPluginProperties);
 * await project.write();
 * ```
 *
 * **See** [force:project:create](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_create_new.htm)
 */
export default class ProjectJson extends ConfigFile<ConfigFile.Options> {
    public static getFileName() {
      return STEEDOS_PROJECT_JSON;
    }
  
    public static getDefaultOptions(isGlobal = false): ConfigFile.Options {
      const options = ConfigFile.getDefaultOptions(isGlobal, ProjectJson.getFileName());
      options.isState = false;
      return options;
    }
  
    public constructor(options: ConfigFile.Options) {
      super(options);
    }
  
    public async read(): Promise<ConfigContents> {
      const contents = await super.read();
  
      // Verify that the configObject does not have upper case keys; throw if it does.  Must be heads down camel case.
      const upperCaseKey = util.findUpperCaseKeys(this.toObject());
      if (upperCaseKey) {
        throw new Error('Invalid Json Casing' + this.getPath());
      }
      return contents;
    }
  
    public getDefaultOptions(options?: ConfigFile.Options): ConfigFile.Options {
      const defaultOptions: ConfigFile.Options = {
        isState: false
      };
  
      Object.assign(defaultOptions, options || {});
      return defaultOptions;
    }
  }