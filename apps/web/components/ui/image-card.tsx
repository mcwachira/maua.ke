import Image from "next/image";

import { cn } from "@/lib/utils"

type Props = {
  imageUrl: string
  caption: string
  className?: string
}

export default function ImageCard({ imageUrl, caption, className }: Props) {
  return (
    <figure
      className={cn(
        "w-[250px] overflow-hidden rounded-base border-2 border-border bg-background font-base shadow-shadow",
        className,
      )}
    >
      <Image
        className="aspect-4/3 w-full"
        src={imageUrl}
        alt="image"
        width={500}
        height={375}
      />
      <figcaption className="border-t-2 text-foreground border-border p-4">
        {caption}
      </figcaption>
    </figure>
  )
}
