import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import * as _ from "lodash";
import { MongodbService } from "@builder6/core";
import { FilesService } from "@builder6/files";
import axios from "axios";
const COLLECTION_NAME = "cfs.instances.filerecord";

import { Readable } from "stream";

async function streamToMulterFile(
  stream: Readable,
  originalname: string,
  mimetype: string,
): Promise<any> {
  // 1. 将 Readable 流转换为 Buffer
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  // 2. 构造 Multer.File 对象
  const multerFile: any = {
    fieldname: "file", // 默认字段名
    originalname, // 原始文件名（如 "document.pdf"）
    encoding: "7bit", // 默认编码
    mimetype, // MIME 类型（如 "application/pdf"）
    buffer, // 文件内容的 Buffer
    size: buffer.length, // 文件大小
    stream: Readable.from(buffer), // 重新创建可读流（可选）
    destination: "", // 不需要磁盘存储时留空
    filename: originalname, // 保存文件名（可选）
    path: "", // 不需要磁盘存储时留空
  };

  return multerFile;
}

@Injectable()
export class FileService {
  constructor(
    private filesService: FilesService,
    private mongodbService: MongodbService,
  ) {}
  private readonly logger = new Logger(FileService.name);

  async uploadFile(instanceId, file, fields, userSession) {
    const userId = userSession["userId"];
    const spaceId = userSession["spaceId"];
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
    const deny_ext = process.env.STEEDOS_CFS_UPLOAD_DENY_EXT?.split(",") || [];

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
        COLLECTION_NAME,
        file,
        {},
        {
          metadata: metadata,
        },
      );

      if (fileRecord) {
        await this.mongodbService.findOneAndUpdate(
          COLLECTION_NAME,
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
          await this.mongodbService.deleteMany(COLLECTION_NAME, {
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
        COLLECTION_NAME,
        file,
        {},
        {
          metadata: metadata,
        },
      );
      await this.mongodbService.findOneAndUpdateData(
        COLLECTION_NAME,
        { _id: fileRecord._id },
        { "metadata.parent": fileRecord._id },
      );
    }
    return {
      version_id: fileRecord._id,
      size: file.size,
    };
  }

  async copyInstanceFiles(
    sourceInstanceId,
    targetInstanceId,
    targetInstanceApproveId,
    userSession,
    { can_edit_main_attach, can_edit_normal_attach },
  ) {
    const userId = userSession["userId"];
    const spaceId = userSession["spaceId"];
    const filesInfo = await this.mongodbService.find(COLLECTION_NAME, {
      "metadata.instance": sourceInstanceId,
      "metadata.current": true,
    });

    const metadata = {
      owner: userId,
      owner_name: userSession.name,
      space: spaceId,
      instance: targetInstanceId,
      approve: targetInstanceApproveId,
      current: true,
      main: false,
    };

    for (const fileInfo of filesInfo) {
      if (fileInfo.metadata.main == true) {
        if (can_edit_main_attach != true && can_edit_normal_attach != true)
          continue;
      } else {
        if (can_edit_normal_attach != true) continue;
      }
      if (fileInfo.metadata.main == true && can_edit_main_attach == true) {
        metadata.main = true;
      } else {
        metadata.main = false;
      }
      const fileStream = await this.filesService.downloadFileStream(
        COLLECTION_NAME,
        fileInfo._id,
      );
      const file = await streamToMulterFile(
        fileStream,
        fileInfo.original.name,
        fileInfo.original.type,
      );
      await this.uploadFile(targetInstanceId, file, metadata, userSession);
    }
  }

  async downloadFile(url: string): Promise<Buffer> {
    console.log(`downloadFile`, `Bearer apikey,${process.env.STEEDOS_API_KEY}`);
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer apikey,${process.env.STEEDOS_API_KEY}`,
      },
    });
    return response.data;
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
