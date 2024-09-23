import { auth } from "../../../auth"
import { NextResponse } from "next/server"

export const POST = auth(async function POST(req) {
  if (!req.auth) return NextResponse.json({ message: "Not authorized" }, { status: 401 })
  const { model, content } = await req.json()
  const response = await fetch(`https://api.gpt.ge/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.FLUX_API_KEY}`
    },
    body: JSON.stringify({ model, messages: [{ role: "user", content }] })
  }).then(res => res.json())
  return NextResponse.json(response)
})