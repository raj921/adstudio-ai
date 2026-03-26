import { NextRequest, NextResponse } from "next/server"
import { rewrite, genImage } from "@/lib/ai"
import type { Size, Analysis } from "@/types/studio"

const RATIOS: Record<Size, string> = {
  instagram: "1:1",
  stories: "9:16",
  facebook: "3:2",
  linkedin: "1:1",
}

function ctx(a: Analysis | null) {
  if (!a) return ""
  return `${a.productLabel}. ${a.summary}. Colors: ${a.colors.join(", ")}. Materials: ${a.materials.join(", ")}.`
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json()
    const prompt = (b.prompt ?? "").trim()
    const src = b.sourceImage?.trim() || null
    const size: Size = b.size in RATIOS ? b.size : "instagram"
    const analysis: Analysis | null = b.analysis ?? null

    if (!prompt) return NextResponse.json({ error: "No prompt" }, { status: 400 })

    const engineered = await rewrite(prompt, ctx(analysis))
    const img = await genImage(engineered, src, RATIOS[size])

    if (!img) return NextResponse.json({ error: "No image returned" }, { status: 502 })

    return NextResponse.json({ imageUrl: img, engineeredPrompt: engineered })
  } catch (e) {
    console.error("/api/generate:", e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Generation failed" },
      { status: 500 }
    )
  }
}
