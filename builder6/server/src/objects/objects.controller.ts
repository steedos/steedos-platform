import { Controller, Get, Param } from "@nestjs/common";
import { ObjectsService } from "./objects.service";

@Controller("/api/v6/objects")
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Get(":objectApiName")
  async getObject(@Param("objectApiName") objectApiName: string) {
    return await this.objectsService.getObjectConfig(objectApiName);
  }

  @Get(":objectApiName/functions/:functionApiName")
  async runFuction(
    @Param("objectApiName") objectApiName: string,
    @Param("functionApiName") functionApiName: string,
  ) {
    // 处理获取对象
    return await this.objectsService.runFunction(
      objectApiName,
      functionApiName,
      {},
    );
  }
}
