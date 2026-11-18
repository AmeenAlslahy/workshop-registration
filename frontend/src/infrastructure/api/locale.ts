const DEFAULT_LOCALE = 'en'

/**
 * Request language for the API. The UI already writes the active locale to the
 * document root, so infrastructure reads it from there instead of keeping a
 * second copy of the language state.
 */
export function getRequestLocale(): string {
  const locale = document.documentElement.lang.trim()
  return locale.length > 0 ? locale : DEFAULT_LOCALE
}
