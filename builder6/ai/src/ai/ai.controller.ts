import { openai } from "@ai-sdk/openai";
import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
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
import { getObjectSchema } from "./tools/getObjectSchema";

@ApiTags("AI")
@Controller("/api/v6/ai")
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly mongodbService: MongodbService,
  ) {}

  @Post("chatbot/:chatbotId/stream")
  async streamText(
    @Param("chatbotId") chatbotId: string,
    @Body("messages") messages: UIMessage[],
    @Res() res: Response,
  ) {
    const chatbot = await this.mongodbService.findOne("ai_chatbots", {
      _id: chatbotId,
    });
    if (!chatbot) {
      throw new Error(`Chatbot with ID ${chatbotId} not found`);
    }
    const model = process.env.AI_GATEWAY_API_KEY
      ? chatbot.model
      : openai.chat(chatbot.model);
    const modelMessages = convertToModelMessages(messages);
    const result = await streamText({
      model,
      system: chatbot.directive || "You are a helpful assistant.",
      messages: modelMessages,
      tools: {
        getObjectSchema: getObjectSchema,
      },
      stopWhen: stepCountIs(5), // stop after a maximum of 5 steps if tools were called
    });

    return result.pipeUIMessageStreamToResponse(res);
  }

  @Post("chat/:chatId/stream")
  async chatStreamText(
    @Param("chatId") chatId: string,
    @Body("messages") messages: UIMessage[],
    @Res() res: Response,
  ) {
    const chat = await this.mongodbService.findOne("ai_chats", {
      _id: chatId,
    });
    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }
    const model = process.env.AI_GATEWAY_API_KEY
      ? chat.model
      : openai.chat(chat.model);
    const modelMessages = convertToModelMessages(messages);
    const result = await streamText({
      model,
      messages: modelMessages,
      tools: {
        getObjectSchema: getObjectSchema,
      },
      stopWhen: stepCountIs(5), // stop after a maximum of 5 steps if tools were called
    });

    return result.pipeUIMessageStreamToResponse(res);
  }

  @Get("models")
  async getModels() {
    return this.aiService.getAvailableModels();
  }
}
