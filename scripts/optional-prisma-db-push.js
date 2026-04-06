const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function readDatabaseUrlFromEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env')
    if (!fs.existsSync(envPath)) return ''

    const file = fs.readFileSync(envPath, 'utf8')
    const line = file
      .split(/\r?\n/)
      .find((entry) => entry.trim().startsWith('DATABASE_URL='))

    if (!line) return ''

    const rawValue = line.slice(line.indexOf('=') + 1).trim()
    return rawValue.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
  } catch {
    return ''
  }
}

const databaseUrl = process.env.DATABASE_URL || readDatabaseUrlFromEnvFile()

if (!databaseUrl) {
  console.warn('[build] DATABASE_URL ontbreekt, prisma db push wordt overgeslagen.')
  process.exit(0)
}

if (!/^postgres(ql)?:\/\//i.test(databaseUrl)) {
  console.warn('[build] DATABASE_URL is geen PostgreSQL URL, prisma db push wordt overgeslagen.')
  process.exit(0)
}

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const args = ['prisma', 'db', 'push', '--accept-data-loss', '--skip-generate']

const result = spawnSync(command, args, {
  stdio: 'inherit',
  env: process.env,
})

if (result.error) {
  console.error('[build] Fout bij uitvoeren van prisma db push:', result.error.message)
  process.exit(1)
}

process.exit(result.status === null ? 1 : result.status)
