import { useDraggable } from '@dnd-kit/react';
import { publicAssetPath } from '~/lib/assets';

interface GobProps {
  draggable?: boolean;
  className?: string;
}

function GobToken({ draggable = true, className }: GobProps) {
  const { ref, isDragging } = useDraggable({
    id: 'gob-token',
    type: 'gob',
    data: { gob: true },
    disabled: !draggable,
  });

  return (
    <button
      ref={draggable ? ref : undefined}
      type='button'
      style={{ touchAction: draggable ? 'none' : undefined }}
      className={[
        'relative flex aspect-square w-full items-center justify-center rounded-full',
        'outline-2 outline-transparent transition-all duration-100',
        draggable
          ? 'cursor-grab active:cursor-grabbing hover:scale-105'
          : 'cursor-default',
        isDragging ? 'opacity-30' : 'opacity-100',
        className ?? '',
      ].join(' ')}
      aria-label='Gob token'
      disabled={!draggable}>
      <img
        src={publicAssetPath('images/game_tokens/gob_contorno_pequeno.webp')}
        alt='Gob'
        className='pointer-events-none h-full w-full object-contain drop-shadow-xl'
        draggable={false}
      />
    </button>
  );
}

export default GobToken;
