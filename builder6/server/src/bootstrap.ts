import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { urlencoded, json } from 'express';
import { WsAdapter } from '@nestjs/platform-ws';
import { Logger } from 'nestjs-pino';

import session from 'express-session';
import {
  createProxyMiddleware,
  fixRequestBody,
  debugProxyErrorsPlugin,
  loggerPlugin,
  errorResponsePlugin,
  proxyEventsPlugin,
} from 'http-proxy-middleware';

import project from '../package.json';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });
  app.use(
    session({
      secret: 'your_session_secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Builder6 API')
    .setDescription(
      'The Builder6 is a comprehensive low-code platform designed to facilitate a wide range of functionalities and integrations.  \n\
      [Download OpenAPI Document](/api/v6-json)',
    )
    .addTag('Auth', 'Manage authentication and authorization processes.')
    .addTag('Users', 'Access to user profile and avatar. ')
    .addTag('Records', 'Access and manage records. Admin privileges required.')
    .addTag('Files', 'Upload, download, and manage files.')
    .addTag(
      'Rooms',
      'Facilitate real-time collaboration and interaction in virtual rooms.',
    )
    .addTag(
      'Tables',
      'Organize and manage structured data with flexible database-like features',
    )
    .addTag('Pages', 'Create and manage micro pages.')
    .addTag(
      'Services',
      'Create and manage micro services, Admin privileges required.',
    )
    .addTag(
      'Email',
      'Manage email configurations and communications. Admin privileges required.',
    )
    .addTag(
      'Office',
      'Access and manage office-related resources. Admin privileges required.',
    )
    .addTag(
      'Microsoft365',
      'Integrate and manage Microsoft365 services, Admin privileges required.',
    )
    // .addTag('Automation', 'Manage automation tasks, Admin privileges required.')
    .addTag('Oidc', 'Implement OpenID Connect for secure user authentication.')
    .setVersion(project.version)
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v6', app, documentFactory, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'none', // This will collapse all endpoints by default
    },
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');

  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(
    urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }),
  );
  app.use(compression());

  app.use(require('@steedos/router').staticRouter());
  // app.use(SteedosApi.express());



  // if (process.env.B6_PROXY_TARGET) {
  //   // 获取 Nest 应用的请求处理器
  //   const server = app.getHttpAdapter().getInstance();
  //   // 配置代理中间件
  //   server.use(
  //     '/',
  //     createProxyMiddleware({
  //       pathFilter: (path) => {
  //         return (
  //           !path.match('^/api/v6') &&
  //           !path.match('^/b6/') &&
  //           !path.match('^/api/automation') &&
  //           !path.match('^/v7') &&
  //           !path.match('^/v2/c/')
  //         );
  //       },
  //       target: process.env.B6_PROXY_TARGET, // 目标 Express 应用的 URL
  //       changeOrigin: true,
  //       toProxy: true,
  //       ws: true, // 启用 WebSocket 支持
  //       on: {
  //         proxyReq: fixRequestBody,
  //       },
  //       followRedirects: true,
  //       ejectPlugins: true,
  //       logger: console,
  //       plugins: [
  //         debugProxyErrorsPlugin,
  //         loggerPlugin,
  //         errorResponsePlugin,
  //         proxyEventsPlugin,
  //       ],
  //     }),
  //   );
  // }

  await app.listen(process.env.B6_PORT ?? 5100);
}
