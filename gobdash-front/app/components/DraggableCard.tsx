import { useDraggable } from '@dnd-kit/react';
import Card from './Card';
import type { Card as CardModel } from '~/types/game';

interface DraggableCardProps {
  card: CardModel;
}

export default function DraggableCard({ card }: DraggableCardProps) {
  const { ref, isDragging } = useDraggable({
    id: card.id,
    data: { card },
  });

  return (
    <Card
      ref={ref}
      card={card}
      style={{ touchAction: 'none' }}
      className={`cursor-grab active:cursor-grabbing transition-opacity duration-100 ${isDragging ? 'opacity-30' : 'opacity-100'}`}
    />
  );
}
