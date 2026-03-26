"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { Analysis } from "@/types/studio"

export function UploadZone() {
  const { job, setSrc, setStatus, setAnalysis } = useStore()
  const [err, setErr] = useState<string | null>(null)

  const onDrop = useCallback(async (files: File[]) => {
    const f = files[0]
    if (!f) return
    setErr(null)

    const r = new FileReader()
    r.onload = async () => {
      const dataUrl = r.result as string
      setSrc(dataUrl)
      setStatus("analyzing")

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sourceImage: dataUrl }),
        })
        if (!res.ok) throw new Error((await res.json()).error || "Failed")
        const data: Analysis = await res.json()
        setAnalysis(data)
        setStatus("idle")
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Analysis failed")
        setStatus("failed")
      }
    }
    r.readAsDataURL(f)
  }, [setSrc, setStatus, setAnalysis])

  const { getRootProps, getInputProps, isDragActive: drag } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxSize: 15 * 1024 * 1024,
    multiple: false,
  })

  const clear = () => {
    setSrc("")
    setAnalysis({ productLabel: "", summary: "", colors: [], materials: [], tags: [], sceneSuggestions: [] })
    setStatus("idle")
    setErr(null)
  }

  if (job.src) {
    return (
      <div className="group relative">
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111114]">
          <img src={job.src} alt="Product" className="mx-auto max-h-[360px] object-contain" />
          {job.status === "analyzing" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ba9eff] border-t-transparent" />
                <span className="text-xs font-semibold tracking-widest uppercase text-[#ba9eff]">Analyzing...</span>
              </div>
            </div>
          )}
        </div>
        {err && <p className="mt-2 text-center text-xs text-red-400">{err}</p>}
        <button onClick={clear} className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/70 backdrop-blur-sm hover:bg-black/70 hover:text-white">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>
    )
  }

  return (
    <div {...getRootProps()} className={cn(
      "group relative w-full cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300",
      drag ? "border-[#ba9eff]/60 bg-[#ba9eff]/[0.04]" : "border-white/[0.08] bg-[#0a0a0c]/50 hover:border-[#ba9eff]/30 hover:bg-[#111114]/60"
    )}>
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-5 py-16">
        <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a1a1d] ring-1 ring-white/[0.06] transition-transform duration-500 group-hover:scale-110", drag && "scale-110 bg-[#ba9eff]/10")}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={cn("transition-colors", drag ? "text-[#ba9eff]" : "text-[#ae8dff]")}>
            <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v1a2 2 0 002 2h12a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-base font-bold tracking-tight text-[#f6f3f5]">{drag ? "Drop it here" : "Drop your product image here"}</p>
          <p className="mt-1.5 text-xs font-medium text-[#949499]">PNG, JPG, WebP — Max 15 MB</p>
        </div>
      </div>
    </div>
  )
}
