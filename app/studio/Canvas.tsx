"use client"

import { useStore } from "@/lib/store"

export function Canvas() {
  const { job } = useStore()

  if (job.status === "generating") return (
    <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0a0a0c]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#ba9eff]/20 border-t-[#ba9eff]" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border border-[#ba9eff]/10" />
        </div>
        <p className="text-sm font-bold text-[#f6f3f5]">Crafting your ad</p>
        <p className="text-xs text-[#949499]">Composing the perfect scene...</p>
      </div>
    </div>
  )

  if (job.result) return (
    <div className="group relative">
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0c]">
        <img src={job.result} alt="Ad" className="w-full object-contain" />
      </div>
      <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <a href={job.result} download={`ad-${job.id}.png`} className="flex h-9 items-center gap-2 rounded-lg bg-black/60 px-3 text-xs font-semibold text-white backdrop-blur-sm hover:bg-black/80">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
          Download
        </a>
      </div>
      {job.prompt && (
        <div className="mt-3 rounded-xl border border-white/[0.04] bg-[#111114]/60 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#949499]">Prompt</p>
          <p className="mt-1 text-xs leading-relaxed text-[#f6f3f5]/70">{job.prompt}</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-white/[0.06] bg-[#0a0a0c]/30">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a1a1d] ring-1 ring-white/[0.06]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#949499]"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" /><path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <p className="text-sm font-semibold text-[#949499]">Your ad will appear here</p>
        <p className="mt-1 text-xs text-[#949499]/60">Upload a product and describe a scene</p>
      </div>
    </div>
  )
}
