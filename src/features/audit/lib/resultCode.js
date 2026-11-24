const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Короткий код результата: используется в событиях аудита. */
export function makeResultCode(random = Math.random) {
  let code = ''
  for (let i = 0; i < 4; i += 1) {
    code += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)]
  }
  return code
}

