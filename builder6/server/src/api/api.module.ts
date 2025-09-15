import { Module } from "@nestjs/common";
import { DataController } from "./data/data.controller";
import { DataService } from "./data/data.service";

@Module({
  controllers: [DataController],
  providers: [DataService],
})
export class ApiModule {}
