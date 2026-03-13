const sizes = {
  sm: 'text-[14px]',
  md: 'text-[16px]',
  lg: 'text-[22px]',
  xl: 'text-[42px]',
}

export default function Logo({ size = 'md' }: { size?: keyof typeof sizes }) {
  return (
    <span
      className={`${sizes[size]} select-none tracking-tight text-[var(--c-text)]`}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <span className="font-light">Cred</span>
      <span className="font-black">Flow</span>
    </span>
  )
}