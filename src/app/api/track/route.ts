import { NextRequest, NextResponse } from 'next/server'
import { UAParser } from 'ua-parser-js'
import { insertVisitor } from '../../../lib/visitor-db'
import { log, logError } from '../../../lib/logger'
import { isRateLimited } from '../../../lib/rate-limit'

export const runtime = 'nodejs'

function getIstDateTime() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date()).reduce<Record<string, string>>((result, part) => {
    result[part.type] = part.value
    return result
  }, {})
  return { date: `${parts.day}-${parts.month}-${parts.year}`, time: `${parts.hour}:${parts.minute}:${parts.second}` }
}

export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = request.headers.get('cf-connecting-ip') || forwarded?.split(',')[0].trim() || 'Unknown'
    if (isRateLimited(`track:${ip}`, 30, 60_000)) return NextResponse.json({ ok: true })
    const parsed = new UAParser(request.headers.get('user-agent') || '').getResult()
    const isPrivate = ['127.', '192.168.', '10.', '::1', 'localhost'].some((range) => ip.startsWith(range))
    let city = 'Local', state = 'Local', country = 'Local'

    if (!isPrivate) {
      try {
        const response = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=city,regionName,country`, { signal: AbortSignal.timeout(3000) })
        const geo = await response.json() as { city?: string; regionName?: string; country?: string }
        city = geo.city || 'Unknown'
        state = geo.regionName || 'Unknown'
        country = geo.country || 'Unknown'
      } catch { /* Visitor tracking must not fail when geo lookup is unavailable. */ }
    }

    const { date, time } = getIstDateTime()
    await insertVisitor({
      ip, city, state, country,
      device: parsed.device.type || 'Desktop',
      model: [parsed.device.vendor, parsed.device.model].filter(Boolean).join(' ') || 'Unknown',
      browser: `${parsed.browser.name || 'Unknown'} ${parsed.browser.version || ''}`.trim(),
      os: `${parsed.os.name || 'Unknown'} ${parsed.os.version || ''}`.trim(),
      ist_date: date, ist_time: time, timestamp: Date.now(),
    })
    void log('info', 'visitor.recorded', { country, device: parsed.device.type || 'Desktop' })
    return NextResponse.json({ ok: true })
  } catch (error) {
    void logError('visitor.record_failed', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
