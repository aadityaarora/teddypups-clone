import Image from "next/image";
import type { Media } from "@/lib/data/puppies";

// next/image `fill` with the original's focal point, dominant colour and blur placeholder
export function MediaImage({
  media,
  sizes,
  alt = media.alt,
  priority,
  loading,
}: {
  media: Media;
  sizes: string;
  alt?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
}) {
  const pos = `${+(media.focalX * 100).toFixed(1)}% ${+(media.focalY * 100).toFixed(1)}%`;
  return (
    <Image
      src={media.url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : loading}
      placeholder={media.blurDataUrl ? "blur" : "empty"}
      blurDataURL={media.blurDataUrl}
      style={{ objectFit: "cover", objectPosition: pos, backgroundColor: media.color }}
    />
  );
}
