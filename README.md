
<p align="center">
  <a href="https://www.steedos.org">
    <img alt="Steedos" src="https://steedos.github.io/assets/logo.png" width="80" />
  </a>
</p>
<h1 align="center">
  Steedos Platform
</h1>

<p align="center">
<a href="./README_cn.md">中文</a>
<a href="https://docs.steedos.com"> · Docs</a>
<a href="https://github.com/steedos-labs/" target="_blank"> · Steedos Labs</a>
</p>

<p align="center">
Steedos Low-code PaaS platform is an open-source alternative to Salesforce Platform. It provides a powerful and flexible platform for building enterprise-grade applications quickly and easily.  
</p>

<h3 align="center">
 🤖 🎨 🚀
</h3>

## Click, Not Code

With its intuitive drag-and-drop interface, Steedos empowers both developers and non-technical users to create custom applications without the need for extensive coding knowledge.   

- **Design your Data**: Steedos provides powerful data management functions, including data modeling, data storage, and data analysis.
  - [x] Objects [Docs](https://docs.steedos.com/no-code/customize/object) 
  - [x] Fields [Docs](https://docs.steedos.com/no-code/customize/fields/) 
  - [x] Validation Rules [Docs](https://docs.steedos.com/no-code/customize/validation-rules) 
- **Building Apps**: Drag-and-drop interface for building applications.
  - [x] Apps [Docs](https://docs.steedos.com/no-code/application/app)
  - [x] Tabs [Docs](https://docs.steedos.com/no-code/application/tab)
  - [x] Micro Pages [Docs](https://docs.steedos.com/no-code/amis/) **vs** [Salesforce Lightning App Builder](https://help.salesforce.com/s/articleView?id=sf.lightning_app_builder_overview.htm&type=5)
  - [x] List View [Docs](https://docs.steedos.com/no-code/customize/listview/)
  - [x] Page Layout [Docs](https://docs.steedos.com/no-code/customize/page-layout)
- **Secure Your Data**: Steedos provides enterprise-level security features to ensure your data is protected at all times.
  - [x] Object Permissions [Docs](https://docs.steedos.com/admin/permissions/object-permissions)
  - [x] Field Permissions [Docs](https://docs.steedos.com/admin/permissions/field-permissions)
  - [x] App Permissions [Docs](https://docs.steedos.com/admin/permissions/app-permissions)
  - [x] Division [Docs](https://docs.steedos.com/admin/permissions/division)
  - [x] Sharing Rules [Docs](https://docs.steedos.com/admin/permissions/sharing-rules)
  - [x] Restriction Rules [Docs](https://docs.steedos.com/admin/permissions/restriction-rules)
  - [x] Profiles [Docs](https://docs.steedos.com/admin/permissions/profile)
  - [x] Permission Sets [Docs](https://docs.steedos.com/admin/permissions/permission-set)
- **Automate Your Business Processes**: Steedos provides flexible workflow management capabilities that help businesses customize their workflows and improve work efficiency.
  - [x] Automated Actions [Docs](https://docs.steedos.com/automation/automated-actions)
  - [x] Workflow Rules [Docs](https://docs.steedos.com/automation/workflow-rules)
  - [x] Process Approval [Docs](https://docs.steedos.com/automation/approval-process)
- **Integration**: Steedos connect with other low-code tools that can help enterprises achieve seamless integration between internal and external systems.
  - [x] [Node-RED](https://github.com/node-red/node-red) ([Docs](https://docs.steedos.com/plugins/node-red)): Low-code programming for event-driven applications.
  - [ ] [Metabase](https://github.com/metabase/metabase) Business Intelligence, Dashboards, and Data Visualization, **vs** [Salesforce Reports and Dashboards](https://help.salesforce.com/s/articleView?id=sf.analytics_overview.htm&type=5)
  - [ ] [n8n](https://github.com/n8n-io/n8n) Build complex automations 10x faster. **vs** [Salesforce Flow Builder](https://help.salesforce.com/s/articleView?id=sf.flow.htm&language=en_US&type=5)
  - [ ] [ToolJet](https://github.com/ToolJet/ToolJet/) Rapid internal tool development platform

## Extend Steedos with Code

Metadata can be synchronized as code, version controlled, and automated. For complex business logic, front-end and back-end code can be written to implement it。

  - [x] create-steedos-app [Docs](https://docs.steedos.com/developer/create-steedos-app)
  - [x] Steedos Packages [Docs](https://docs.steedos.com/developer/package)
  - [x] Metadata Sync with Source Code [Docs](https://docs.steedos.com/developer/sync-metadata)
  - [x] API [Docs](https://docs.steedos.com/api/rest-api/)
  - [x] Object Triggers [Docs](https://docs.steedos.com/developer/action-trigger)
  - [x] Custom API [Docs](https://docs.steedos.com/developer/action-api)

## Getting Started

Steedos is essentially a set of npm packages that can be installed over npm. 

The easiest way to install Steedos is to use the command line tool that helps you create a template project. You can run this command anywhere in a new empty repository or within an existing repository, it will create a new directory containing the scaffolded files.

```bash
npx create-steedos-app my-app
cd my-app
yarn
yarn start
```

or you can try the following sample projects.

- [Project Template](https://github.com/steedos/steedos-project-template)
- [Examples](https://github.com/steedos/steedos-examples)

## Steedos DX

With Steedos DX, metadata can be imported into Steedos, modified in the product interface, and synchronize back to project source code. 

Steedos DX introduces a new way to organize your metadata and distribute your apps. You can benefit from modern collaboration technologies such as Git to version control everything across your team - your code, your org configuration, and your metadata. 

To make this possible, we're enabling you to export your metadata, define data import files, and easily specify the edition, features, and configuration options of your development, staging, and production environments.

![Steedos Overview](http://www.steedos.org/assets/platform/platform-overview.png)

Steedos DX is licenced per developer. We provide Steedos DX free license for open source projects and educational institutions.

## Awesome Steedos Apps

💻 🎉 An awesome & curated list of best applications powered by Steedos Platform.

- [Steedos Projects](https://github.com/steedos-labs/project): Track and manage your projects, milestones, tasks, blocked tasks, overdue tasks, time, expense budgets, and has detailed reporting capabilities.
- [Salesforce CRM Clone](https://github.com/steedos-labs/salesforce): Salesforce alternative, provides everything you need to manage your business. Generate the best leads, manage opportunities through the sales pipleline, and cultivate relationships with exisiting accounts. Plus, forecast revenues, set up sales territories, and organize your reps into selling teams.
- [Contract Management](https://github.com/steedos-labs/contract): Paper contracts are old school. With contract management software for Steedos, you can centralize contract storage, strengthen compliance, automate and accelerate the entire contract lifecycle, and much more.

[Find more](https://github.com/steedos-labs/)

## Steedos Docs

For more information, please refer to the official website of [docs.steedos.com](https://docs.steedos.com/)

## Contribute to Steedos Platform

From reporting bugs to proposing improvement suggestions, every contribution is worthy of appreciation and welcome. If you are going to modify the code to fix a bug or implement a new function, please create an issue first, so that we can ensure that your work is not wasted.

See [Contributing Guide](/CONTRIBUTING.md) for how to run and build our platform source code.

## Licence

Steedos Platform is licensed under the MIT. Everyone can build and distribute steedos apps for free. 

## Keep in Contact

If you have any questions or want to talk to other users of Steedos Platform , please jump to GitHub for discussion [Click to Discuss](https://github.com/steedos/steedos-platform/discussions).
