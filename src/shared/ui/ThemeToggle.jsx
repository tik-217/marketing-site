import { useEffect, useState } from 'react'
import { applyTheme, getPreferredTheme } from '../lib/theme/theme'
import { MoonIcon } from './MoonIcon'
import { SunIcon } from './SunIcon'

export function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    setTheme(getPreferredTheme())
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  const classes = ['theme-toggle', className].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      onClick={toggle}
      className={classes}
      aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
