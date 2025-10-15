import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { AuthModule } from "@builder6/core";
import { ChatController } from "./chat.controller";

@Module({
  imports: [AuthModule],
  controllers: [AiController, ChatController],
  providers: [AiService],
})
export class AiModule {}
