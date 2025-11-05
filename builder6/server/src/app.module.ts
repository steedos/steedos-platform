import { Module, Logger, DynamicModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";

import { MongodbModule } from "@builder6/core";
import { TablesModule } from "@builder6/tables";
import { AuthModule } from "@builder6/core";
import { SteedosModule } from "@builder6/steedos";
import { RoomsModule } from "@builder6/rooms";
import { FilesModule } from "@builder6/files";
import { MoleculerModule } from "@builder6/moleculer";
import { SharepointModule } from "@builder6/sharepoint";
import { OidcModule } from "@builder6/oidc";
import { AppController } from "./app.controller";
import { PluginModule } from "@builder6/core";
import { EmailModule } from "@builder6/email";
import { PagesModule } from "@builder6/pages";
import { ServicesModule } from "@builder6/services";
import { getConfigs, getEnvConfigs } from "@builder6/core";
import project from "../package.json";
import { ScheduleModule } from "@nestjs/schedule";
import { OnlyOfficeModule } from "@builder6/onlyoffice";
import { DocsModule } from "@builder6/docs";
import { AiModule } from "@steedos/ai";

import { pinoConfig } from "@builder6/core";

import { MicroserviceModule } from "@builder6/microservices";
import { WorkflowModule } from "./workflow/workflow.module";
import { AppMoleculer } from "./app.moleculer";
import { AppGateway } from "./app.gateway";

import { getMoleculerConfigs, getSteedosConfigs } from "./config";
import { ApiModule } from "./api/api.module";
import { ObjectsModule } from "./objects/objects.module";
import { OidcProviderModule } from "@builder6/oidc-provider";

// 合并配置函数
const getMoleculerConfig = () => {
  const config = {
    // brokerName: "builder6", // if you have multiple broker
    namespace: "steedos", // some moleculer options
    transporter: process.env.B6_TRANSPORTER,
    // hotReload: true, // hotReload feature from moleculer will not work
    ...getMoleculerConfigs(),
    ...getSteedosConfigs(),
    ...getEnvConfigs(),
  };

  return config;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfigs],
      isGlobal: true, // 使配置在整个应用中可用
    }),
    LoggerModule.forRoot(pinoConfig),
    MoleculerModule.forRoot(getMoleculerConfig()),
    AuthModule,
    MongodbModule,
    ScheduleModule.forRoot(),
    SteedosModule,
    FilesModule,
    EmailModule,
    ServicesModule,
    TablesModule,
    PagesModule,
    RoomsModule,
    SharepointModule,
    OidcModule,
    OidcProviderModule,
    OnlyOfficeModule,
    DocsModule,
    PluginModule.forRootAsync(),
    MicroserviceModule,
    WorkflowModule,
    ApiModule,
    ObjectsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppMoleculer, AppGateway],
})
export class AppModule {}

const configs = getConfigs();
console.log(
  "*************************************************************************************",
);
console.log("*");
console.log(`*  Steedos Server ...`);
console.log("*");
console.log(`*  VERSION: ${project.version}`);
console.log("*");
console.log(`*  PORT: ${configs.port}`);
console.log(`*  MONGO_URL: ${configs.mongo.url}`);
console.log(`*  PROJECT_DIR: ${configs.home}`);
console.log("*");
console.log(
  "*************************************************************************************",
);
console.log(configs);
