import { Module } from "@nestjs/common";
import { ObjectsController } from "./objects.controller";
import { ObjectsService } from "./objects.service";

@Module({
  controllers: [ObjectsController],
  providers: [ObjectsService],
})
export class ObjectsModule {}
