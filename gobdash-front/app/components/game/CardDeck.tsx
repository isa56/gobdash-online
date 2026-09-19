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
  const isEmpty = deckCount === 0;
  const disabled = turnPhase === 'use' || isEmpty;

  return (
    <div className='flex flex-col items-center gap-2'>
      <p className='text-sm font-semibold uppercase tracking-widest text-stone-400'>
        Buy Deck
      </p>

      <button
        type='button'
        onClick={disabled ? undefined : onSelect}
        disabled={disabled}
        aria-label={`Buy deck, ${deckCount} cards remaining`}
        className={[
          'relative flex w-38 min-h-56 items-center justify-center rounded-xl',
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
            <span className='text-stone-500 text-sm font-semibold'>Empty</span>
          ) : (
            <>
              <span className='text-5xl font-bold text-stone-200'>{deckCount}</span>
              <span className='text-xs text-stone-400 uppercase tracking-wider'>
                {isSelected ? 'Click again to cancel' : 'Click to select'}
              </span>
            </>
          )}
        </div>
      </button>

      {deckCount > 0 && (
        <span className='text-xs text-stone-400'>
          {deckCount} card{deckCount !== 1 ? 's' : ''} left
        </span>
      )}
    </div>
  );
}

