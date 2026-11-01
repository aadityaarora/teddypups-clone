// A home "scene": a section with a vertical sky gradient and a light/dark ink tone (see .tp-scene)
import type { Tone } from "@/lib/data/home-copy";

export function Scene({
  tone,
  className,
  labelledBy,
  style,
  children,
  ...rest
}: {
  tone: Tone;
  className: string;
  labelledBy: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "style" | "className">) {
  return (
    <section
      data-pup-scene="true"
      data-tone={tone.dark ? "dark" : "light"}
      className={`tp-scene ${className}`}
      style={{ "--sky-top": tone.top, "--sky-bottom": tone.bottom, ...style } as React.CSSProperties}
      aria-labelledby={labelledBy}
      {...rest}
    >
      {children}
    </section>
  );
}
