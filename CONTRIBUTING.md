# CONTRIBUTING GUIDE

## Requirements

- [Meteor](https://www.meteor.com/) Meteor is an open source platform for web, mobile, and desktop used by over half a million developers around the globe to make shipping javascript applications simple, efficient, and scalable.

> Only when you run the source code  in '/creator' folder of our platform, you need to install Meteor. If you use Steedos as a development tool, you do not need to install Meteor.

- [MongoDB](https://www.mongodb.com/try/download/) version >= 4.2. MongoDB is a general purpose, document-based, distributed database built for modern application developers.
- [Node.js](https://nodejs.org/en/download/) version >= 10.15.1 or above (which can be checked by running `node -v`). You can use [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node versions on a single machine installed.
- [Yarn](https://yarnpkg.com/en/) version >= 1.5 (which can be checked by running `yarn version`). Yarn is a performant package manager for JavaScript and replaces the `npm` client. It is not strictly necessary but highly encouraged.

## Prepare For Development

- Clone this repository to your local.
- Enter to the local folder of this repository by command line.
- Run `yarn` on command line to install the dependent NPM packages.
- And then run `yarn initSubmodules` to init the git submodules for this repository to the ‘apps’ folder.
- Then run `yarn bootstrap` to auto clone git submodules for this repository and link them by [lerna](https://lerna.js.org/).
- Start the MongoDB service.

## Run One App That Linked To Source Code

The code in the folder '/apps' of this repository is some sample project that developed by Steedos.

- Enter to the 'apps' folder of this repository by command line.
- And enter to one app folder such as 'steedos-app-crm'.
- Then you can start the service just by run `yarn start`.
- Use your browser to access `http://127.0.0.1:5000`.

> You do not need to run `yarn` on command line to install the dependent NPM packages, because all of the dependence are linked to the souce code or the node_modules of the parent folder.

> Here you are using our source code as the development tool, you do not need to install [Meteor](https://www.meteor.com/).

## Run The Source Code Of Meteor Bundle

The code in the folder '/creator' of this repository is the souce code of a Meteor application. And all of it's code will build to the '/server' folder as a NPM package named 'steedos-server'.

The code in '/packages' is our souce code of some core NPM packages on which the Meteor application above based on.

If you only need to debug the source code in the '/packages', you shoud just [Run One App That Linked To Source Code](#run-one-app-that-linked-to-source-code).

You will need to read the tutorial bellow only when you need to debug the source code of Meteor application in the '/creator' folder.

### Environment variable

You should add a `.env.local` file to the '/creator' folder, and add some content as as the web service url and mongo server url like this:

```shell
ROOT_URL=http://127.0.0.1:3100
MONGO_URL=mongodb://127.0.0.1/steedos
```

### settings.json

As a Meteor application in the '/creator' folder, You cannot use `steedos-config.yml` as the configuration file, but you can add a file named `settings.json` to do the same.

The content of the `setting.json` may like this:

```shell
{
    "email": {
        "from": "Steedos <noreply@message.steedos.com>"
    },
    "plugins": ["@steedos/app-crm", "@steedos/plugin-enterprise"]
}
```

### Run Creator

- Enter to the '/creator' folder of this repository by command line.
- Run `yarn` on command line to install the dependent NPM packages.
- Then you can start the service just by run `yarn start`.
- Use your browser to access `http://127.0.0.1:3100`.

### Build Creator

You can run the shell bellow on command line to build all of the source code of '/creator' to the '/server' folder as a NPM package named 'steedos-server'.

```shell
cd creator/
export TOOL_NODE_FLAGS="--max-old-space-size=3800"
yarn run build
```

### Test Creator Code After Build

After the command line shell execution of [Build Creator](#build-creator) above, the built code will be copied automatically to the [/server](https://github.com/steedos/steedos-platform/tree/develop/server) folder.

You can simply [Run One App That Linked To Source Code](#run-one-app-that-linked-to-source-code) to test the code that has just been built from the source code in the '/creator' folder.

### Publish

After passing the test of Creator Code, you should release a new version for both the packages in the '/packages' folder and the package named 'steedos-server' in the '/server' folder, so that to unify all of the packages version numbers.
