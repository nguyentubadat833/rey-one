export function nullToUndefined<T extends Record<string, any>>(obj: T): {
  [K in keyof T]: Exclude<T[K], null> | undefined
} {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value === null ? undefined : value])
  ) as any
}