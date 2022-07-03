# Create Steedos App

The easiest way to get started with Steedos Platform is by using `create-steedos-app`. This CLI tool enables you to quickly start building a new steedos application, with everything set up for you. You can create a new app using the default steedos template, or by using one of the [official Steedos examples](https://github.com/steedos/steedos-platform/tree/master/examples). To get started, use the following command:

```bash
npx create-steedos-app@latest
# or
yarn create steedos-app
# or
pnpm create steedos-app
```

To create a new app in a specific folder, you can send a name as an argument. For example, the following command will create a new Steedos app called `contract-app` in a folder with the same name:

```bash
npx create-steedos-app@latest contract-app
# or
yarn create steedos-app contract-app
# or
pnpm create steedos-app contract-app
```

## Options

`create-steedos-app` comes with the following options:

- **-e, --example [name]|[github-url]** - An example to bootstrap the app with. You can use an example name from the [Steedos Platform repo](https://github.com/steedos/steedos-platform/tree/master/examples) or a GitHub URL. The URL can use any branch and/or subdirectory.
- **--example-path &lt;path-to-example&gt;** - In a rare case, your GitHub URL might contain a branch name with a slash (e.g. bug/fix-1) and the path to the example (e.g. foo/bar). In this case, you must specify the path to the example separately: `--example-path foo/bar`
- **--use-npm** - Explicitly tell the CLI to bootstrap the app using npm. To bootstrap using yarn we recommend to run `yarn create steedos-app`
- **--use-pnpm** - Explicitly tell the CLI to bootstrap the app using pnpm. To bootstrap using pnpm we recommend running `pnpm create steedos-app`

## Why use Create Steedos App?

`create-steedos-app` allows you to create a new Steedos Platform app within seconds. It is officially maintained by the creators of Steedos Platform, and includes a number of benefits:

- **Interactive Experience**: Running `npx create-steedos-app` (with no arguments) launches an interactive experience that guides you through setting up a project.
- **Zero Dependencies**: Initializing a project is as quick as one second. Create Steedos App has zero dependencies.
- **Offline Support**: Create Steedos App will automatically detect if you're offline and bootstrap your project using your local package cache.
- **Support for Examples**: Create Steedos App can bootstrap your application using an example from the Steedos Platform examples collection (e.g. `npx create-steedos-app --example api-routes`).
- **Tested**: The package is part of the Steedos Platform monorepo and tested using the same integration test suite as Steedos Platform itself, ensuring it works as expected with every release.
