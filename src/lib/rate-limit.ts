type RateLimitEntry = { count: number; resetAt: number }

const entries = new Map<string, RateLimitEntry>()
const maximumEntries = 10_000

export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  if (entries.size > maximumEntries) {
    for (const [entryKey, entry] of entries) if (entry.resetAt <= now) entries.delete(entryKey)
  }
  const current = entries.get(key)
  if (!current || current.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }
  current.count += 1
  return current.count > limit
}
