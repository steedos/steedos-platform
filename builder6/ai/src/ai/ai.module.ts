import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { AuthModule } from "@builder6/core";
import { MongodbModule } from "@builder6/core";
import { AiMoleculer } from "./ai.moleculer";

@Module({
  imports: [AuthModule, MongodbModule],
  controllers: [AiController],
  providers: [AiService, AiMoleculer],
})
export class AiModule {}
