import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken, isAuthConfigured, validCredentials } from '../../../lib/admin-auth'
import { log, logError } from '../../../lib/logger'
import { isRateLimited } from '../../../lib/rate-limit'

export async function POST(request: NextRequest) {
  const client = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (isRateLimited(`login:${client}`, 10, 15 * 60 * 1000)) {
    void log('warn', 'auth.rate_limited')
    return NextResponse.json({ ok: false, message: 'Too many attempts' }, { status: 429 })
  }
  let credentials: { username?: unknown; password?: unknown }
  try { credentials = await request.json() } catch { return NextResponse.json({ ok: false, message: 'Invalid request' }, { status: 400 }) }
  const { username, password } = credentials
  if (!isAuthConfigured()) {
    void log('error', 'auth.configuration_missing')
    return NextResponse.json({ ok: false, message: 'Server authentication is not configured' }, { status: 503 })
  }
  if (!validCredentials(username, password)) {
    void log('warn', 'auth.login_failed')
    return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 })
  }
  try {
    void log('info', 'auth.login_succeeded')
    return NextResponse.json({ ok: true, token: createAdminToken() })
  } catch (error) {
    void logError('auth.token_creation_failed', error)
    return NextResponse.json({ ok: false, message: 'Server authentication is not configured' }, { status: 503 })
  }
}
