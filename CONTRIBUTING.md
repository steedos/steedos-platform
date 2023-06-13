# CONTRIBUTING GUIDE

## Development Environment

We recommend using Gitpod for online development, which eliminates the tedious process of setting up a development environment.

If you need to deploy the development environment locally, you can refer to the following Gitpod configuration files, which describe the specific process:

- [.gitpod.Dockerfile](.gitpod.Dockerfile)
- [.gitpod.yml](.gitpod.yml)

> `gitpod-workspace-base:2.1` is the docker of steedos template project, see it's [.gitpod.Dockerfile](https://github.com/steedos/steedos-project-template/blob/master/.gitpod.Dockerfile) for more.

## Requirements

- [MongoDB](https://www.mongodb.com/try/download/) version = 4.2.17. MongoDB is a general purpose, document-based, distributed database built for modern application developers.
- [Redis](https://redis.io/) version = 6.2.6.
- [Node.js](https://nodejs.org/en/download/) version = 12.22.7 (which can be checked by running `node -v`). You can use [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node versions on a single machine installed.
- [Yarn](https://yarnpkg.com/en/) version = 1.22.17 (which can be checked by running `yarn version`). Yarn is a performant package manager for JavaScript and replaces the `npm` client. It is not strictly necessary but highly encouraged.
- [Meteor](https://www.meteor.com/) version = 1.9.3. Meteor is an open source platform for web, mobile, and desktop used by over half a million developers around the globe to make shipping javascript applications simple, efficient, and scalable.

> Only when you run the source code  in '/creator' folder of our platform, you need to install Meteor. If you use Steedos as a development tool, you do not need to install Meteor.

## Prepare For Development

- Clone this repository to your local.
- Enter to the local folder of this repository by command line.
- Run `yarn` on command line to install the dependent NPM packages.
- Then run `yarn bootstrap` to auto link the npm packages that mentioned in the file `lerna.json` by [lerna](https://lerna.js.org/).
- Then run `yarn build` to auto build all NPM packages in the folder "packages" and "services" of the source code.
- Start the MongoDB service.

## Run Project

- Run `yarn start` on the command line to start the template project in the folder `/examples/project-template`

- Use your browser to access `http://localhost:5000`.

## Run The Source Code Of Meteor Bundle

The code in the folder '/creator' of this repository is the souce code of a Meteor application. And all of it's code will build to the '/server' folder as a NPM package named 'steedos-server'.

The code in '/packages' is our souce code of some core NPM packages on which the Meteor application above based on.

If you only need to debug the source code in the '/packages', you shoud just [Run Project](#run-project).

You will need to read the tutorial bellow only when you need to debug the source code of Meteor application in the '/creator' folder.

### Environment variable

You should add a `.env.local` file to the '/creator' folder, and add some content as as the web service url and mongo server url like this:

```shell
ROOT_URL=http://127.0.0.1:3100
MONGO_URL=mongodb://127.0.0.1/steedos
```

## 调试平台源码

调试平台源码需要安装nodejs，mongodb，redis，建议使用 docker 启动远程开发环境。

### 使用 docker 启动数据库

华炎魔方运行依赖 mongodb 和 redis，需先在本地安装运行相关服务。

```bash
docker-compose -f docker-compose-db.yml up
```

### 使用本地 nodejs 调试平台源码

运行华炎魔方需要在本地安装 nodejs 14 和 python 等编译环境，如果本地有环境，可以本地启动华炎魔方。

```bash
yarn
yarn build
yarn start
```

## 使用 VSCode Server 远程调试平台源码

可以在服务器上部署远程开发环境，实现远程开发。

```bash
docker-compose -f docker-compose-vscode.yml up
```

打开浏览器，访问 http://127.0.0.1:5555/?folder=/home/workspace/steedos-project-template ，进入VS Code远程开发环境。

此时可以在浏览器中操作 VS Code，运行华炎魔方。


