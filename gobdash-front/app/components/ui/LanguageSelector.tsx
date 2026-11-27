import { useLanguage } from '~/lib/i18n';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label className='flex items-center gap-2 text-sm text-stone-200'>
      <span>{t('language')}</span>
      <select
        value={language}
        onChange={(event) =>
          setLanguage(event.target.value === 'pt-BR' ? 'pt-BR' : 'en')
        }
        aria-label={t('language')}
        className='rounded-md border border-stone-600 bg-stone-800 px-2 py-1 text-white'>
        <option value='en'>English</option>
        <option value='pt-BR'>Português</option>
      </select>
    </label>
  );
}
