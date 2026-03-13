const sizes = {
  sm: 'text-[14px]',
  md: 'text-[16px]',
  lg: 'text-[22px]',
  xl: 'text-[42px]',
}

export default function Logo({ size = 'md' }: { size?: keyof typeof sizes }) {
  return (
    <span
      className={`${sizes[size]} select-none tracking-[-0.5px]`}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <span className="font-light text-[var(--c-text)]">Cred</span>
      <span
        className="font-bold"
        style={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Flow
      </span>
    </span>
  )
}
