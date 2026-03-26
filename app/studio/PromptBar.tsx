"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"

const DEFAULTS = [
  "Product on a marble countertop with morning light",
  "Flat-lay on linen with dried eucalyptus",
  "Summer Instagram ad with bold headline",
  "Minimalist studio shot on seamless white",
]

export function PromptBar({ onGo }: { onGo: () => void }) {
  const { job, setPrompt } = useStore()
  const [val, setVal] = useState("")

  const chips = job.analysis?.sceneSuggestions?.length ? job.analysis.sceneSuggestions : DEFAULTS

  const submit = () => {
    const v = val.trim()
    if (!v) return
    setPrompt(v)
    onGo()
  }

  const pick = (s: string) => { setVal(s); setPrompt(s); onGo() }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-[rgba(21,21,24,0.4)] p-2 shadow-[0_0_40px_-10px_rgba(186,158,255,0.15)] backdrop-blur-xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#ba9eff]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" /></svg>
        </div>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={job.analysis ? `Scene for your ${job.analysis.productLabel}...` : "Describe the scene..."}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#f6f3f5] placeholder:text-[#949499]/50 focus:outline-none"
        />
        <button
          onClick={submit}
          disabled={!val.trim() || job.status === "generating"}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-br from-[#ba9eff] to-[#8455ef] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-[0_4px_20px_-4px_rgba(186,158,255,0.5)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(186,158,255,0.7)] hover:-translate-y-px active:scale-95 disabled:opacity-50"
        >
          {job.status === "generating" ? (
            <><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />Generating</>
          ) : (
            <>Generate<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3L4 14h7v7l9-11h-7V3z" /></svg></>
          )}
        </button>
      </div>

      {job.analysis && (
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#949499]">
          Detected: {job.analysis.productLabel}
          {job.analysis.tags.length > 0 && <span className="text-[#ba9eff]">— {job.analysis.tags.slice(0, 3).join(", ")}</span>}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {chips.map((s, i) => (
          <button key={i} onClick={() => pick(s)} className="rounded-full border border-white/[0.06] bg-[rgba(21,21,24,0.4)] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#949499] backdrop-blur-xl transition-all hover:border-[#53ddfc]/40 hover:text-[#53ddfc]">
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
