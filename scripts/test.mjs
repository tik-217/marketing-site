import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

function tests(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? tests(path) : entry.isFile() && entry.name.endsWith('.test.js') ? [path] : []
  })
}
const result = spawnSync(process.execPath, ['--test', ...tests('src')], { stdio: 'inherit' })
if (result.error) throw result.error
process.exit(result.status ?? 1)
