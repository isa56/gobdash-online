import { useDraggable } from '@dnd-kit/react';
import { publicAssetPath } from '~/lib/assets';
import { useLanguage } from '~/lib/i18n';

interface GobProps {
  draggable?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  selected?: boolean;
}

function GobToken({ draggable = true, className, onClick, selected = false }: GobProps) {
  const { t } = useLanguage();
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
      onClick={onClick}
      style={{ touchAction: draggable ? 'none' : undefined }}
      className={[
        'relative flex aspect-square w-full items-center justify-center rounded-full',
        'outline-2 outline-transparent transition-all duration-100',
        draggable
          ? 'cursor-grab active:cursor-grabbing hover:scale-105'
          : 'cursor-default',
        isDragging ? 'opacity-30' : 'opacity-100',
        selected ? 'ring-4 ring-amber-400 ring-offset-2 scale-105' : '',
        className ?? '',
      ].join(' ')}
      aria-label={t('gobToken')}
      aria-pressed={selected}
      disabled={!draggable && !onClick}>
      <img
        src={publicAssetPath('images/game_tokens/gob_contorno_pequeno.webp')}
        alt={t('gob')}
        className='pointer-events-none h-full w-full object-contain drop-shadow-xl'
        draggable={false}
      />
    </button>
  );
}

export default GobToken;
