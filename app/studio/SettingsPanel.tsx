"use client"

import { useStore } from "@/lib/store"
import { SIZES, type Size } from "@/types/studio"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const RATIO: Record<Size, string> = { instagram: "1:1", stories: "9:16", facebook: "3:2", linkedin: "1:1" }

export function SettingsPanel() {
  const { job, setSize } = useStore()

  return (
    <div className="space-y-8">
      <div>
        <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#53ddfc]">Output Size</label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(SIZES) as [Size, (typeof SIZES)[Size]][]).map(([k, { w, h, label }]) => (
            <Button key={k} variant="ghost" onClick={() => setSize(k)} className={cn(
              "flex h-auto flex-col items-center gap-2 rounded-xl border p-4",
              job.size === k ? "border-[#ba9eff]/40 bg-[#ba9eff]/[0.06] shadow-[0_0_20px_-6px_rgba(186,158,255,0.2)]" : "border-white/[0.06] bg-[rgba(21,21,24,0.4)] hover:border-[#ba9eff]/20"
            )}>
              <div className={cn("flex items-center justify-center rounded-lg border text-[10px] font-bold", job.size === k ? "border-[#ba9eff]/30 text-[#ba9eff]" : "border-white/[0.08] text-[#949499]")} style={{ width: k === "stories" ? 20 : 32, height: k === "stories" ? 32 : k === "facebook" ? 20 : 32 }}>
                {RATIO[k]}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#f6f3f5]">{label}</span>
              <span className="text-[9px] text-[#949499]">{w} × {h}</span>
            </Button>
          ))}
        </div>
      </div>

      {job.analysis && (
        <div>
          <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#53ddfc]">Product Info</label>
          <div className="space-y-2 rounded-xl border border-white/[0.04] bg-[#111114]/60 p-4">
            <p className="text-xs font-semibold text-[#f6f3f5]">{job.analysis.productLabel}</p>
            <p className="text-[11px] leading-relaxed text-[#949499]">{job.analysis.summary}</p>
            {job.analysis.colors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[...job.analysis.colors, ...job.analysis.materials].map((t, i) => (
                  <Badge key={i} variant="outline" className="rounded-full border-white/[0.08] text-[10px] text-[#949499]">{t}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
