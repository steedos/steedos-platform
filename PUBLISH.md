# PUBLISH GUIDE

After passing the test of Creator Code, you should release a new version for both the packages in the '/packages' folder and the package named 'steedos-server' in the '/server' folder, so that to unify all of the packages version numbers.

- Commit and submit the code in the '/server' folder that built by [Build Creator](./CONTRIBUTING.md#build-creator) to Github.
- Enter to the root path of this repository on command line.
- Run the shell `yarn ver` on command line, and select the version number.
- Modify the version number of 'services.steedos.image' in the file 'docker-compose.yml' which is in the root path of this repository.
- Confirm the 'End-of-line sequence' of the file ‘packages\create-steedos-app\index.js’ is LF.
- Commit and submit the code to Github.
- Run the shell `yarn pub` to publish, or the shell `yarn pub_next` for a beta version.
- After release, you can run the shell `yarn syncToTaoBao` for synchronization of Taobao source.
