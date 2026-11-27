import { useLanguage } from '~/lib/i18n';

interface CardDeckProps {
  deckCount: number;
  turnPhase: 'use' | 'buy';
  isSelected: boolean;
  onSelect: () => void;
}

export default function CardDeck({
  deckCount,
  turnPhase,
  isSelected,
  onSelect,
}: CardDeckProps) {
  const { t } = useLanguage();
  const isEmpty = deckCount === 0;
  const disabled = turnPhase === 'use' || isEmpty;

  return (
    <div className='flex flex-col items-center gap-2'>
      <p className='text-sm font-semibold uppercase tracking-widest text-stone-400'>
        {t('buyDeck')}
      </p>

      <button
        type='button'
        onClick={disabled ? undefined : onSelect}
        disabled={disabled}
        aria-label={t('buyDeckAria', { count: deckCount })}
        className={[
          'relative flex w-26 min-h-38 items-center justify-center rounded-xl',
          'border-2 transition-all duration-150 select-none',
          disabled
            ? 'border-stone-700 opacity-40 cursor-not-allowed'
            : isSelected
              ? 'border-amber-400 shadow-lg shadow-amber-400/30 scale-105 cursor-pointer'
              : 'border-stone-500 hover:border-amber-300 hover:scale-105 cursor-pointer',
        ].join(' ')}>
        {/* Stack shadow layers for depth */}
        <div className='absolute inset-0 rounded-xl bg-stone-600 translate-x-2 translate-y-2 -z-10' />
        <div className='absolute inset-0 rounded-xl bg-stone-500 translate-x-1 translate-y-1 -z-10' />

        {/* Face of the top card */}
        <div
          className={[
            'absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-2',
            isSelected ? 'bg-amber-900/30' : 'bg-stone-800',
          ].join(' ')}>
          {isEmpty ? (
            <span className='text-stone-500 text-sm font-semibold'>{t('empty')}</span>
          ) : (
            <>
              <span className='text-5xl font-bold text-stone-200'>{deckCount}</span>
              <span className='text-xs text-stone-400 uppercase tracking-wider'>
                {isSelected ? t('clickAgainToCancel') : t('clickToSelect')}
              </span>
            </>
          )}
        </div>
      </button>

      {deckCount > 0 && (
        <span className='text-xs text-stone-400'>
          {deckCount === 1
            ? t('oneCardLeft')
            : t('cardsLeft', { count: deckCount })}
        </span>
      )}
    </div>
  );
}
