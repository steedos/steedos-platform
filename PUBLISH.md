# PUBLISH GUIDE

After passing the test of Creator Code, you should release a new version for both the packages in the '/packages' folder and the package named 'steedos-server' in the '/server' folder, so that to unify all of the packages version numbers.

- Commit and submit the code in the '/server' folder that built by [Build Creator](./CONTRIBUTING.md#build-creator) to Github.
- Enter to the root path of this repository on command line.
- Run the shell `yarn ver` on command line, and select the version number.
- Run the shell `yarn pubBefore_push_submodules` on command line, you can see [.git_push.js](.scripts/.git_push.js) about this command.

> When the platform vesion is '<= 1.22', this command is invalid, as an alternative, you should `commit && push` every submodule manually one by one in the 'apps' folder.

- Modify the version number in the file 'package.template.json' in the folder 'packages\project-template-empty'.
- Confirm the 'End-of-line sequence' of the file ‘packages\create-steedos-app\index.js’ is LF.
- Commit and submit the code to Github.
- Run the shell `yarn pub` to publish, or the shell `yarn pub_next` for a beta version.
- After release, you can run the shell `yarn syncToTaoBao` for synchronization of Taobao source.
