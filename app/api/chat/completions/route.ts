import { NextRequest, NextResponse } from "next/server";
import { headers } from 'next/headers'
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json("Method Not Allowed", { status: 405 });
  }

  const headerList = await headers();

  // 从 Authorization 中提取用户提供的 API key，用于 Cookie token
  let userApiKey = "";
  const auth = headerList.get("authorization");
  if (auth) {
    userApiKey = auth.replace("Bearer ", "");
  }
  // console.log(userApiKey);

  // 获取原始请求体文本
  const body = await req.json();
  const modelName = body.model;

  // 根据模型名称选择不同的处理逻辑
  if (modelName === "TinyR1-32B-Preview") {
    // TinyR1-32B-Preview 模型的处理逻辑
    const userMessage = body.messages[body.messages.length - 1].content;
    
    // 生成唯一ID（使用用户消息的SHA256哈希）
    const uniqueId = crypto
      .createHash('sha256')
      .update(userMessage)
      .digest('hex');
    
    const newMessages = [
      {
        role: "user",
        content: userMessage,
        timestamp: null,
        feedback: 0,
        expanded: true,
        answer_model: null
      },
      {
        role: "assistant",
        content: "",
        timestamp: null,
        feedback: 0,
        expanded: true,
        answer_model: "TinyR1-32B-Preview"
      }
    ];

    const tinyR1Body = {
      messages: newMessages,
      unique_id: uniqueId,
      kb_ids: [],
      model: "TinyR1-32B-Preview",
      add_content: [],
      task: "answer"
    };

    // TinyR1模型的目标URL和请求头
    const targetUrl = "https://llmtest.pku.edu.cn/api/chat";
    const forwardHeaders: HeadersInit = {
      Accept: "text/event-stream, text/event-stream",
      "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Cookie: `${userApiKey}`,
      Origin: "https://llmtest.pku.edu.cn",
      Pragma: "no-cache",
      Referer: "https://llmtest.pku.edu.cn/chat",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent": req.headers.get("user-agent") || "",
      "sec-ch-ua": "\"Chromium\";v=\"135\", \"Not-A.Brand\";v=\"8\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "Linux",
    };

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: forwardHeaders,
      body: JSON.stringify(tinyR1Body),
    });

    // 构造新的返回 header 并覆盖为流式 SSE 格式
    const newHeaders = new Headers();
    response.headers.forEach((value, key) => {
      newHeaders.set(key, value);
    });
    newHeaders.set("Content-Type", "text/event-stream");
    newHeaders.set("Access-Control-Allow-Origin", "*");

    // 返回流式响应
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  } else {
    // 原有的 deepseek-v3 和 deepseek-r1 模型处理逻辑
    const newbody = {
      api_key: "123456",
      model: body.model,
      messages: body.messages,
      history: []
    }

    // 构造转发请求的 header，其中 Cookie 使用用户 API key
    const targetUrl = "https://deepseek.pku.edu.cn/api/sendQuery";
    const forwardHeaders: HeadersInit = {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
      Authorization: "Bearer 123456",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Cookie: `token=${userApiKey}`,
      Origin: "https://deepseek.pku.edu.cn",
      Pragma: "no-cache",
      Referer: "https://deepseek.pku.edu.cn/chat",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent": req.headers.get("user-agent") || "",
      "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "Linux",
    };

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: forwardHeaders,
      body: JSON.stringify(newbody),
    });

    // 构造新的返回 header 并覆盖为流式 SSE 格式
    const newHeaders = new Headers();
    response.headers.forEach((value, key) => {
      newHeaders.set(key, value);
    });
    newHeaders.set("Content-Type", "text/event-stream");
    // 添加允许跨域的 header
    newHeaders.set("Access-Control-Allow-Origin", "*");

    // 返回流式响应
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-stainless-timeout, x-stainless-os, x-stainless-runtime, x-stainless-arch, x-stainless-lang, x-stainless-package-version, x-stainless-runtime-version, x-stainless-retry-count",
    },
  });
}
