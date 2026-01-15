
<p align="center">
  <a href="https://objectstack.ai">
    <img alt="Steedos Logo" src="./docs/images/logo.svg" width="100" />
  </a>
</p>

<h1 align="center">Steedos Platform</h1>

<p align="center">
  <strong>Evolving into <a href="https://objectstack.ai">ObjectStack</a>: The AI-Native Infrastructure.</strong>
</p>

<p align="center">
  <em>Metadata is the new Code.</em>
  <br/>
  <em>The open-source standard for AI-generated enterprise software.</em>
</p>

<div align="center">

[![NPM Version](https://img.shields.io/npm/v/@steedos/server.svg)](https://www.npmjs.com/package/@steedos/server)
[![Docker Pulls](https://img.shields.io/docker/pulls/steedos/steedos-community.svg)](https://hub.docker.com/r/steedos/steedos-community)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

</div>

<p align="center">
  <a href="./README_cn.md">中文 (Chinese)</a> •
  <a href="https://objectstack.ai/" target="_blank"><strong>New Website</strong></a> •
  <a href="https://docs.steedos.com/" target="_blank">Documentation</a> •
  <a href="https://github.com/steedos/steedos-templates">Examples</a> •
  <a href="https://github.com/steedos/steedos-platform/discussions">Community</a>
</p>

---

> [!IMPORTANT]
> **🚀 We are migrating to ObjectStack!**
> 
> Steedos Platform is undergoing a major architectural evolution. We are refactoring our core into **[ObjectStack](https://objectstack.ai)** — a modular, headless, and AI-native stack consisting of **ObjectQL** (Protocol), **ObjectOS** (Engine), and **Object UI** (Renderer).
>
> While Steedos Platform v2.x remains supported, future development is focused on the ObjectStack ecosystem.

---

## 📖 Introduction

**Steedos Platform** is the enterprise-grade implementation of the **ObjectStack** architecture. It combines the reliability of a Metadata Driven Architecture (similar to Salesforce) with the disruptive speed of Generative AI.

We are redefining how software is built. Instead of writing boilerplate code or manually dragging components, we provide a **Universal Metadata Standard (ObjectQL)** that allows AI to generate complex applications instantly.

### The ObjectStack Trinity
Steedos is built upon three independent yet synergistic pillars:

1.  **ObjectQL (The Protocol):** A unified language to define Data, Logic, and UI. It serves as the standard interface between AI and your software.
2.  **ObjectOS (The Engine):** A headless runtime kernel providing standardized APIs, Authentication, Permissions, and Workflow automation.
3.  **Object UI (The View):** A schema-driven rendering engine (based on React & Tailwind) that instantly transforms metadata into modern, responsive interfaces.

<br/>
<p align="center">
  <img src="https://docs.steedos.com/diagrams/steedos-overview.svg" width="100%" alt="ObjectStack Architecture">
</p>
<br/>

## ⚡ Why ObjectStack?

| Feature | ObjectStack (New Architecture) | Legacy Low-Code | Salesforce |
| :--- | :--- | :--- | :--- |
| **Philosophy** | 🤖 **AI-Native (Text-to-App)** | 🖱️ Drag & Drop | 🖱️ Click / Code |
| **Data Layer** | 🧬 **ObjectQL (Headless)** | 📄 Proprietary Schemas | 🔒 Closed Metadata |
| **UI Framework** | 🎨 **Object UI (React + Tailwind)** | 🐢 Vendor Specific | ⚠️ Aura / LWC |
| **Extensibility** | 🧩 **Modular Packages (@objectapp)** | ❌ Monolithic | ❌ Hard to extend |
| **Deployment** | ☁️ **Anywhere (Edge/Server)** | ☁️ Hybrid | 🔒 Cloud Only |

## 🌟 Core Capabilities

### 1. 🤖 AI Data Modeling (Powered by ObjectQL)
Stop manually defining database schemas. Just describe your business logic.
* **Text-to-Schema:** Tell the AI *"I need a Project Management system,"* and it generates standard `*.object.yml` files.
* **Database Agnostic:** Deploy the same metadata to MongoDB, PostgreSQL, or simple JSON files.
* **Instant APIs:** ObjectOS automatically exposes GraphQL and REST APIs for every model.

### 2. 🎨 Generative UI (Powered by Object UI)
Decoupled UI rendering for the modern web.
* **Schema-Driven Rendering:** No more hard-coded HTML. The UI is generated dynamically from `*.page.yml` metadata.
* **Tailwind & Shadcn:** Built with the latest frontend tech stack. Fully customizable via metadata attributes.
* **React Components:** Seamlessly inject custom React components into the standard page layout.

### 3. ⚡ Logic & Automation (Powered by ObjectOS)
Business logic shouldn't be a black box.
* **Flow & Triggers:** Define automated workflows using simple YAML configurations or TypeScript functions.
* **Enterprise Security:** Built-in RBAC (Role-Based Access Control) down to the field level.
* **Microservices Ready:** Architecture designed to run as independent services communicating via standard protocols.

## 🏗️ Architecture Transition

We are moving from a monolithic structure to a monorepo workspace containing:

* **`@objectql/spec`**: The core type definitions and JSON schemas.
* **`objectql`**: The server-side ORM and runtime engine.
* **`@object-ui/react`**: The frontend rendering engine.
* **`@objectapp/*`**: Modular business application packages (CRM, ERP, etc.).

## 🚀 Quick Start

### Option 1: Docker (Fastest)

Run the latest stable version of Steedos (pre-ObjectStack transition complete):

```bash
docker run -d -p 80:80 steedos/steedos-community:3.0

```

### Option 2: Create New App

Initialize a project using our scaffolding tool:

```bash
npx create-steedos-app my-app
cd my-app
yarn install && yarn start

```

Visit `http://localhost:5100` and start building with AI.

## 🤝 Community & Contributing

Steedos and ObjectStack are open-source projects. We are actively exploring the frontiers of **AI x Metadata**.

* 🐛 **Report Issues**: [GitHub Issues](https://github.com/steedos/steedos-platform/issues)
* 💬 **Discussions**: [GitHub Discussions](https://github.com/steedos/steedos-platform/discussions)
* 🌍 **Website**: [objectstack.ai](https://www.google.com/url?sa=E&source=gmail&q=https://objectstack.ai)

## Contact Us

<img src="https://www.steedos.com/img/QR_contact1.png" width="500" alt="Contact Steedos" />
