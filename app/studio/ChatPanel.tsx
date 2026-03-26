"use client"

import { useRef, useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatPanel({ onRegen }: { onRegen: (p: string) => void }) {
  const { job, push } = useStore()
  const [val, setVal] = useState("")
  const [busy, setBusy] = useState(false)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }) }, [job.msgs])

  if (!job.result) return null

  const send = async () => {
    const txt = val.trim()
    if (!txt || busy) return
    setVal("")
    push({ role: "user", content: txt })
    setBusy(true)

    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPrompt: job.prompt,
          userMessage: txt,
          history: job.msgs.map(m => ({ role: m.role, content: m.content })),
          analysis: job.analysis ?? null,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed")
      const { newPrompt, explanation } = await res.json()
      push({ role: "assistant", content: explanation })
      onRegen(newPrompt)
    } catch (e) {
      push({ role: "assistant", content: `Error: ${e instanceof Error ? e.message : "Failed"}` })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-white/[0.06] bg-[rgba(21,21,24,0.4)] backdrop-blur-xl">
      <div className="border-b border-white/[0.04] px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#53ddfc]">Refine your ad</p>
      </div>

      <ScrollArea className="max-h-[240px] flex-1 px-4 py-3">
        <div className="space-y-3">
          {job.msgs.length === 0 && <p className="text-xs text-[#949499]/60">Try: &quot;make it warmer&quot; or &quot;add a headline&quot;</p>}
          {job.msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "ml-8 rounded-xl rounded-br-sm bg-[#ba9eff]/10 px-3 py-2 text-xs text-[#f6f3f5]" : "mr-8 rounded-xl rounded-bl-sm bg-[#1a1a1d] px-3 py-2 text-xs text-[#949499]"}>
              {m.content}
            </div>
          ))}
          {busy && (
            <div className="mr-8 flex items-center gap-2 rounded-xl rounded-bl-sm bg-[#1a1a1d] px-3 py-2">
              <div className="h-3 w-3 animate-spin rounded-full border border-[#ba9eff] border-t-transparent" />
              <span className="text-xs text-[#949499]">Thinking...</span>
            </div>
          )}
          <div ref={end} />
        </div>
      </ScrollArea>

      <div className="border-t border-white/[0.04] p-2">
        <div className="flex items-center gap-2">
          <Input
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Make it warmer, add a headline..."
            disabled={busy}
            className="h-8 border-0 bg-transparent text-xs text-[#f6f3f5] shadow-none placeholder:text-[#949499]/40 focus-visible:ring-0"
          />
          <Button variant="ghost" size="icon-sm" onClick={send} disabled={!val.trim() || busy} className="shrink-0 rounded-lg bg-[#ba9eff]/20 text-[#ba9eff] hover:bg-[#ba9eff]/30 disabled:opacity-30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
