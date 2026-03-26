import { NextRequest, NextResponse } from "next/server"
import { analyze } from "@/lib/ai"

export async function POST(req: NextRequest) {
  try {
    const { sourceImage } = await req.json()
    if (!sourceImage) return NextResponse.json({ error: "No image" }, { status: 400 })
    return NextResponse.json(await analyze(sourceImage))
  } catch (e) {
    console.error("/api/analyze:", e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Analysis failed" },
      { status: 500 }
    )
  }
}
