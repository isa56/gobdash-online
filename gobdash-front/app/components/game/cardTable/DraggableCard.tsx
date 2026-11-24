import { useDraggable } from '@dnd-kit/react';
import Card from './Card';
import type { Card as CardModel } from '~/types/game';

interface DraggableCardProps {
  card: CardModel;
  disabled?: boolean;
}

export default function DraggableCard({ card, disabled = false }: DraggableCardProps) {
  const { ref, isDragging } = useDraggable({
    id: card.id,
    data: { card },
    disabled,
    type: 'card',
  });

  return (
    <Card
      ref={ref}
      card={card}
      style={{ touchAction: 'none' }}
      className={[
        'transition-opacity duration-100',
        disabled ? 'cursor-default opacity-60' : 'cursor-grab active:cursor-grabbing',
        isDragging ? 'opacity-30' : 'opacity-100',
      ].join(' ')}
    />
  );
}

