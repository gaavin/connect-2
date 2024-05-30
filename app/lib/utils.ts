import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import debugFactory from "debug";

export const debug = (...args: Parameters<typeof debugFactory>) =>
  debugFactory(__filename);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
