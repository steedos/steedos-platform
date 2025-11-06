# Builder6 AI

系统使用 OpenAI SDK 进行 AI 能力的调用。

需配置如下环境变量：

- OPENAI_API_KEY: OpenAI API 密钥
- OPENAI_BASE_URL: OpenAI API 基础 URL

## 使用 OpenAI 官方 API

```shell
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
```

## 使用阿里云

```shell
OPENAI_API_KEY=your_aliyun_api_key
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

## 使用 Vercel AI Gateway

```shell
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_api_key
OPENAI_API_KEY=your_vercel_ai_gateway_api_key
OPENAI_BASE_URL=https://ai-gateway.vercel.sh/v1
``` 