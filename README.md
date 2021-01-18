
<p align="center">
  <a href="https://www.steedos.org">
    <img alt="Steedos" src="https://steedos.github.io/assets/logo.png" width="80" />
  </a>
</p>
<h1 align="center">
  Steedos Platform
</h1>

<p align="center">
<a href="https://github.com/steedos/steedos-platform/blob/1.22/README_cn.md">中文</a>
<a href="http://www.steedos.org/docs/overview"> · Docs</a>
<a href="https://github.com/steedos/steedos-platform/issues/"> · Report a bug</a>
<a href="https://github.com/steedos/steedos-platform/discussions"> · Discussions</a>
</p>

<p align="center">
Steedos Platform is an open source alternative to salesforce low code development platform. You can easily create intelligent and mobile enterprise applications by clicking the mouse.
</p>

<h3 align="center">
 🤖 🎨 🚀
</h3>

## Click, Not Code

Traditional programming, denotes the means of programming by using certain coding languages, to tell a computer exactly how to perform an action. 

On the other hand, declarative programming accomplishes the same results by basically telling the computer the end result and letting the computer figure out how to get there.

Steedos is such an declarative programming platform.  Steedos empowers business owners with all of the tools of a developer, without requiring an advanced skill set.

With drag-and-drop simplicity, just about anyone can create apps that automate business processes. The apps you create for your business can be deployed on mobile, tablet and web, be simple or complex, and connect to nearly any data source.

## Based on Metadata

Metadata is core to the steedos infrastructure. Metadata relates to the objects, fields, configurations, code, logic, and page layouts that go into building the information architecture and look and feel of your steedos apps.

There are several types of Metadata, with each one representing a unique way a business function can be customized. Here are a few broad categories for Metadata types:

- **Data**: the core components of the data structure on which most customization is built. E.g. Custom Objects, Fields, and Custom Apps.
- **Programmability**: custom code developed on top of the platform. E.g. Buttons, Form Events, Triggers.
- **Presentation**: customization on how users interact with the platform. E.g. Components, List View and Page Layouts.

## Supported Metadata Types

- **Custom Objects**: Create custom objects to store information that’s unique to your organization. Choose whether your custom objects are searchable, support sharing, or include access to the Bulk API and Streaming API.

- **Formula**: A formula is an algorithm that derives its value from other fields, expressions, or values. Formulas can help you automatically calculate the value of a field based on other fields.

- **Validation Rules**: Improve the quality of your data using validation rules. Validation rules verify that the data a user enters in a record meets the standards you specify before the user can save the record. 

- **Workflow Rules**: Workflow lets you automate standard internal procedures and processes to save time across your org. A workflow rule is the main container for a set of workflow instructions. These instructions can always be summed up in an if/then statement.

- **Automated Actions**: An automated action is a reusable component that performs some sort of action behind the scenes—like updating a field or sending an email. Once you create an automated action, add it to a process, milestone, or other automated process.

- **Approval Process**:  Different from process automation in the form of workflow rules. Approvals take automation one step further, letting you specify a sequence of steps that are required to approve a record.

- **Report & Dashboard**: Steedos offers a powerful suite of reporting tools that work together to help you understand and act on your data.

## Installation

Steedos is essentially a set of npm packages that can be installed over npm. 

The easiest way to install Steedos is to use the command line tool that helps you create a template project. You can run this command anywhere in a new empty repository or within an existing repository, it will create a new directory containing the scaffolded files.

```bash
npx create-steedos-app my-app
cd my-app
yarn
yarn start
```

or you can try the following sample projects.

- [Project Management App](https://github.com/steedos/project-management-app)
- [Customer Relationship Management](https://github.com/steedos/steedos-app-crm)

## Steedos Project

Steedos project is native [Node.js](https://nodejs.org/en/download/) (version >= 10.15.1) project, use [MongoDB](https://www.mongodb.com/try/download/) (version >= 4.2) to save metadata and data.

Developers can define metadata in project source code, or via product interface.

Developers can add business logic to most system events, including button clicks, related record updates, and customized pages. Code can be initiated by Web service requests and from triggers on objects.

### Project Structure

```sh
my-app
├── steedos-app/main/default
│   ├── applications
│   │   └── myApp.app.yml
│   └── objects
│       └──todo__c
│           ├── buttons
│           │   └── markDown.button.yml
│           │   └── markDown.button.js
│           ├── fields
│           │   └── name.field.yml
│           │   └── description.field.yml
│           │   └── isDone.field.yml
│           │   └── ...
│           ├── listviews
│           │   └── all.listview.yml
│           │   └── recent.listview.yml
│           │   └── my.listview.yml
│           ├── permissions
│           │   └── user.permission.yml
│           │   └── admin.permission.yml
│           └── todo.object.yml
│           └──...
├── .env
├── .gitignore
├── package.json
├── README.md
├── server.js
├── steedos-config.yml
└── yarn.lock
```


### Metadata Example

Steedos use the following yml file to describe an object field.

```yml
name: rating
label: Rating
type: select
sortable: true
options:
  - label: Hot
    value: hot
  - label: Warm
    value: warm
  - label: Cold
    value: cold
inlineHelpText: How do you classify this customer level, for example, hot, warn or cold.
sort_no: 270
```

## Steedos DX

With Steedos DX, metadata can be imported into Steedos, modified in the product interface, and synchronize back to project source code. 

Steedos DX introduces a new way to organize your metadata and distribute your apps. You can benefit from modern collaboration technologies such as Git to version control everything across your team - your code, your org configuration, and your metadata. 

To make this possible, we're enabling you to export your metadata, define data import files, and easily specify the edition, features, and configuration options of your development, staging, and production environments.

![Steedos Overview](http://www.steedos.org/assets/platform/platform-overview.png)

Steedos DX is licenced per developer. We provide Steedos DX free license for open source projects and educational institutions.

## Awesome Steedos Apps

💻 🎉 An awesome & curated list of best applications powered by Steedos Platform.

- [PM (Project Management)](https://github.com/steedos/project-management-app): Track and manage your projects, milestones, tasks, blocked tasks, overdue tasks, time, expense budgets, and has detailed reporting capabilities.
- [CRM (Customer Relationship Management)](https://github.com/steedos/steedos-app-crm): Salesforce alternative, provides everything you need to manage your business. Generate the best leads, manage opportunities through the sales pipleline, and cultivate relationships with exisiting accounts. Plus, forecast revenues, set up sales territories, and organize your reps into selling teams.
- [OKR (Objectives and Key Results)](https://github.com/steedos/okr-management-app): Objectives and Key Results (OKR) is a critical thinking framework and goal setting methodology that helps companies to align goals and ensure everyone is working collaboratively on goals that really matter.
- [B2B Commerce](https://github.com/steedos/b2b-commerce): Design, build, and launch a business-to-business (B2B) commerce solution that enables retailers, wholesalers, or distributors to purchase goods or services from your brand. Powered by Steedos and Next.js Commerce.
- [Contract Management](https://github.com/steedos/steedos-app-contract): Paper contracts are old school. With contract management software for Steedos, you can centralize contract storage, strengthen compliance, automate and accelerate the entire contract lifecycle, and much more.

[Find more](https://github.com/steedos/awesome-steedos-apps)

## Steedos Docs

For more information, please refer to the official website of [www.steedos.org](https://www.steedos.org/)

## Contribute to Steedos Platform

From reporting bugs to proposing improvement suggestions, every contribution is worthy of appreciation and welcome. If you are going to modify the code to fix a bug or implement a new function, please create an issue first, so that we can ensure that your work is not wasted.

See [Contributing Guide](/CONTRIBUTING.md) for how to run and build our platform source code.

## Licence

Steedos Platform is licensed under the MIT. Everyone can build and distribute steedos apps for free. 

## Keep in Contact

If you have any questions or want to talk to other users of Steedos Platform , please jump to GitHub for discussion [Click to Discuss](https://github.com/steedos/steedos-platform/discussions) or [Join me on Slack-it's a faster,simpler way to work](https://join.slack.com/t/steedos/shared_invite/zt-jq7eupr9-cgKrUOyWb1zymniRzhH4jg).
