import { Module, Logger } from "@nestjs/common";
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
import {
  getConfigs,
  getEnvConfigs,
  getMoleculerConfigs,
  getSteedosConfigs,
} from "./config";
import project from "../package.json";
import { ScheduleModule } from "@nestjs/schedule";

import { pinoConfig } from "@builder6/core";
import { AppMoleculer } from "./app.moleculer";

const steedosConfig = getSteedosConfigs();
const moleculerConfig = {
  // brokerName: "builder6", // if you have multiple broker
  // hotReload: true, // hotReload feature from moleculer will not work
  ...getMoleculerConfigs(),
  ...steedosConfig,
  ...getEnvConfigs(),
  namespace: "steedos", // some moleculer options
  transporter: process.env.B6_TRANSPORTER,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfigs],
      isGlobal: true, // 使配置在整个应用中可用
    }),
    LoggerModule.forRoot(pinoConfig),
    MoleculerModule.forRoot(moleculerConfig),
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
    PluginModule.forRootAsync(),
  ],
  controllers: [AppController],
  providers: [AppMoleculer],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  onModuleInit() {}
}

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
