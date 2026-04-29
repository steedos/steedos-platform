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
import { AllExceptionsFilter, MongodbService } from "@builder6/core";
import { HybridAdapter } from "@builder6/core";
import express from "express";
import { readFileSync } from "fs";
import * as net from "net";

function checkPortAvailable(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        reject(new Error(
          `启动失败: 端口 ${port} 已被占用，请先停止占用该端口的进程，或通过环境变量 B6_PORT 指定其他端口。`
        ));
      } else {
        reject(err);
      }
    });
    server.once('listening', () => {
      server.close(() => resolve());
    });
    server.listen(port);
  });
}

// Cached OEM favicon URL (with TTL)
let _cachedFaviconUrl: string | undefined;
let _faviconCacheExpiry = 0;
const FAVICON_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let _mongodbService: MongodbService | null = null;

async function getOemFaviconUrl(): Promise<string> {
  const now = Date.now();
  if (_cachedFaviconUrl !== undefined && now < _faviconCacheExpiry) {
    return _cachedFaviconUrl;
  }

  try {
    const platform = ((global as any).Steedos?.settings?.PUBLIC_SETTINGS || {}).platform || {};
    if (!platform.is_oem) {
      _cachedFaviconUrl = '';
      _faviconCacheExpiry = now + FAVICON_CACHE_TTL;
      return '';
    }

    const tenantId = process.env.STEEDOS_TENANT_ID;
    if (!tenantId || !_mongodbService) {
      _cachedFaviconUrl = '';
      _faviconCacheExpiry = now + FAVICON_CACHE_TTL;
      return '';
    }

    const spaceDoc = await _mongodbService.findOne('spaces', { _id: tenantId }, { projection: { favicon: 1 } });

    if (spaceDoc && spaceDoc.favicon) {
      _cachedFaviconUrl = `/api/v6/files/cfs.avatars.filerecord/${spaceDoc.favicon}`;
    } else {
      _cachedFaviconUrl = '';
    }
    _faviconCacheExpiry = now + FAVICON_CACHE_TTL;
  } catch (e) {
    // Don't cache on error so we retry next request
    return '';
  }

  return _cachedFaviconUrl;
}

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      ...parseURL(process.env.B6_CLUSTER_TRANSPORTER),
    } as any,
  });

  global["app"] = app;
  _mongodbService = app.get(MongodbService);
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

  // app.useStaticAssets(join(__dirname, "..", "public"));
  app.setViewEngine("hbs");

  app.use(cookieParser());
  app.use(json({ limit: "50mb" }));
  app.use(
    urlencoded({ extended: true, limit: "100mb", parameterLimit: 1000000 }),
  );
  app.use(compression());

  if (process.env.STEEDOS_CLOUD_URL) {
    // 获取 Nest 应用的请求处理器
    const server = app.getHttpAdapter().getInstance();
    // 配置代理中间件
    server.use(
      "/api/cloud",
      createProxyMiddleware({
        target: process.env.STEEDOS_CLOUD_URL, // 目标 Express 应用的 URL
        changeOrigin: true,
        toProxy: true,
        ws: true, // 启用 WebSocket 支持
        on: {
          proxyReq: fixRequestBody,
        },
        followRedirects: true,
        ejectPlugins: true,
        // logger: console,
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
    expressApp.get(frontendRoutes, async (req, res) => {
      const indexPath = join(webappDistPath, "index.html");
      // 同步读取 index.html 内容
      let indexHtml = readFileSync(indexPath, "utf8");
      indexHtml = indexHtml.replace(
        /https:\/\/unpkg\.com/g,
        process.env.STEEDOS_UNPKG_URL || "https://unpkg.com",
      );

      // OEM favicon: replace default favicon with custom one
      const oemFaviconUrl = await getOemFaviconUrl();
      if (oemFaviconUrl) {
        indexHtml = indexHtml.replace(
          /href="\/images\/logo\.svg"/,
          `href="${oemFaviconUrl}"`,
        );
      }

      // OEM title: replace default title with licensed_to value
      const platformSettings = ((global as any).Steedos?.settings?.PUBLIC_SETTINGS || {}).platform || {};
      if (platformSettings.is_oem && platformSettings.licensed_to) {
        indexHtml = indexHtml.replace(
          /<title>Steedos<\/title>/,
          `<title>${platformSettings.licensed_to}</title>`,
        );
      }
      // 你的自定义脚本
      const BUILDER6_PUBLIC_SETTINGS = {
        unpkgUrl: process.env.STEEDOS_UNPKG_URL || "https://unpkg.com",
        rootUrl: process.env.STEEDOS_ROOT_URL || "",
      };
      const jsPlugins = process.env.STEEDOS_PUBLIC_SCRIPT_PLUGINS || "";
      const cssPlugins = process.env.STEEDOS_PUBLIC_STYLE_PLUGINS || "";
      let injectedScripts = `
        <script>
          console.log("Server side script injected!");
          window.BUILDER6_PUBLIC_SETTINGS = ${JSON.stringify(BUILDER6_PUBLIC_SETTINGS)};
        </script>
      `;
      if (jsPlugins) {
        jsPlugins.split(",").forEach((pluginUrl) => {
          injectedScripts += `<script src="${pluginUrl.trim()}"></script>\n`;
        });
      }
      if (cssPlugins) {
        cssPlugins.split(",").forEach((pluginUrl) => {
          injectedScripts += `<link rel="stylesheet" href="${pluginUrl.trim()}" />\n`;
        });
      }

      // 将脚本插入到 <head> 标签后面
      indexHtml = indexHtml.replace("<head>", `<head>\n  ${injectedScripts}\n`);
      res.send(indexHtml);
    });

    expressApp.use("/", express.static(webappDistPath));
  }

  const port = Number(process.env.B6_PORT) || 5100;
  await checkPortAvailable(port);
  await app.listen(port);
}
