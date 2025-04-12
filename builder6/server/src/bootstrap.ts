import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import path, { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import compression from "compression";
import express, { urlencoded, json } from "express";
import { WsAdapter } from "@nestjs/platform-ws";
import { Logger } from "nestjs-pino";

import session from "express-session";
import {
  createProxyMiddleware,
  fixRequestBody,
  debugProxyErrorsPlugin,
  loggerPlugin,
  errorResponsePlugin,
  proxyEventsPlugin,
} from "http-proxy-middleware";

import project from "../package.json";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";

export async function bootstrap() {
  process.on("uncaughtException", (error) => {
    console.error("uncaughtException:", error);
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);
  global.logger = logger;
  app.useLogger(logger);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
    credentials: true,
  });
  app.use(
    session({
      secret: "your_session_secret",
      resave: false,
      saveUninitialized: false,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Builder6 API")
    .setDescription(
      "The Builder6 is a comprehensive low-code platform designed to facilitate a wide range of functionalities and integrations.  \n\
      [Download OpenAPI Document](/api/v6-json)",
    )
    .addTag("Auth", "Manage authentication and authorization processes.")
    .addTag("Users", "Access to user profile and avatar. ")
    .addTag("Records", "Access and manage records. Admin privileges required.")
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
    .addTag(
      "Office",
      "Access and manage office-related resources. Admin privileges required.",
    )
    .addTag(
      "Microsoft365",
      "Integrate and manage Microsoft365 services, Admin privileges required.",
    )
    // .addTag('Automation', 'Manage automation tasks, Admin privileges required.')
    .addTag("Oidc", "Implement OpenID Connect for secure user authentication.")
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

  await app.listen(process.env.B6_PORT ?? 5100);
}
