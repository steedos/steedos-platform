# Steedos Example App

This is an enterprise-grade low-code/no-code application built on the [Steedos Platform](https://www.steedos.com/).

This project was scaffolded using `create-steedos-app`. It provides a foundation for rapid metadata modeling, API extensions, and business logic development.

## 🛠 Prerequisites

Before you begin, ensure you have the following installed in your development environment:

  - **Node.js**: v22.0 or higher
  - **MongoDB**: v7.0 or higher
  - **Redis**: 
  - **Yarn**

## 🚀 Quick Start

### 1. Start Db Services

Make sure your MongoDB and Redis services are running. You can start them using the following commands:

```bash
yarn start:db
```
### 2. Install Dependencies

Run the following command in the project root to install the required Node packages:

```bash
yarn install
yarn
```

### 3. Start the Server

Start the development server. Steedos will output the access URL in the console.

```bash
yarn start
```

### 4. Access the Application

Once the server starts successfully, open your browser and visit:
`http://localhost:5100` (Default port)


## 📂 Project Structure

Here is an overview of the core file structure:

```text
my-project/
├── .env                                  # Environment variables (Do not commit sensitive info)
├── .env.local                            # Local environment overrides
├── package.json                          # Project dependencies and scripts
├── steedos-config.js                     # Core Steedos configuration
├── steedos-packages/example-app/         # Core app directory
│   ├── main/
│   │   └── default/
│   │       ├── objects/                  # Object definitions (Metadata)
│   │       ├── app/                      # app definitions (Metadata)
│   └── package.json                      # Business package definition
```

## ⚙️ Configuration

Create or modify the `.env` file in the project root to configure the database connection and service ports:

```shell
# Service Port
PORT=5100

# Database Connection (MongoDB)
MONGO_URL=mongodb://127.0.0.1:27017/steedos

# Root URL (Important for attachments and API callbacks)
ROOT_URL=http://localhost:5100

# Metadata Storage Directory
STEEDOS_STORAGE_DIR=./storage
```

## 💻 Development Guide

### Exporting Metadata

If you modify configurations via the UI (Steedos Objects), you can sync changes back to your local code using the Steedos command line tools or the VS Code extension.
## 📚 Resources

  - [Steedos Documentation](https://docs.steedos.com/)
  - [Steedos GitHub Repository](https://github.com/steedos/steedos-platform)
