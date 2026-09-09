import { NextRequest, NextResponse } from 'next/server'
import { isAdminToken } from '../../../lib/admin-auth'
import { getVisitorLogs } from '../../../lib/visitor-db'
import { log, logError } from '../../../lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!isAdminToken(request.headers.get('authorization'))) {
    void log('warn', 'admin.logs_unauthorized')
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 })
  }
  try {
    return NextResponse.json({ ok: true, logs: await getVisitorLogs() })
  } catch (error) {
    void logError('admin.logs_read_failed', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
