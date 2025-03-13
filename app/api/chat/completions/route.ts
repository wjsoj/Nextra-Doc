import { NextRequest, NextResponse } from "next/server";
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json("Method Not Allowed", { status: 405 });
  }

  const headerList = await headers();

  // 从 Authorization 中提取用户提供的 API key，用于 Cookie token
  let userApiKey = "";
  const auth = headerList.get("authorization");
  if (auth) {
    const parts = auth.split(" ");
    if (parts.length === 2) {
      userApiKey = parts[1];
    }
  }

  // 获取原始请求体文本
  const body = await req.json();

  const newbody = {
    api_key: "123456",
    model: body.model,
    messages: body.messages,
    history: []
  }
  // console.log(newbody);

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
  };

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: forwardHeaders,
    body: JSON.stringify(newbody),
  })

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
