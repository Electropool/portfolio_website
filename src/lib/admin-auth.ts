import { createHmac, timingSafeEqual } from 'crypto'

const tokenLifetimeMs = 8 * 60 * 60 * 1000

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.startsWith('CHANGE_ME') || secret.length < 32) return null
  return secret
}

export function isAuthConfigured() {
  return Boolean(getSecret() && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD)
}

function safelyEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

export function createAdminToken() {
  const secret = getSecret()
  if (!secret) throw new Error('ADMIN_SESSION_SECRET must be configured')
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + tokenLifetimeMs })).toString('base64url')
  const signature = createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

export function isAdminToken(value: string | null) {
  const secret = getSecret()
  const token = value?.replace(/^Bearer\s+/i, '')
  if (!secret || !token) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  const expected = createHmac('sha256', secret).update(payload).digest('base64url')
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now()
  } catch { return false }
}

export function validCredentials(username: unknown, password: unknown) {
  const configuredUsername = process.env.ADMIN_USERNAME
  const configuredPassword = process.env.ADMIN_PASSWORD
  return typeof username === 'string' && typeof password === 'string'
    && Boolean(configuredUsername && configuredPassword)
    && safelyEqual(username, configuredUsername!) && safelyEqual(password, configuredPassword!)
}
