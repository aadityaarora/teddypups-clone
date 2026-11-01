import Image from "next/image";
import type { Media } from "@/lib/data/puppies";

// next/image with the original's dominant colour and blur placeholder.
// layout "fill" (default): covers its positioned parent, cropped around the focal point.
// layout "natural": intrinsic aspect ratio at 100% width (polaroids).
export function MediaImage({
  media,
  sizes,
  alt = media.alt,
  priority,
  loading,
  layout = "fill",
}: {
  media: Media;
  sizes: string;
  alt?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  layout?: "fill" | "natural";
}) {
  const blur = media.blurDataUrl ? { placeholder: "blur" as const, blurDataURL: media.blurDataUrl } : {};
  const common = { src: media.url, sizes, priority, loading: priority ? undefined : loading, ...blur };

  if (layout === "natural") {
    return (
      <Image
        {...common}
        alt={alt}
        width={media.width}
        height={media.height}
        style={{ width: "100%", height: "auto", backgroundColor: media.color }}
      />
    );
  }

  const pos = `${+(media.focalX * 100).toFixed(1)}% ${+(media.focalY * 100).toFixed(1)}%`;
  return <Image {...common} alt={alt} fill style={{ objectFit: "cover", objectPosition: pos, backgroundColor: media.color }} />;
}
