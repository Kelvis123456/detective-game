import { useLanguage } from '../../i18n/LanguageContext'

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, toggleLocale } = useLanguage()

  return (
    <button
      onClick={toggleLocale}
      title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      lang={locale === 'es' ? 'en' : 'es'}
      className={`relative after:absolute after:-inset-2 after:content-[''] flex h-7 w-7 flex-shrink-0 items-center justify-center rounded text-[10px] font-bold uppercase text-zinc-400 hover:text-amber-400 transition-colors ${className}`}
    >
      {locale === 'es' ? 'EN' : 'ES'}
    </button>
  )
}
