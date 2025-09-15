import { Module } from "@nestjs/common";
import { DataController } from "./data/data.controller";
import { DataService } from "./data/data.service";
import { AuthModule } from "@builder6/core";

@Module({
  imports: [AuthModule],
  controllers: [DataController],
  providers: [DataService],
})
export class ApiModule {}
