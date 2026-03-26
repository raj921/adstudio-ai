"use client"

import { useStore } from "@/lib/store"
import { UploadZone } from "./UploadZone"
import { PromptBar } from "./PromptBar"
import { Canvas } from "./Canvas"
import { ChatPanel } from "./ChatPanel"
import { SettingsPanel } from "./SettingsPanel"

async function callGenerate(body: Record<string, unknown>) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error((await res.json()).error || "Failed")
  return res.json()
}

export default function StudioPage() {
  const { job, setPrompt, setResult, setStatus, push } = useStore()

  const gen = async () => {
    if (!job.prompt || job.status === "generating") return
    setStatus("generating")
    try {
      const { imageUrl, engineeredPrompt } = await callGenerate({
        prompt: job.prompt,
        sourceImage: job.src,
        size: job.size,
        analysis: job.analysis ?? null,
      })
      setResult(imageUrl)
      if (engineeredPrompt) push({ role: "assistant", content: `Engineered: "${engineeredPrompt}"` })
      setStatus("completed")
    } catch (e) {
      setStatus("failed")
      push({ role: "assistant", content: `Error: ${e instanceof Error ? e.message : "Failed"}` })
    }
  }

  const regen = async (p: string) => {
    setPrompt(p)
    setStatus("generating")
    try {
      const { imageUrl } = await callGenerate({
        prompt: p,
        sourceImage: job.src,
        size: job.size,
        analysis: job.analysis ?? null,
      })
      setResult(imageUrl)
      setStatus("completed")
    } catch (e) {
      setStatus("failed")
      push({ role: "assistant", content: `Error: ${e instanceof Error ? e.message : "Failed"}` })
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <section className="relative flex flex-1 flex-col overflow-y-auto p-8">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ba9eff]/[0.03] blur-[120px]" />
        <div className="mx-auto w-full max-w-3xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#f6f3f5]">Transform your product</h1>
            <p className="mt-2 text-sm text-[#949499]">Upload a photo and let AI craft a professional ad in seconds.</p>
          </div>
          <UploadZone />
          <PromptBar onGo={gen} />
          <Canvas />
          <ChatPanel onRegen={regen} />
        </div>
      </section>
      <aside className="hidden w-72 shrink-0 border-l border-white/[0.06] bg-[#050505] p-6 lg:block">
        <SettingsPanel />
      </aside>
    </div>
  )
}
