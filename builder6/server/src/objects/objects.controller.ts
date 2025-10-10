import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ObjectsService } from "./objects.service";
import { AuthGuard } from "@builder6/core";

@UseGuards(AuthGuard)
@Controller("/api/v6/objects")
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Get(":objectApiName")
  async getObject(@Param("objectApiName") objectApiName: string) {
    return await this.objectsService.getObjectConfig(objectApiName);
  }
}
