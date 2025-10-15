import { openai } from "@ai-sdk/openai";
import { Body, Controller, Param, Post, Res } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { generateText, streamText, stepCountIs } from "ai";
import { Response } from "express";
import { AiService } from "./ai.service";

@ApiTags("AI")
@Controller("api/v6/ai/chat")
export class ChatController {
  constructor(private readonly aiService: AiService) {}

  @ApiBody({
    schema: {
      type: "object",
    },
    examples: {
      text: {
        value: {
          model: "gpt-4o",
          prompt: "Invent a new holiday and describe its traditions.",
        },
      },
    },
  })
  @Post("generateText")
  async generateText(
    @Body("model") model: string,
    @Body("system") system: string,
    @Body("prompt") prompt: string,
  ) {
    const result = await generateText({
      model: openai(model),
      system,
      prompt,
      tools: {
        getObjectSchema: this.aiService.getObjectSchemaTool(),
        getObjectSchemaWithRelated:
          this.aiService.getObjectSchemaWithRelatedTool(),
      },
      stopWhen: stepCountIs(5), // stop after a maximum of 5 steps if tools were called
    });

    return {
      text: result.text,
    };
  }

  @ApiBody({
    schema: {
      type: "object",
    },
    examples: {
      text: {
        value: {
          model: "gpt-4o",
          prompt: "Invent a new holiday and describe its traditions.",
        },
      },
    },
  })
  @Post("streamText")
  async streamText(
    @Body("model") model: string,
    @Body("system") system: string,
    @Body("prompt") prompt: string,
    @Res() res: Response,
  ) {
    const result = streamText({
      model: openai(model),
      system,
      prompt,
    });

    result.pipeUIMessageStreamToResponse(res);
  }
}
