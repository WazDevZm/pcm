import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CBU SDA Public Campus Ministries",
  description:
    "Join CBU SDA Public Campus Ministries for spiritual growth, community outreach, biblical studies, and meaningful fellowship with fellow believers.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable}`}>
        <AuthProvider>
          <MerchGlobal>
            <Suspense fallback={null}>{children}</Suspense>
          </MerchGlobal>
          <Toaster theme="dark" richColors position="top-center" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
