import { Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "AdStudio AI — Product Ad Generator",
  description: "Upload a product photo. Describe a scene. Get a professional ad.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={cn(
          "min-h-screen bg-[#050505] font-sans text-[#f6f3f5] antialiased",
          inter.variable
        )}
      >
        <ThemeProvider>
          {/* Top nav */}
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#050505]/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="h-6 w-1.5 rounded-full bg-[#ba9eff]" />
              <span className="text-lg font-extrabold tracking-tight">
                AdStudio AI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="rounded-full border border-[#ba9eff]/20 bg-[rgba(21,21,24,0.4)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#ba9eff] backdrop-blur-xl">
                Beta
              </span>
            </div>
          </header>

          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
