export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-white/10 py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-600">
        <span>
          © {year} <span className="font-semibold text-gray-400 dark:text-gray-500">CredFlow</span>. Tous droits réservés.
        </span>
        <span className="flex items-center gap-3">
          <span>v0.1.0</span>
          <span className="opacity-40">·</span>
          <span>Fait avec ♥ par mindofhokage</span>
        </span>
      </div>
    </footer>
  )
}