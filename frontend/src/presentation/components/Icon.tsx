import type { ReactNode, SVGProps } from 'react'

export type IconName =
  | 'alert'
  | 'arrow-right'
  | 'calendar'
  | 'check'
  | 'chevron-down'
  | 'clock'
  | 'globe'
  | 'info'
  | 'lock'
  | 'moon'
  | 'refresh'
  | 'seat'
  | 'sun'
  | 'users'
  | 'x'

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
}

const paths: Record<IconName, ReactNode> = {
  alert: (
    <>
      <path d="M10 2.8 18 16.5H2L10 2.8Z" />
      <path d="M10 7.2v4.1" />
      <path d="M10 14.2h.01" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M3.5 10h13" />
      <path d="m11.5 5 5 5-5 5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="14" height="13" rx="3" />
      <path d="M3 8.5h14M7 2.5v4M13 2.5v4" />
    </>
  ),
  check: <path d="m4 10.5 3.6 3.6L16 5.8" />,
  'chevron-down': <path d="m5 7.5 5 5 5-5" />,
  clock: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 5.8V10l2.8 1.7" />
    </>
  ),
  info: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9v4.3" />
      <path d="M10 6.2h.01" />
    </>
  ),
  globe: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M2.8 10h14.4" />
      <path d="M10 2.5c2.2 2.1 3.4 4.7 3.4 7.5s-1.2 5.4-3.4 7.5c-2.2-2.1-3.4-4.7-3.4-7.5S7.8 4.6 10 2.5Z" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="9" width="12" height="8" rx="2" />
      <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
    </>
  ),
  moon: (
    <path d="M16.2 12.3A6.8 6.8 0 0 1 7.7 3.8 7.5 7.5 0 1 0 16.2 12.3Z" />
  ),
  refresh: (
    <>
      <path d="M16.5 10a6.5 6.5 0 1 1-1.9-4.6" />
      <path d="M16.5 3.5V9H11" />
    </>
  ),
  seat: (
    <>
      <path d="M5 4.5v8.5h10V4.5" />
      <path d="M5 9.5h10" />
      <path d="M3 16h14" />
    </>
  ),
  sun: (
    <>
      <circle cx="10" cy="10" r="3.6" />
      <path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4" />
    </>
  ),
  users: (
    <>
      <circle cx="7.5" cy="7" r="2.5" />
      <path d="M2.5 16c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      <circle cx="14" cy="8" r="2" />
      <path d="M12.5 16c0-2.2 1.3-4 3-4" />
    </>
  ),
  x: <path d="m5 5 10 10M15 5 5 15" />,
}

export function Icon({ name, size = 18, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
