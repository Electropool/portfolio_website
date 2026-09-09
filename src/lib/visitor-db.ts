import { join } from 'path'
import Database from 'sqlite3'
import { dirname } from 'path'
import { mkdirSync } from 'fs'
import { logError } from './logger'

export interface VisitorLog {
  id: number
  ip: string
  city: string
  state: string
  country: string
  device: string
  model: string
  browser: string
  os: string
  ist_date: string
  ist_time: string
  timestamp: number
}

const databasePath = process.env.DB_PATH || join(process.cwd(), 'visitor_logs.db')
mkdirSync(dirname(databasePath), { recursive: true })
const db = new Database.Database(databasePath)

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS visitor_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT, city TEXT, state TEXT, country TEXT, device TEXT, model TEXT,
    browser TEXT, os TEXT, ist_date TEXT, ist_time TEXT, timestamp INTEGER
  )`, (error: Error | null) => { if (error) void logError('database.schema_initialization_failed', error) })
  db.all('PRAGMA table_info(visitor_logs)', (error: Error | null, columns: Array<{ name: string }>) => {
    if (!error && !columns.some((column) => column.name === 'model')) {
      db.run('ALTER TABLE visitor_logs ADD COLUMN model TEXT')
    }
  })
})

export function insertVisitor(log: Omit<VisitorLog, 'id'>) {
  return new Promise<void>((resolve, reject) => {
    db.run(
      `INSERT INTO visitor_logs (ip, city, state, country, device, model, browser, os, ist_date, ist_time, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [log.ip, log.city, log.state, log.country, log.device, log.model, log.browser, log.os, log.ist_date, log.ist_time, log.timestamp],
      (error) => error ? reject(error) : resolve(),
    )
  })
}

export function getVisitorLogs() {
  return new Promise<VisitorLog[]>((resolve, reject) => {
    db.all('SELECT * FROM visitor_logs ORDER BY timestamp DESC LIMIT 500', [], (error, rows: VisitorLog[]) => {
      if (error) reject(error)
      else resolve(rows)
  })
})
}

export function deleteVisitorLog(id: number) {
  return new Promise<void>((resolve, reject) => {
    db.run('DELETE FROM visitor_logs WHERE id = ?', [id], (error) => error ? reject(error) : resolve())
  })
}
