import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { MerchGlobal } from "@/components/merch/MerchGlobal"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

/** Same Fraunces files as the app (brand-kit/fonts) */
const fraunces = localFont({
  src: [
    { path: "./fonts/Fraunces_700Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Fraunces_400Regular_Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "The Haven | A ministry of CBU PCM",
  description:
    "The Haven is a ministry of The Copperbelt University Public Campus Ministries — a place to belong for worship, Bible study, fellowship and service.",
}

export const viewport: Viewport = {
  themeColor: "#0f2d6e",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
        <AuthProvider>
          <MerchGlobal>
            <Suspense fallback={null}>{children}</Suspense>
          </MerchGlobal>
          <Toaster richColors position="top-center" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
