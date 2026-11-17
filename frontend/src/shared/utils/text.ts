export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const firstTwo = words.slice(0, 2)

  if (firstTwo.length === 0) {
    return '?'
  }

  return firstTwo.map((word) => word.charAt(0).toUpperCase()).join('')
}
