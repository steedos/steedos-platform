/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-11-06 21:50:55
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-11-07 10:04:06
 */
import { Injectable } from "@nestjs/common";
import { getObject } from "@steedos/objectql";
import OpenAI from "openai";

@Injectable()
export class AiService {
  private openai: any;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }
  async getAvailableModels() {
    // 调用 openai sdk 获取模型列表
    const models = await this.openai?.models.list();

    // 过滤并映射模型数据，只返回需要的字段
    return models?.data;
  }
}
