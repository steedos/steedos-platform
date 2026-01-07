<p align="center">
  <a href="https://docs.steedos.com/en/">
    <img alt="Steedos Logo" src="./docs/images/logo.svg" width="100" />
  </a>
</p>

<h1 align="center">Steedos Platform</h1>

<p align="center">
  <strong>The AI-Native Low-Code Platform for Enterprise</strong>
</p>

<p align="center">
  <em>Prompt to App. Fusing Generative AI with a Metadata-Driven Core.</em>
  <br/>
  <em>Build data models, UIs, and microservices in minutes—not months.</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@steedos/server"><img src="https://img.shields.io/npm/v/@steedos/server.svg" alt="NPM Version"></a>
  <a href="https://hub.docker.com/r/steedos/steedos-community"><img src="https://img.shields.io/docker/pulls/steedos/steedos-community.svg" alt="Docker Pulls"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

<p align="center">
  <a href="./README_cn.md">中文 (Chinese)</a> •
  <a href="https://www.steedos.com/" target="_blank">Website</a> •
  <a href="https://docs.steedos.com/" target="_blank">Documentation</a> •
  <a href="https://github.com/steedos/steedos-templates">Examples</a> •
  <a href="https://github.com/steedos/steedos-platform/discussions">Community</a>
</p>

<br/>

## 📖 Introduction

**Steedos Platform** represents the next evolution of low-code development. We combine the proven reliability of a **Metadata Driven Architecture** (similar to Salesforce) with the disruptive speed of **Generative AI**.

Instead of manually dragging and dropping components, Steedos allows you to use **Natural Language** to orchestrate the creation of enterprise-grade systems. The AI Engine automatically generates the metadata, code, and APIs, while our robust kernel ensures security, scalability, and transactional integrity.

Whether building CRM, ERP, or complex industry solutions, Steedos empowers you to achieve **10x development efficiency** while maintaining full control over your source code and data.

<br/>
<p align="center">
  <img src="https://docs.steedos.com/diagrams/steedos-overview.svg" width="100%" alt="Steedos Platform Architecture">
</p>
<br/>

## ⚡ Why Steedos?

| Feature | Steedos Platform (AI Native) | Salesforce | Traditional Low-Code |
| :--- | :--- | :--- | :--- |
| **Development Paradigm** | 🤖 **AI-First (Prompt-Driven)** | 🖱️ Click / Code | 🖱️ Drag & Drop |
| **Core Architecture** | 🧠 **Metadata Driven** | 🧠 Metadata Driven | 📄 Hard-coded Schemas |
| **Tech Stack** | ⚛️ **Node.js + React + Amis** | ⚠️ Proprietary (Apex/Aura) | 🐢 Vendor Specific |
| **Microservices** | 🚀 **Auto-Generated (Standard Code)** | ❌ Difficult to extend | ❌ Black Box |
| **Deployment** | ☁️ **On-Prem / Private Cloud** | 🔒 Public Cloud Only | ☁️ Hybrid |
| **Cost** | 💰 **Open Source** | 💰💰💰 Expensive Subscription | 💰💰 Seat-based Pricing |

## 🌟 Core Capabilities

### 1. 🤖 AI Data Modeling (Copilot)
Stop manually defining database schemas. Just describe your business logic.
* **Text-to-Schema:** Tell the AI *"I need a Project Management system with Projects, Tasks, and Milestones,"* and it instantly generates the Entity Relationship Diagram (ERD) and Metadata.
* **Smart Relationships:** Automatically handles Lookup, Master-Detail, and Roll-up Summary relationships.
* **API Ready:** Instantly exposes GraphQL and RESTful APIs for every generated model.

### 2. 🎨 Generative UI & Page Designer
Create complex enterprise interfaces using conversation.
* **Text-to-UI:** Deeply integrated with the **Baidu Amis** framework. Describe a page (e.g., *"A dashboard showing sales revenue by region and a list of high-priority leads"*), and the AI generates the JSON configuration.
* **Visual Editor:** Fine-tune the AI-generated results with our drag-and-drop designer.
* **Responsive:** Automatically adapts to Mobile, Tablet, and Desktop.

### 3. ⚡ AI Microservices & Logic
Business logic shouldn't be a black box.
* **Text-to-Code:** Describe your automation rules (e.g., *"When a contract status changes to 'Signed', calculate the commission and notify the manager"*), and Steedos generates standard **Node.js** code.
* **Workflow Engine:** Built-in engine for Approvals, Webhooks, and time-based triggers.
* **Sandboxed Execution:** Run AI-generated logic safely within the platform.

### 4. 🛡️ Enterprise-Grade Foundation
AI brings the speed; our Core brings the stability.
* **Security:** Granular permission control (Object, Field, and Record-level Sharing Rules).
* **Org Management:** Comprehensive Users, Roles, Profiles, and Permission Sets.
* **DX (Developer Experience):** All metadata is stored as YAML/JSON files. Full GitOps support for CI/CD pipelines.

## 🏗️ Architecture

Steedos is built on a modern, open-source stack designed for microservices.

* **AI Engine:** LLM Integration Layer (OpenAI / Compatible Models)
* **Backend:** Node.js, Moleculer (Microservices), MongoDB (Metadata), SQL (Data)
* **Frontend:** React, Amis (Baidu's Low-Code Framework)

## 🚀 Quick Start

### Option 1: Docker (Fastest)

Run the Steedos Community Edition with a single command:

```bash
docker run -d -p 80:80 steedos/steedos-community:3.0

```

### Option 2: Create New Project (For Developers)

Initialize a standard project to start customizing:

```bash
# Create project
npx create-steedos-app my-project

# Enter directory and install dependencies
cd my-project
yarn install

# Start the server
yarn start

```

Visit `http://localhost:5100` and start building with AI.

## 🤝 Community & Contributing

Steedos is a fully open-source project. We are actively exploring the frontiers of **AI x Low-Code**.

* 🐛 **Report Issues**: [GitHub Issues](https://github.com/steedos/steedos-platform/issues)
* 💬 **Discussions**: [GitHub Discussions](https://github.com/steedos/steedos-platform/discussions)

## Contact Us

<img src="https://www.steedos.com/img/QR_contact1.png" width="500" alt="Contact Steedos" />
