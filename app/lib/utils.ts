import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Diff<T> =
  | { type: "added"; newValue: T }
  | { type: "deleted"; oldValue: T }
  | { type: "changed"; oldValue: T; newValue: T };

export function diff<T, U>(obj1: T, obj2: U): Record<string, Diff<any>> {
  const changes: Record<string, Diff<any>> = {};

  function compare(o1: any, o2: any, path: string = ""): void {
    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);

    new Set([...keys1, ...keys2]).forEach((key) => {
      const currentPath = path ? `${path}.${key}` : key;
      const val1 = o1[key];
      const val2 = o2[key];

      if (val1 === undefined) {
        changes[currentPath] = { type: "added", newValue: val2 };
      } else if (val2 === undefined) {
        changes[currentPath] = { type: "deleted", oldValue: val1 };
      } else if (
        typeof val1 === "object" &&
        typeof val2 === "object" &&
        val1 !== null &&
        val2 !== null &&
        !Array.isArray(val1) &&
        !Array.isArray(val2)
      ) {
        compare(val1, val2, currentPath);
      } else if (val1 !== val2) {
        changes[currentPath] = {
          type: "changed",
          oldValue: val1,
          newValue: val2,
        };
      }
    });
  }

  compare(obj1, obj2);
  return changes;
}
