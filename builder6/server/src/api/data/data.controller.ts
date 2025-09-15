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
import { AdminGuard, AuthGuard, MongodbService } from "@builder6/core";
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
@UseGuards(AuthGuard)
@Controller("/api/v6/data")
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post(":objectName")
  @HttpCode(200)
  @ApiOperation({
    summary: "Create a record",
  })
  @ApiParam({
    name: "objectName",
    description: "The name of the object.",
    example: "test",
  })
  @ApiBody({
    description:
      "You can specify the `_id` field, or it will be generated automatically. <br /> Additionally, the system will automatically generate the following fields: `created_by`, `created`, `modified_by`, `modified`, `space` (tenant ID), and `owner`.",
    schema: {
      type: "object",
    },
    examples: {
      simple: {
        summary: "Create a simple record",
        value: {
          name: "Jack",
          age: 20,
        },
      },
      withId: {
        summary: "Create a simple record with _id",
        value: {
          _id: "generated_id",
          name: "Jack",
          age: 20,
        },
      },
    },
  })
  @ApiOkResponse({
    description: "The created record.",
    examples: {
      simple: {
        summary: "Create a simple record",
        value: {
          _id: "f5e2b3c4-1b1b-4b1b-9b1b-1b1b1b1b1b1b",
          name: "Jack",
          age: 20,
          created: new Date(),
          created_by: "current_user_id",
          modified: new Date(),
          modified_by: "current_user_id",
          owner: "current_user_id",
          space: "current_tenant_id",
        },
      },
    },
  })
  async create(
    @Param("objectName") objectName: string,
    @Body() record: object,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req["user"];
    try {
      const result = await this.dataService.insert(
        objectName,
        {
          ...record,
          owner: user._id,
          created_by: user._id,
          created: new Date(),
          modified_by: user._id,
          modified: new Date(),
          space: user.space,
        },
        user._id,
      );
      res.status(200).send(result);
    } catch (error) {
      console.error("Query error", error);
      res.status(500).send({
        error: {
          code: 500,
          message: error.message,
        },
      });
    }
  }

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

    const count = await this.dataService.count(objectName, query, user._id);
    const data = await this.dataService.find(objectName, query, user._id);

    return { data, totalCount: count };
  }

  @Get(":objectName/:recordId")
  @ApiOperation({
    summary: "Get record",
    description: "Retrieve a single record. ",
  })
  @ApiParam({
    name: "objectName",
    type: String,
    description: "The name of the object.",
    example: "test",
  })
  @ApiParam({
    name: "recordId",
    type: String,
    description: "The _id of the record.",
  })
  async findOne(
    @Req() req: Request,
    @Res() res: Response,
    @Param("objectName") objectName: string,
    @Param("recordId") recordId: string,
  ) {
    const user = req["user"];
    try {
      const result = await this.dataService.findOne(
        objectName,
        recordId,
        user._id,
      );
      if (!result) {
        return res.status(404).send();
      }
      res.status(200).send(result);
    } catch (error) {
      console.error("Query error", error);
      res.status(500).send({
        error: {
          code: 500,
          message: error.message,
        },
      });
    }
  }

  @Patch(":objectName/:id")
  @ApiOperation({ summary: "Update record" })
  @ApiBody({
    schema: {
      type: "object",
    },
  })
  async update(
    @Param("objectName") objectName: string,
    @Param("id") id: string,
    @Body() body: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req["user"];
    try {
      const result = await this.dataService.update(
        objectName,
        id,
        {
          ...body,
          modified_by: req["user"]._id,
          modified: new Date(),
        },
        user._id,
      );
      if (!result) {
        return res.status(404).send();
      }
      res.status(200).send(result);
    } catch (error) {
      console.error("Query error", error);
      res.status(500).send({
        error: {
          code: 500,
          message: error.message,
        },
      });
    }
  }

  @Delete(":objectName/:id")
  @ApiOperation({ summary: "Delete record" })
  async remove(
    @Param("objectName") objectName: string,
    @Param("id") id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req["user"];
    try {
      const result = await this.dataService.delete(objectName, id, user._id);
      if (result.deletedCount === 0) {
        return res.status(404).send();
      }
      res.status(200).send({ deleted: true, _id: id });
    } catch (error) {
      console.error("Query error", error);
      res.status(500).send(error);
    }
  }
}
