interface BrandMarkProps {
  size?: number
}

export function BrandMark({ size = 36 }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="64" height="64" rx="16" fill="var(--color-brand)" />
      <path
        d="M18 42V26.5L32 18l14 8.5V42"
        fill="none"
        stroke="var(--color-canvas)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="37" r="5" fill="var(--color-accent)" />
    </svg>
  )
}
