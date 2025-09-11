import path, { join } from "path";
import { AppController } from "./app.controller";
import { AppMoleculer } from "./app.moleculer";
import { AppGateway } from "./app.gateway";
import express from "express";

import { getMoleculerConfigs, getSteedosConfigs } from "./config";
import { InstanceFileController } from "./instance_files/file.controller";
import { FileService } from "./instance_files/file.service";
import { FileMoleculer } from "./instance_files/file.moleculer";
import { readFileSync } from "fs";

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

export const beforeServerStart = async ({ app }) => {
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

    const frontendRoutes = [
      "/",
      "/app",
      "/app/*react",
      "/logout",
      "/signup",
      "/login",
      "/create-space",
      "/select-space",
      "/update-password",
      "/verify/email",
      "/verify/mobile",
      "/home",
      "/home/:spaceId",
    ];
    expressApp.get(frontendRoutes, (req, res) => {
      const indexPath = join(webappDistPath, "index.html");
      // 同步读取 index.html 内容
      let indexHtml = readFileSync(indexPath, "utf8");
      indexHtml = indexHtml.replace(
        /https:\/\/unpkg\.com/g,
        process.env.STEEDOS_UNPKG_URL || "https://unpkg.com",
      );
      // 你的自定义脚本
      const BUILDER6_PUBLIC_SETTINGS = {
        unpkgUrl: process.env.STEEDOS_UNPKG_URL || "https://unpkg.com",
        rootUrl: process.env.STEEDOS_ROOT_URL || "",
      };
      const scriptTag = `
        <script>
          console.log("Server side script injected!");
          window.BUILDER6_PUBLIC_SETTINGS = ${JSON.stringify(BUILDER6_PUBLIC_SETTINGS)};
        </script>
      `;

      // 将脚本插入到 <head> 标签后面
      indexHtml = indexHtml.replace("<head>", `<head>\n  ${scriptTag}\n`);
      res.send(indexHtml);
    });
  }
};

// export const afterServerStart = () => {
//   console.log("afterServerStart......");
// };

export const controllers = [AppController, InstanceFileController];

export const providers = [AppMoleculer, AppGateway, FileService, FileMoleculer];
