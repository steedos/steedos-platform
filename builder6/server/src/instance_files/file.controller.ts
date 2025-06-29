import {
  Controller,
  Post,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { AuthGuard, MongodbService } from "@builder6/core";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { FileService } from "./file.service";
import * as _ from "lodash";

@Controller("/api")
export class InstanceFileController {
  constructor(
    private fileService: FileService,
    private mongodbService: MongodbService,
  ) {}

  // 上传文件
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Post("instance/:instanceId/file")
  async uploadFile(
    @Param("instanceId") instanceId: string,
    @Req() req: Request,
    @UploadedFile() file: any,
  ) {
    try {
      const userSession = (req as any).user;

      // Get fields from form data (assuming they're sent as form fields)
      const fields = req.body;

      return await this.fileService.uploadFile(
        instanceId,
        file,
        fields,
        userSession,
      );
    } catch (error) {
      throw error;
    }
  }

  async copyFiles() {}

  private formatFileName(originalName: string, uploadFrom?: string): string {
    // Implement your file name formatting logic here
    // This is a placeholder - replace with your actual logic
    if (uploadFrom === "mobile") {
      return originalName.replace(/ /g, "_");
    }
    return originalName;
  }
}
