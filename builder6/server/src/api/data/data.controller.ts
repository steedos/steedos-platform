import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Res,
  Req,
  Query,
  UseGuards,
  ParseIntPipe,
  Patch,
  HttpCode,
} from "@nestjs/common";
import { AdminGuard, MongodbService } from "@builder6/core";
import { Request, Response } from "express";
import { getOptions } from "@builder6/query-mongodb";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { DataService } from "./data.service";

@ApiTags("Records")
@UseGuards(UseGuards)
@Controller("/api/v6/data")
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get(":objectName")
  @ApiOperation({
    summary: "List the records accessible to the current user.",
    description:
      "List records in a object.  \n \
      The server returns one page of records at a time. Each page will contain pageSize records, which is 100 by default.  \n \
      You can filter, sort the results with query parameters. Note that these parameters need to be URL encoded. You can use our API URL encoder tool to help with this.  \n \
      ",
  })
  @ApiParam({
    name: "objectName",
    type: String,
    description: "The name of the object.",
    example: "test",
  })
  @ApiQuery({
    name: "fields",
    required: false,
    type: String,
    description:
      'Only data for fields whose names are in this list will be included in the result.  \n \
      If you don\'t need every field, you can use this parameter to reduce the amount of data transferred.  \n \
      This parameter can be a comma-separated string of field names `"name,created"`, or an array of field names: `["name", "created"]`. ',
    example: "name, created",
  })
  @ApiQuery({
    name: "filters",
    type: String,
    required: false,
    description:
      'A formula used to filter records, for example: `[ "age" , ">" , 10 ]` .  \n \
      Individual filter criteria have the format `[ "field", "operator", "value" ]`,  \n \
      Operator is one of `=`, `<>`, `<`, `>`, `<=`, `>=`, `startsWith`, `endswith`, `contains` and `notcontains`. The last four are used for strings, otherwise operators apply to all value types.  \n \
      Criteria can be combined in hierarchies using nested arrays with and and or operators like this:  \n \
      `[ \
        [ "field", "=", 10 ],  \
        "and",  \
        [ \
          [ "otherField", "<", 3 ], \
          "or", \
          [ "otherField", ">", 11 ] \
        ] \
      ]`',
  })
  @ApiQuery({
    name: "sort",
    type: String,
    required: false,
    example: "name asc, created desc",
    description:
      'A list of sort string that specifies how the records will be ordered. \
      Each sort string must specifying the name of the field to sort on, and an optional direction key that is either "asc" or "desc". The default direction is "asc".',
  })
  @ApiQuery({
    name: "skip",
    type: Number,
    required: false,
    description:
      "To fetch the next page of records, include offset from the previous request in the next request's parameters.",
    schema: { default: 0 }, // 在 Swagger 中设置默认值
  })
  @ApiQuery({
    name: "top",
    type: Number,
    required: false,
    description: "The number of records returned in each request. ",
    schema: { default: 100 }, // 在 Swagger 中设置默认值
  })
  async find(
    @Param("objectName") objectName: string,
    @Req() req: Request,
    @Query("fields") fields?: any,
    @Query("filters") filters?: any,
    @Query("sort") sort?: any,
    @Query("skip", new ParseIntPipe()) skip: number = 0,
    @Query("top", new ParseIntPipe()) top: number = 100,
  ) {
    const user = req["user"];
    const query = { top, skip, sort } as any;

    if (filters) {
      try {
        query.filters = JSON.parse(filters);
      } catch (e) {
        throw new Error("filters 参数格式错误，不是有效的json字符串");
      }
    }

    if (fields && typeof fields === "string") {
      try {
        query.fields = JSON.parse(fields);
      } catch {
        query.fields = fields.split(",").map((field) => field.trim());
      }
    } else {
      query.fields = fields;
    }

    const data = await this.dataService.find(objectName, query, user?._id);

    return { data };
  }
}
