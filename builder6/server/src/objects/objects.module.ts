import { Module } from "@nestjs/common";
import { ObjectsController } from "./objects.controller";
import { ObjectsService } from "./objects.service";
import { AuthModule } from "@builder6/core";

@Module({
  imports: [AuthModule],
  controllers: [ObjectsController],
  providers: [ObjectsService],
})
export class ObjectsModule {}
