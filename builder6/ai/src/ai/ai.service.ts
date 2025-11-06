import { Injectable } from "@nestjs/common";
import { getObject } from "@steedos/objectql";
import OpenAI from "openai";

@Injectable()
export class AiService {
  private openai: any;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  async getAvailableModels() {
    // 调用 openai sdk 获取模型列表
    const models = await this.openai.models.list();

    // 过滤并映射模型数据，只返回需要的字段
    return models.data;
  }
}
