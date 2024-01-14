import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Reading time
export function getMinutes(minutes: number) {
    const roundedMinutes = Math.round(minutes);
    return `${roundedMinutes} min`;
}


// BlurData for loading images with blur effect
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#d1d5db" offset="20%" />
      <stop stop-color="#d7dade" offset="50%" />
      <stop stop-color="#d1d5db" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#d1d5db" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
    typeof window === "undefined"
        ? Buffer.from(str).toString("base64")
        : window.btoa(str);

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatDate = (date: string) => {
    return format(parseISO(date), "MMMM d, yyyy")
}
