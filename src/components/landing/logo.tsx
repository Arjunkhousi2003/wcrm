import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  /** Use `dark` on dark backgrounds (e.g. footer). */
  theme?: "light" | "dark";
};

const sizes = {
  sm: { width: 140, height: 32, className: "h-8 w-auto" },
  md: { width: 180, height: 40, className: "h-9 w-auto sm:h-10" },
  lg: { width: 220, height: 52, className: "h-12 w-auto sm:h-14" },
};

export function Logo({
  className,
  size = "md",
  priority = false,
  theme = "light",
}: LogoProps) {
  const { width, height, className: sizeClass } = sizes[size];

  return (
    <span
      className={cn(
        "inline-flex items-center bg-white",
        theme === "light"
          ? "rounded-lg"
          : "rounded-xl p-1.5 shadow-lg shadow-black/30 ring-1 ring-white/15",
        className,
      )}
    >
      <Image
        src="/techdigi-logo.png"
        alt="TECHDIGI Software Pvt Ltd"
        width={width}
        height={height}
        priority={priority}
        className={cn("object-contain", sizeClass)}
        unoptimized
      />
    </span>
  );
}
