import { useDraggable } from '@dnd-kit/react';
import { publicAssetPath } from '~/lib/assets';
import { useLanguage } from '~/lib/i18n';

export type CodeTokenType = 'program' | 'error';

interface CodeTokenProps {
  type: CodeTokenType;
  id: string;
  selected?: boolean;
  onSelect?: () => void;
}

function CodeToken({ type, id, selected = false, onSelect }: CodeTokenProps) {
  const { t } = useLanguage();
  const tokenImage =
    type === 'program'
      ? publicAssetPath('images/game_tokens/code_token.webp')
      : publicAssetPath('images/game_tokens/error_token.webp');
  const tokenAlt = type === 'program' ? t('codeToken') : t('errorToken');

  const { ref, isDragging } = useDraggable({
    id: id,
    data: { type },
    type: 'code-token',
  });

  return (
    <button
      type='button'
      ref={ref}
      onClick={onSelect}
      aria-label={t('selectToken', { token: tokenAlt })}
      aria-pressed={selected}
      className={[
        'shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300',
        selected ? 'ring-4 ring-amber-400 scale-105' : '',
      ].join(' ')}>
      <img
        src={tokenImage}
        alt={tokenAlt}
        style={{ touchAction: 'none' }}
        className={[
          'h-22 text-shadow-md cursor-grab active:cursor-grabbing transition-opacity duration-100',
          isDragging ? 'opacity-30' : 'opacity-100',
        ].join(' ')}
        draggable={false}
      />
    </button>
  );
}

export default CodeToken;
