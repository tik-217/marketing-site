import { mkdirSync, writeFileSync } from 'node:fs'

const token = process.env.TELEGRAM_BOT_TOKEN
const chatId = process.env.TELEGRAM_CHAT_ID
if (!token || !chatId) throw new Error('Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID for the server contact form')
const encoded = Buffer.from(JSON.stringify({ token, chat_id: chatId })).toString('base64')
mkdirSync('dist/api', { recursive: true })
writeFileSync('dist/api/contact-config.php', `<?php return json_decode(base64_decode('${encoded}'), true);\n`, { mode: 0o600 })
