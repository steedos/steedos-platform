import { Module } from "@nestjs/common";
import { InstanceFileController } from "./file.controller";
import { FileMoleculer } from "./file.moleculer";
import { FileService } from "./file.service";
import { MongodbModule } from "@builder6/core";
import { FilesModule } from "@builder6/files";
import { AuthModule } from "@builder6/core";

@Module({
  imports: [MongodbModule, FilesModule, AuthModule],
  providers: [FileService, FileMoleculer],
  controllers: [InstanceFileController],
})
export class WorkflowModule {}
