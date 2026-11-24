import { useDraggable, useDroppable } from '@dnd-kit/react';
import { publicAssetPath } from '~/lib/assets';
import type { CodeTokenType } from './CodeToken';

interface CodeTokenSlotProps {
  id: string;
  token: CodeTokenType | null;
  disabled?: boolean;
  onClear: () => void;
  selectedToken?: CodeTokenType;
  onSelectToken?: (token: CodeTokenType) => void;
  onMoveToken?: (targetId: string) => void;
}

const tokenImages: Record<CodeTokenType, string> = {
  program: publicAssetPath('images/game_tokens/code_token.webp'),
  error: publicAssetPath('images/game_tokens/error_token.webp'),
};

export default function CodeTokenSlot({
  id,
  token,
  disabled = false,
  onClear,
  selectedToken,
  onSelectToken,
  onMoveToken,
}: CodeTokenSlotProps) {
  const { ref: dropRef, isDropTarget } = useDroppable({
    id,
    disabled,
    accept: 'code-token',
  });
  const { ref: dragRef, isDragging } = useDraggable({
    id: token ? `${token}1` : `${id}-empty`,
    data: token ? { type: token } : undefined,
    type: 'code-token',
    disabled: disabled || !token,
  });

  return (
    <div
      ref={dropRef}
      role={selectedToken ? 'button' : 'group'}
      tabIndex={selectedToken ? 0 : undefined}
      aria-label={selectedToken ? `Place selected token in ${id}` : `${id} code token slot`}
      onClick={() => {
        if (selectedToken && onMoveToken) onMoveToken(id);
      }}
      onKeyDown={(event) => {
        if (selectedToken && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onMoveToken?.(id);
        }
      }}
      className={[
        'group absolute -top-4 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2',
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
          <button
            type='button'
            ref={dragRef}
            onClick={(event) => {
              event.stopPropagation();
              onSelectToken?.(token);
            }}
            aria-label={`Select ${token} code token`}
            aria-pressed={selectedToken === token}
            className={selectedToken === token
              ? 'rounded-full ring-4 ring-amber-400 scale-105'
              : 'rounded-full'}>
            <img
              src={tokenImages[token]}
              alt={`${token} code token`}
              className={[
                'h-32 object-contain cursor-grab active:cursor-grabbing transition-opacity duration-100',
                isDragging ? 'opacity-30' : 'opacity-100',
              ].join(' ')}
              draggable={false}
            />
          </button>
          {!disabled && (
            <button
              type='button'
              onClick={(event) => {
                event.stopPropagation();
                onClear();
              }}
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
