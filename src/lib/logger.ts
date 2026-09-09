import { appendFile, mkdir } from 'fs/promises'
import { join } from 'path'

type LogLevel = 'info' | 'warn' | 'error'
type LogMetadata = Record<string, unknown>

const logDirectory = process.env.LOG_DIR || join(process.cwd(), 'logs')
let directoryReady: Promise<void> | undefined

function ensureDirectory() {
  directoryReady ??= mkdir(logDirectory, { recursive: true }).then(() => undefined)
  return directoryReady
}

function serializeError(error: unknown) {
  if (error instanceof Error) return { name: error.name, message: error.message, stack: error.stack }
  return { value: String(error) }
}

/** Writes newline-delimited JSON without recording credentials, tokens, or visitor IPs. */
export async function log(level: LogLevel, event: string, metadata: LogMetadata = {}) {
  const entry = JSON.stringify({ timestamp: new Date().toISOString(), level, event, ...metadata }) + '\n'
  try {
    await ensureDirectory()
    await appendFile(join(logDirectory, 'application.log'), entry, { encoding: 'utf8', mode: 0o600 })
  } catch (error) {
    // Last-resort visibility if the configured log storage is unavailable.
    console.error('Application logger unavailable', serializeError(error))
  }
}

export function logError(event: string, error: unknown, metadata: LogMetadata = {}) {
  return log('error', event, { ...metadata, error: serializeError(error) })
}
