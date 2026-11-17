const percentFormatterCache = new Map<string, Intl.NumberFormat>()

function getPercentFormatter(locale: string): Intl.NumberFormat {
  const cached = percentFormatterCache.get(locale)
  if (cached) {
    return cached
  }

  /*
   * Percent signs are direction-sensitive: "67%" rendered inside Arabic RTL
   * text can shift to "%67". Intl adds the bidi marks that keep the sign on
   * the correct side, so the same number works in both languages.
   */
  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 0,
    numberingSystem: 'latn',
  })
  percentFormatterCache.set(locale, formatter)
  return formatter
}

/** Formats a 0–100 percentage such as 67 into "67%" or the Arabic equivalent. */
export function formatPercent(value: number, locale = 'en'): string {
  const safeValue = Number.isFinite(value)
    ? Math.min(100, Math.max(0, value))
    : 0

  return getPercentFormatter(locale).format(safeValue / 100)
}
