export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const textClass = size === 'sm' ? 'text-[14px]' : 'text-[16px]'

  return (
    <span
      className={`${textClass} select-none tracking-[-0.5px]`}
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
