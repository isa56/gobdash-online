import { useDroppable } from '@dnd-kit/react';
import type { CodeTokenType } from './CodeToken';

interface CodeTokenSlotProps {
  id: string;
  token: CodeTokenType | null;
  disabled?: boolean;
  onClear: () => void;
}

const tokenImages: Record<CodeTokenType, string> = {
  program: '/images/game_tokens/code_token.webp',
  error: '/images/game_tokens/error_token.webp',
};

export default function CodeTokenSlot({
  id,
  token,
  disabled = false,
  onClear,
}: CodeTokenSlotProps) {
  const { ref, isDropTarget } = useDroppable({ id, disabled });

  return (
    <div
      ref={ref}
      className={[
        'group absolute -top-4 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2',
        'items-center justify-center rounded-full border-2 border-dashed transition-all',
        disabled
          ? 'border-stone-600/50 bg-stone-900/40 opacity-50'
          : isDropTarget
            ? 'scale-110 border-amber-400 bg-amber-50/30 shadow-lg shadow-amber-400/40'
            : token
              ? 'border-none bg-none shadow-none'
              : 'border-stone-400/80 bg-stone-900/70 hover:border-amber-300',
      ].join(' ')}>
      {token ? (
        <>
          <img
            src={tokenImages[token]}
            alt={`${token} code token`}
            className='h-32 object-contain'
            draggable={false}
          />
          {!disabled && (
            <button
              type='button'
              onClick={onClear}
              aria-label='Remove code token'
              className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow hover:bg-red-600 cursor-pointer'>
              X
            </button>
          )}
        </>
      ) : (
        <span className='select-none text-xl leading-none text-stone-300 group-hover:text-amber-300'>
          +
        </span>
      )}
    </div>
  );
}
