import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { PosterCard } from "@/components/posters/PosterCard"
import { POSTERS } from "@/lib/posters"

export const metadata = { title: "Posters | The Haven" }

export default function PostersPage() {
  return (
    <MinistryPageShell eyebrow="What's on"
      title="Posters" subtitle="Download and share what's on at The Haven.">
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {POSTERS.map((poster) => (
          <div key={poster.slug} className="flex flex-col gap-3">
            <PosterCard poster={poster} />
            <Button asChild variant="outline" className="rounded-full border-white/25 bg-white/5 text-white hover:bg-white/10">
              <a href={poster.image} download>
                <Download className="mr-2 w-4 h-4" />
                Download
              </a>
            </Button>
          </div>
        ))}
      </div>
    </MinistryPageShell>
  )
}
