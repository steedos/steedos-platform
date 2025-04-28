import path, { join } from "path";
import { AppController } from "./app.controller";
import { AppMoleculer } from "./app.moleculer";
import express from "express";

import { getMoleculerConfigs, getSteedosConfigs } from "./config";

const steedosConfig = getSteedosConfigs();

export const modulesConfig = {
  moleculer: (config) => {
    return {
      ...config,
      ...getMoleculerConfigs(),
      ...steedosConfig,
    };
  },
};

export const beforeServerStart = ({ app }) => {
  process.on("uncaughtException", (error) => {
    console.error("uncaughtException:", error);
  });

  global.logger = app.logger;
  // 获取 Express App
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.use(require("@steedos/router").staticRouter());

  // 加载 webapp
  const webappPackagePath = require.resolve("@steedos/webapp/package.json");
  // Derive the path to the 'dist' directory
  const webappDistPath = path.join(path.dirname(webappPackagePath), "dist");

  // Use express.static to serve files from the 'dist' directory
  if (webappPackagePath) {
    expressApp.use("/", express.static(webappDistPath));
    expressApp.get("/app/*react", (req, res) => {
      res.sendFile(path.join(webappDistPath, "index.html"));
    });

    const frontendRoutes = [
      "/logout",
      "/signup",
      "/login",
      "/",
      "/create-space",
      "/select-space",
      "/update-password",
      "/verify/email",
      "/verify/mobile",
      "/home",
      "/home/:spaceId",
      "/app",
      "/app/:appId",
      "/app/:appId/page/:pageId",
      "/app/:appId/:objectName",
      "/app/:appId/:objectName/grid/:listviewId",
      "/app/:appId/:objectName/:recordId/:relatedObjectName/grid",
      "/app/:appId/:objectName/view/:recordId",
      "/app/:appId/tab_iframe/:tabId",
    ];
    expressApp.get(frontendRoutes, (req, res) => {
      res.sendFile(path.join(webappDistPath, "index.html"));
    });
  }
};

export const afterServerStart = () => {
  console.log("afterServerStart......");
};

export const controllers = [AppController];

export const providers = [AppMoleculer];
