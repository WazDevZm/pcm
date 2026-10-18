import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Poster } from "@/lib/posters"

export function PosterCard({ poster, className }: { poster: Poster; className?: string }) {
  return (
    <figure className={cn("overflow-hidden rounded-2xl border border-white/10 bg-white/5", className)}>
      <div className="relative aspect-[4/5]">
        <Image
          src={poster.image}
          alt={poster.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <figcaption className="p-4">
        <p className="font-semibold">{poster.title}</p>
        <p className="mt-1 text-sm text-white/70">{poster.caption}</p>
      </figcaption>
    </figure>
  )
}
