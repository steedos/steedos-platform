import { Controller, Get, Post, Query } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { AiService } from "./ai.service";

@Controller("/api/v6/ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @ApiQuery({
    name: "objects",
    required: false,
    type: String,
    description:
      "Related objects, will generate metadata in prompt, separated by commas. For example: accounts,contacts",
    example: "space_users",
  })
  @ApiQuery({
    name: "includeRelated",
    required: false,
    type: Boolean,
  })
  @Get("prompt/objects")
  async getObjectsPrompt(
    @Query("objects") objects?: any,
    @Query("includeRelated") includeRelated: string = "false",
  ) {
    let objectApiNames: string[] = [];
    if (objects && typeof objects === "string") {
      try {
        objectApiNames = JSON.parse(objects);
      } catch {
        objectApiNames = objects.split(",").map((field) => field.trim());
      }
    }

    // Explicitly convert string to boolean
    const includeRelatedBoolean = includeRelated.toLowerCase() === "true";

    const results = await this.aiService.getObjectPromptMultiple(
      objectApiNames,
      includeRelatedBoolean,
    );
    return results;
  }
}
