import { resolveProjectPath } from '../util/internal';
import ProjectJson from './ProjectJson';


export default class Project {
  /**
   * Get a Project from a given path or from the working directory.
   * @param path The path of the project.
   *
   * **Throws** *{@link Error}{ name: 'InvalidProjectWorkspace' }* If the current folder is not located in a workspace.
   */
  public static async resolve(path?: string): Promise<Project> {
    return new Project(await this.resolveProjectPath(path));
  }

  /**
   * Do not directly construct instances of this class -- use {@link SfdxProject.resolve} instead.
   *
   * @ignore
   */
  private constructor(private path: string) {}

  /**
   * Returns the project path.
   */
  public getPath(): string {
    return this.path;
  }

  /**
   * Performs an upward directory search for an steedos project file. Returns the absolute path to the project.
   *
   * @param dir The directory path to start traversing from.
   *
   * **Throws** *{@link Error}{ name: 'InvalidProjectWorkspace' }* If the current folder is not located in a workspace.
   *
   * **See** {@link traverseForFile}
   *
   * **See** [process.cwd()](https://nodejs.org/api/process.html#process_process_cwd)
   */
  public static async resolveProjectPath(dir?: string): Promise<string> {
    return resolveProjectPath(dir);
  }

  
  private projectConfig: any; // tslint:disable-line:no-any

  // Dynamically referenced in retrieveSfdxProjectJson
  private sfdxProjectJson!: SfdxProjectJson;
  private sfdxProjectJsonGlobal!: SfdxProjectJson;


  /**
   * Get the sfdx-project.json config. The global sfdx-project.json is used for user defaults
   * that are not checked in to the project specific file.
   *
   * *Note:* When reading values from {@link SfdxProjectJson}, it is recommended to use
   * {@link SfdxProject.resolveProjectConfig} instead.
   *
   * @param isGlobal True to get the global project file, otherwise the local project config.
   */
  public async retrieveSfdxProjectJson(isGlobal = false): Promise<ProjectJson> {
    const options = ProjectJson.getDefaultOptions(isGlobal);
    if (isGlobal) {
      if (!this.sfdxProjectJsonGlobal) {
        this.sfdxProjectJsonGlobal = await ProjectJson.create(options);
      }
      return this.sfdxProjectJsonGlobal;
    } else {
      options.rootFolder = this.getPath();
      if (!this.sfdxProjectJson) {
        this.sfdxProjectJson = await ProjectJson.create(options);
      }
      return this.sfdxProjectJson;
    }
  }

  /**
   * The project config is resolved from local and global {@link SfdxProjectJson},
   * {@link ConfigAggregator}, and a set of defaults. It is recommended to use
   * this when reading values from SfdxProjectJson.
   * @returns A resolved config object that contains a bunch of different
   * properties, including some 3rd party custom properties.
   */
  public async resolveProjectConfig(): Promise<JsonMap> {
    if (!this.projectConfig) {
      // Get sfdx-project.json from the ~/.sfdx directory to provide defaults
      const global = await this.retrieveSfdxProjectJson(true);
      const local = await this.retrieveSfdxProjectJson();

      await global.read();
      await local.read();

      const defaultValues = {
        sfdcLoginUrl: 'https://login.salesforce.com'
      };

      this.projectConfig = defaults(local.toObject(), global.toObject(), defaultValues);

      // Add fields in sfdx-config.json
      Object.assign(this.projectConfig, (await ConfigAggregator.create()).getConfig());

      // LEGACY - Allow override of sfdcLoginUrl via env var FORCE_SFDC_LOGIN_URL
      if (process.env.FORCE_SFDC_LOGIN_URL) {
        this.projectConfig.sfdcLoginUrl = process.env.FORCE_SFDC_LOGIN_URL;
      }
    }

    return this.projectConfig;
  }
}