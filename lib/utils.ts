import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Append UTM tracking params to an external partner link.
 */
export function withUtm(url: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has("utm_source")) {
      u.searchParams.set("utm_source", "bp_gateway");
      u.searchParams.set("utm_medium", "console");
    }
    return u.toString();
  } catch {
    return url;
  }
}
