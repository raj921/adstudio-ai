import { openRouter } from "./openrouter"

const FLASH = "minimax/minimax-m2.7"
const IMG_MODEL = "google/gemini-3.1-flash-image-preview"

function url(src: string) {
  return src.startsWith("data:") ? src : `data:image/jpeg;base64,${src}`
}

function strip(raw: string) {
  return raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()
}

async function chat(model: string, msgs: { role: string; content: unknown }[]) {
  const r = await openRouter.chat.send({
    chatGenerationParams: { model, stream: false, messages: msgs as never },
  })
  return r.choices?.[0]?.message
}

export async function analyze(src: string) {
  const msg = await chat(FLASH, [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `Analyze this product image. Return ONLY a JSON object:
{"productLabel":"","summary":"","colors":[],"materials":[],"tags":[],"sceneSuggestions":["5 creative ad scene ideas"]}
No markdown fences.`,
        },
        { type: "image_url", imageUrl: { url: url(src) } },
      ],
    },
  ])
  const raw = typeof msg?.content === "string" ? msg.content : ""
  if (!raw) throw new Error("Empty vision response")
  return JSON.parse(strip(raw))
}

export async function rewrite(prompt: string, ctx: string) {
  const msg = await chat(FLASH, [
    {
      role: "system",
      content:
        "You are an ad art director. Rewrite the user request into a vivid image-gen prompt. Keep product as hero. Output ONLY the rewritten prompt.",
    },
    { role: "user", content: `${ctx ? `Context: ${ctx}\n\n` : ""}Request: "${prompt}"` },
  ])
  const t = msg?.content
  return typeof t === "string" ? t.trim() : prompt
}

export async function genImage(prompt: string, src: string | null, ratio: string) {
  const content = src
    ? [
        { type: "text" as const, text: prompt },
        { type: "image_url" as const, imageUrl: { url: url(src) } },
      ]
    : prompt

  const r = await openRouter.chat.send({
    chatGenerationParams: {
      model: IMG_MODEL,
      stream: false,
      modalities: ["image", "text"],
      imageConfig: { aspectRatio: ratio },
      messages: [{ role: "user", content }],
    },
  })
  return r.choices?.[0]?.message?.images?.[0]?.imageUrl?.url ?? null
}

export async function refine(
  current: string,
  feedback: string,
  history: { role: string; content: string }[],
  ctx: string
) {
  const msgs = [
    {
      role: "system" as const,
      content: `You are an ad art director. Rewrite the prompt based on user feedback.
${ctx ? `Product: ${ctx}` : ""}
Return ONLY JSON: {"newPrompt":"...","explanation":"one sentence"}`,
    },
    ...history,
    { role: "user" as const, content: `Current: "${current}"\nFeedback: "${feedback}"` },
  ]
  const msg = await chat(FLASH, msgs)
  const raw = typeof msg?.content === "string" ? msg.content : ""
  if (!raw) throw new Error("Empty refine response")
  const p = JSON.parse(strip(raw))
  return { newPrompt: p.newPrompt ?? current, explanation: p.explanation ?? "Updated." }
}
