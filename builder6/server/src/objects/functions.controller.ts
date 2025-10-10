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
@Controller("/api/v6/functions")
export class FunctionsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Get(":objectApiName/:functionApiName")
  async runFunction(
    @Req() req: Request,
    @Param("objectApiName") objectApiName: string,
    @Param("functionApiName") functionApiName: string,
    @Query() query: Record<string, any>,
  ) {
    const user = (req as any).user;
    // 处理获取对象
    return await this.objectsService.runFunction(
      objectApiName,
      functionApiName,
      {
        objectName: objectApiName,
        functionApiName,
        ...query,
      },
      { userId: user.user, spaceId: user.space },
    );
  }

  @Post(":objectApiName/:functionApiName")
  async runFunctionPost(
    @Req() req: Request,
    @Param("objectApiName") objectApiName: string,
    @Param("functionApiName") functionApiName: string,
    @Body() body: Record<string, any>,
  ) {
    const user = (req as any).user;
    // 处理获取对象
    return await this.objectsService.runFunction(
      objectApiName,
      functionApiName,
      {
        objectName: objectApiName,
        functionApiName,
        ...body,
      },
      { userId: user.user, spaceId: user.space },
    );
  }
}
