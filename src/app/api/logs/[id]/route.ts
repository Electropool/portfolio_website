import { NextRequest, NextResponse } from 'next/server'
import { isAdminToken } from '../../../../lib/admin-auth'
import { deleteVisitorLog } from '../../../../lib/visitor-db'
import { log, logError } from '../../../../lib/logger'

export const runtime = 'nodejs'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminToken(request.headers.get('authorization'))) {
    void log('warn', 'admin.log_delete_unauthorized')
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 })
  }
  const id = Number(params.id)
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ ok: false }, { status: 400 })
  try {
    await deleteVisitorLog(id)
    void log('info', 'admin.log_deleted', { id })
    return NextResponse.json({ ok: true })
  } catch (error) {
    void logError('admin.log_delete_failed', error, { id })
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
