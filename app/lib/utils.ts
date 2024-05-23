import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isType<T>(
  value: any,
  transform?: (value: any) => T
): value is T {
  transform ? (value = transform(value)) : (value = value);
  return z.custom<T>().safeParse(value).success;
}
