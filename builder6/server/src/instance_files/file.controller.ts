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
import { FilesService } from "@builder6/files";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import * as _ from "lodash";
import * as fs from "fs";

@Controller("/api")
export class InstanceFileController {
  constructor(
    private filesService: FilesService,
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
      const userId = userSession["userId"];
      const spaceId = userSession["spaceId"];

      // Get fields from form data (assuming they're sent as form fields)
      const fields = req.body;
      const {
        approve,
        is_private,
        owner = userId,
        owner_name = userSession["name"],
        space = spaceId,
        upload_from,
        isAddVersion,
        parent,
        main,
        locked_by,
        locked_by_name,
        overwrite,
      } = fields;

      // Get settings (you'll need to implement getSettings in your service)
      const deny_ext =
        process.env.STEEDOS_CFS_UPLOAD_DENY_EXT?.split(",") || [];

      // Process file name
      const fileName = this.formatFileName(file.originalname, upload_from);
      const name_split = fileName.split(".");
      const extension = name_split.pop();

      if (_.includes(deny_ext, extension)) {
        throw new BadRequestException(`禁止上传「${extension}」附件`);
      }

      // Prepare metadata
      const metadata: any = {
        owner,
        owner_name,
        space,
        instance: instanceId,
        approve,
        current: true,
        is_private: _.isBoolean(is_private)
          ? is_private
          : _.isString(is_private)
            ? is_private.toLowerCase() === "true"
            : false,
      };

      if (main === "true" || main === true) {
        metadata.main = true;
      }

      let parentId = "";
      if (isAddVersion && parent) {
        parentId = parent;
      }

      let fileRecord;
      if (parentId) {
        // Handle version update case
        metadata.parent = parentId;
        if (locked_by && locked_by_name) {
          metadata.locked_by = locked_by;
          metadata.locked_by_name = locked_by_name;
        }
        const fileRecord = await this.filesService.uploadFile(
          "cfs.instances.filerecord",
          file,
          {},
          {
            metadata: metadata,
          },
        );

        if (fileRecord) {
          await this.mongodbService.findOneAndUpdate(
            "cfs.instances.filerecord",
            {
              "metadata.parent": parentId,
              "metadata.current": true,
            },
            {
              $unset: {
                "metadata.current": "",
              },
            },
            {},
          );
          if (overwrite?.toLowerCase() === "true") {
            await this.mongodbService.deleteMany("cfs.instances.filerecord", {
              "metadata.instance": instanceId,
              "metadata.parent": parentId,
              "metadata.owner": owner,
              "metadata.approve": approve,
              "metadata.current": {
                $ne: true,
              },
            });
          }
        }
      } else {
        // New file upload
        fileRecord = await this.filesService.uploadFile(
          "cfs.instances.filerecord",
          file,
          {},
          {
            metadata: metadata,
          },
        );
        await this.mongodbService.findOneAndUpdateData(
          "cfs.instances.filerecord",
          { _id: fileRecord._id },
          { "metadata.parent": fileRecord._id },
        );
      }
      return {
        version_id: fileRecord._id,
        size: file.size,
      };
    } catch (error) {
      throw error;
    }
  }

  private formatFileName(originalName: string, uploadFrom?: string): string {
    // Implement your file name formatting logic here
    // This is a placeholder - replace with your actual logic
    if (uploadFrom === "mobile") {
      return originalName.replace(/ /g, "_");
    }
    return originalName;
  }
}
