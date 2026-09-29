// Тема сайта всегда равна теме устройства, без ручного переключателя и без
// сохранения выбора. initTheme() выставляет ее при загрузке и подписывается
// на смену темы в системе, чтобы сайт переключался на лету, без перезагрузки.

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#131417' : '#fdfcf9')
}

export function initTheme() {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  applyTheme(media.matches ? 'dark' : 'light')

  const onChange = (event) => applyTheme(event.matches ? 'dark' : 'light')
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
