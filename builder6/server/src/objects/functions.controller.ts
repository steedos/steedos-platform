import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ObjectsService } from "./objects.service";
import { AuthGuard } from "@builder6/core";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

@UseGuards(AuthGuard)
@Controller("/api/v6/functions")
export class FunctionsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @HttpCode(200)
  @ApiOperation({
    summary: "Execute a function for a specific object.",
  })
  @Get(":objectApiName/:functionApiName")
  async runFunction(
    @Req() req: Request,
    @Param("objectApiName") objectApiName: string,
    @Param("functionApiName") functionApiName: string,
    @Query() query: Record<string, any>,
  ) {
    const user = (req as any).user;
    // 处理获取对象
    const _result = await this.objectsService.runFunction(
      objectApiName,
      functionApiName,
      {
        objectName: objectApiName,
        functionApiName,
        ...query,
      },
      { userId: user.user, spaceId: user.space },
    );
    return _result;
  }

  @HttpCode(200)
  @ApiOperation({
    summary: "Execute a function for a specific object.",
  })
  @Post(":objectApiName/:functionApiName")
  @ApiBody({
    description: "body params will be passed to the function ctx.input",
    schema: {
      type: "object",
    },
  })
  async runFunctionPost(
    @Req() req: Request,
    @Param("objectApiName") objectApiName: string,
    @Param("functionApiName") functionApiName: string,
    @Body() body: Record<string, any>,
  ) {
    const user = (req as any).user;
    // 处理获取对象
    const _result = await this.objectsService.runFunction(
      objectApiName,
      functionApiName,
      {
        objectName: objectApiName,
        functionApiName,
        ...body,
      },
      { userId: user.user, spaceId: user.space },
    );
    return _result;
  }
}
