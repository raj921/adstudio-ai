export type Size = "instagram" | "stories" | "facebook" | "linkedin"

export const SIZES: Record<Size, { w: number; h: number; label: string }> = {
  instagram: { w: 1080, h: 1080, label: "Instagram" },
  stories: { w: 1080, h: 1920, label: "Stories" },
  facebook: { w: 1200, h: 628, label: "Facebook" },
  linkedin: { w: 1200, h: 1200, label: "LinkedIn" },
}

export type Analysis = {
  productLabel: string
  summary: string
  colors: string[]
  materials: string[]
  tags: string[]
  sceneSuggestions: string[]
}

export type Msg = { role: "user" | "assistant" | "system"; content: string }

export type Status = "idle" | "analyzing" | "generating" | "completed" | "failed"

export type Job = {
  id: string
  status: Status
  src: string | null
  size: Size
  analysis?: Analysis
  msgs: Msg[]
  prompt: string
  result?: string
  error?: string
}
