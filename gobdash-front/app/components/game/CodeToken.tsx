import { useDraggable } from '@dnd-kit/react';
import { publicAssetPath } from '~/lib/assets';

export type CodeTokenType = 'program' | 'error';

interface CodeTokenProps {
  type: CodeTokenType;
  id: string;
}

function CodeToken({ type, id }: CodeTokenProps) {
  const tokenImage =
    type === 'program'
      ? publicAssetPath('images/game_tokens/code_token.webp')
      : publicAssetPath('images/game_tokens/error_token.webp');
  const tokenAlt = type === 'program' ? 'Code Token' : 'Error Token';

  const { ref, isDragging } = useDraggable({
    id: id,
    data: { type },
    type: 'code-token',
  });

  return (
    <div className='shrink-0'>
      <img
        src={tokenImage}
        alt={tokenAlt}
        style={{ touchAction: 'none' }}
        className={[
          'h-32 text-shadow-md cursor-grab active:cursor-grabbing transition-opacity duration-100',
          isDragging ? 'opacity-30' : 'opacity-100',
        ].join(' ')}
        ref={ref}
      />
    </div>
  );
}

export default CodeToken;
