const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(locale: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(locale)
  if (cached) {
    return cached
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    numberingSystem: 'latn',
  })
  formatterCache.set(locale, formatter)
  return formatter
}

export function formatDateTime(value: string, locale = 'en'): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return locale === 'ar' ? 'وقت غير معروف' : 'Unknown time'
  }

  return getFormatter(locale).format(date)
}
