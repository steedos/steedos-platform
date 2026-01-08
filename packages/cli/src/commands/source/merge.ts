const { Command, flags } = require("@oclif/command");
const path = require("path");
const fs = require("fs-extra");
const yaml = require("js-yaml");

class MergeCommand extends Command {
  async run() {
    const { flags } = this.parse(MergeCommand);
    const rootPath = path.resolve(flags.path || process.cwd());

    this.log(`Scanning for objects in ${rootPath}...`);

    const allFiles = this.getAllFiles(rootPath);
    const objectFiles = allFiles.filter((f) => f.endsWith(".object.yml"));

    this.log(`Found ${objectFiles.length} object files.`);

    for (const objectFile of objectFiles) {
      await this.processObjectFile(objectFile);
    }

    this.log("Merge completed.");
  }

  getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file: string) => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        if (file !== "node_modules" && !file.startsWith(".")) {
          arrayOfFiles = this.getAllFiles(fullPath, arrayOfFiles);
        }
      } else {
        arrayOfFiles.push(fullPath);
      }
    });

    return arrayOfFiles;
  }

  async processObjectFile(objectFilePath) {
    const objectDir = path.dirname(objectFilePath);
    const fieldsDir = path.join(objectDir, "fields");

    if (fs.existsSync(fieldsDir) && fs.statSync(fieldsDir).isDirectory()) {
      try {
        const fileContent = fs.readFileSync(objectFilePath, "utf8");
        const objectContent = yaml.load(fileContent) || {};

        if (!objectContent.fields) {
          objectContent.fields = {};
        }

        const fieldFiles = fs
          .readdirSync(fieldsDir)
          .filter((f) => f.endsWith(".field.yml"));

        if (fieldFiles.length > 0) {
          this.log(`Processing fields for ${path.basename(objectFilePath)}`);
          let objectContentChanged = false;

          for (const fieldFile of fieldFiles) {
            const fieldPath = path.join(fieldsDir, fieldFile);
            try {
              const fieldContent = yaml.load(
                fs.readFileSync(fieldPath, "utf8"),
              );
              const fieldName =
                fieldContent.name || fieldFile.replace(".field.yml", "");

              objectContent.fields[fieldName] = fieldContent;
              objectContentChanged = true;
            } catch (e) {
              this.error(`Error processing field ${fieldFile}: ${e}`);
            }
          }

          if (objectContentChanged) {
            // Convert back to YAML
            const newYaml = yaml.dump(objectContent, {
              lineWidth: -1,
              noRefs: true,
            });
            fs.writeFileSync(objectFilePath, newYaml, "utf8");
            this.log(`Updated ${objectFilePath}`);

            // Remove fields directory
            fs.removeSync(fieldsDir);
            this.log(`Deleted ${fieldsDir}`);
          }
        }
      } catch (e) {
        this.error(`Error processing ${objectFilePath}: ${e}`);
      }
    }
  }
}

MergeCommand.description =
  "Merge split object fields back into the main object yaml file";

MergeCommand.flags = {
  path: flags.string({
    char: "p",
    description: "root path to scan for objects",
    required: false,
  }),
};

module.exports = MergeCommand;
