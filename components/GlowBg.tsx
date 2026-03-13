export default function GlowBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div
        className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-60"
        style={{ background: 'var(--c-glow-1)' }}
      />
      <div
        className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-50"
        style={{ background: 'var(--c-glow-2)' }}
      />
    </div>
  )
}
