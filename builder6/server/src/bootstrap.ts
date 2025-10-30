import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import path, { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import compression from "compression";
import { urlencoded, json } from "express";
import { Logger } from "nestjs-pino";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import session from "express-session";
import { RedisStore } from "connect-redis";
import Redis from "ioredis";
import { parseURL } from "ioredis/built/utils";
import {
  createProxyMiddleware,
  fixRequestBody,
  debugProxyErrorsPlugin,
  loggerPlugin,
  errorResponsePlugin,
  proxyEventsPlugin,
} from "http-proxy-middleware";

import project from "../package.json";
import { AllExceptionsFilter } from "@builder6/core";
import { HybridAdapter } from "@builder6/core";
import express from "express";
import { readFileSync } from "fs";

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.forRoot(),
    {
      bufferLogs: true,
    },
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      ...parseURL(process.env.B6_CLUSTER_TRANSPORTER),
    } as any,
  });

  global["app"] = app;
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useWebSocketAdapter(new HybridAdapter(app));
  app.enableCors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
    credentials: true,
  });

  // 创建 Redis 客户端
  const redisClient = new Redis(process.env.B6_CLUSTER_CACHER);

  redisClient.on("error", (err) => {
    console.error("Redis 客户端错误:", err);
  });

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: process.env.SESSION_PREFIX || "steedos-session:",
  });
  app.use(
    session({
      store: redisStore,
      secret: process.env.B6_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Steedos API")
    .setDescription(
      "The Steedos is a comprehensive low-code platform designed to facilitate a wide range of functionalities and integrations.  \n\
      [Download OpenAPI Document](/api/v6-json)",
    )
    .addTag("Auth", "Manage authentication and authorization processes.")
    .addTag("Users", "Access to user profile and avatar. ")
    .addTag("Records", "Access and manage records with user permissions.")
    .addTag("Mongodb", "Access and manage records. Admin privileges required.")
    .addTag("Files", "Upload, download, and manage files.")
    .addTag(
      "Rooms",
      "Facilitate real-time collaboration and interaction in virtual rooms.",
    )
    .addTag(
      "Tables",
      "Organize and manage structured data with flexible database-like features",
    )
    .addTag("Pages", "Create and manage micro pages.")
    .addTag(
      "Services",
      "Create and manage micro services, Admin privileges required.",
    )
    .addTag(
      "Email",
      "Manage email configurations and communications. Admin privileges required.",
    )
    // .addTag(
    //   "Office",
    //   "Access and manage office-related resources. Admin privileges required.",
    // )
    // .addTag(
    //   "Microsoft365",
    //   "Integrate and manage Microsoft365 services, Admin privileges required.",
    // )
    .addTag("Docs", "Documentation services, Admin privileges required.")
    .addTag("Automation", "Manage automation tasks, Admin privileges required.")
    .addTag("Oidc", "Implement OpenID Connect for secure user authentication.")
    .addTag("App", "App services and related APIs.")
    .setVersion(project.version)
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/v6", app, documentFactory, {
    explorer: true,
    swaggerOptions: {
      docExpansion: "none", // This will collapse all endpoints by default
    },
  });

  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setViewEngine("hbs");

  app.use(cookieParser());
  app.use(json({ limit: "50mb" }));
  app.use(
    urlencoded({ extended: true, limit: "100mb", parameterLimit: 1000000 }),
  );
  app.use(compression());

  if (process.env.B6_PROXY_TARGET) {
    // 获取 Nest 应用的请求处理器
    const server = app.getHttpAdapter().getInstance();
    // 配置代理中间件
    server.use(
      "/",
      createProxyMiddleware({
        pathFilter: (path) => {
          return (
            !path.match("^/login/") &&
            !path.match("^/docs/") &&
            !path.match("^/api/v6") &&
            !path.match("^/b6/") &&
            !path.match("^/v7") &&
            !path.match("^/v2/c/")
          );
        },
        target: process.env.B6_PROXY_TARGET, // 目标 Express 应用的 URL
        changeOrigin: true,
        toProxy: true,
        ws: true, // 启用 WebSocket 支持
        on: {
          proxyReq: fixRequestBody,
        },
        followRedirects: true,
        ejectPlugins: true,
        logger: console,
        plugins: [
          debugProxyErrorsPlugin,
          loggerPlugin,
          errorResponsePlugin,
          proxyEventsPlugin,
        ],
      }),
    );
  }

  await app.startAllMicroservices();
  // console.log("Microservice is listening");

  process.on("uncaughtException", (error) => {
    console.error("uncaughtException:", error);
  });

  // global.logger = app.logger;
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
      "/ai/*react",
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

  await app.listen(process.env.B6_PORT ?? 5100);
}
