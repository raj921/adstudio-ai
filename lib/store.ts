import { create } from "zustand"
import type { Analysis, Job, Msg, Size, Status } from "@/types/studio"

const fresh = (): Job => ({
  id: crypto.randomUUID(),
  status: "idle",
  src: null,
  size: "instagram",
  prompt: "",
  msgs: [],
})

type Store = {
  job: Job
  setSrc: (v: string) => void
  setPrompt: (v: string) => void
  setSize: (v: Size) => void
  setStatus: (v: Status) => void
  setAnalysis: (v: Analysis) => void
  setResult: (v: string) => void
  push: (m: Msg) => void
  reset: () => void
}

export const useStore = create<Store>((set) => ({
  job: fresh(),
  setSrc: (v) => set((s) => ({ job: { ...s.job, src: v } })),
  setPrompt: (v) => set((s) => ({ job: { ...s.job, prompt: v } })),
  setSize: (v) => set((s) => ({ job: { ...s.job, size: v } })),
  setStatus: (v) => set((s) => ({ job: { ...s.job, status: v } })),
  setAnalysis: (v) => set((s) => ({ job: { ...s.job, analysis: v } })),
  setResult: (v) => set((s) => ({ job: { ...s.job, result: v } })),
  push: (m) => set((s) => ({ job: { ...s.job, msgs: [...s.job.msgs, m] } })),
  reset: () => set({ job: fresh() }),
}))
