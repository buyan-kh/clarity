import type React from "react"
import type { Metadata } from "next"
import { Kode_Mono } from "next/font/google"
import "./globals.css"

// Load Kode Mono font
const kodeMono = Kode_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Clarity - Focus Tracking",
  description: "A minimalistic focus tracking application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={kodeMono.className}>{children}</body>
    </html>
  )
}
