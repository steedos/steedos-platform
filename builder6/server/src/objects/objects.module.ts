import { Module } from "@nestjs/common";
import { ObjectsController } from "./objects.controller";
import { ObjectsService } from "./objects.service";
import { AuthModule } from "@builder6/core";
import { FunctionsController } from "./functions.controller";

@Module({
  imports: [AuthModule],
  controllers: [ObjectsController, FunctionsController],
  providers: [ObjectsService],
})
export class ObjectsModule {}
