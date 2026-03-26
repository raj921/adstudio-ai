import { NextRequest, NextResponse } from "next/server"
import { refine } from "@/lib/ai"
import type { Analysis } from "@/types/studio"

function ctx(a: Analysis | null) {
  if (!a) return ""
  return `${a.productLabel}. ${a.summary}. Colors: ${a.colors.join(", ")}.`
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json()
    const msg = (b.userMessage ?? "").trim()
    if (!msg) return NextResponse.json({ error: "No message" }, { status: 400 })

    const result = await refine(
      b.currentPrompt ?? "",
      msg,
      Array.isArray(b.history) ? b.history : [],
      ctx(b.analysis ?? null)
    )
    return NextResponse.json(result)
  } catch (e) {
    console.error("/api/refine:", e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Refine failed" },
      { status: 500 }
    )
  }
}
