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
import {
  generateText,
  streamText,
  stepCountIs,
  convertToModelMessages,
  UIMessage,
} from "ai";
import { Response } from "express";
import { AiService } from "./ai.service";
import { MongodbService } from "@builder6/core";

@ApiTags("AI")
@Controller("api/v6/ai")
export class ChatController {
  constructor(
    private readonly aiService: AiService,
    private readonly mongodbService: MongodbService,
  ) {}

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
  @Post("chatbot/:chatbotId/stream")
  async streamText(
    @Param("chatbotId") chatbotId: string,
    @Body("messages") messages: UIMessage[],
    @Res() res: Response,
  ) {
    const chatbot = await this.mongodbService.findOne("chatbots", {
      _id: chatbotId,
    });
    if (!chatbot) {
      throw new Error(`Chatbot with ID ${chatbotId} not found`);
    }
    if (!chatbot.model || !chatbot.model.startsWith("openai/")) {
      throw new Error(`Only OpenAI models are supported for now.`);
    }
    const model = chatbot.model.replace("openai/", "");
    const result = await streamText({
      model: openai(model),
      system: chatbot.directive || "You are a helpful assistant.",
      messages: convertToModelMessages(messages),
      tools: {
        getObjectSchema: this.aiService.getObjectSchemaTool(),
        getObjectSchemaWithRelated:
          this.aiService.getObjectSchemaWithRelatedTool(),
      },
      stopWhen: stepCountIs(5), // stop after a maximum of 5 steps if tools were called
    });

    return result.pipeUIMessageStreamToResponse(res);
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
  @Post("chat")
  async generateText(
    @Body("model") model: string,
    @Body("system") system: string,
    @Body("prompt") prompt: string,
  ) {
    const result = await generateText({
      model: openai(model),
      system,
      prompt,
    });

    return { text: result.text };
  }
}
