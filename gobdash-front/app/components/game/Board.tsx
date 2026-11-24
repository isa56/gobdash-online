import { useState } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { useDroppable } from '@dnd-kit/react';
import GobToken from './board/GobToken';
import { publicAssetPath } from '~/lib/assets';

const BOARD_SPACES = {
  pantry: 'Pantry',
  stove: 'Stove',
  countertop: 'Countertop',
  salon: 'Salon',
  delivery: 'Delivery',
  leftHand: 'Left Hand',
  rightHand: 'Right Hand',
} as const;

type BoardSpace = keyof typeof BOARD_SPACES;

const boardSpacePositions: Record<BoardSpace, { left: string; top: string }> = {
  pantry: { left: '23%', top: '60%' },
  stove: { left: '50%', top: '43%' },
  countertop: { left: '82%', top: '60%' },
  salon: { left: '50%', top: '65%' },
  delivery: { left: '50%', top: '88%' },
  leftHand: { left: '15%', top: '8%' },
  rightHand: { left: '85%', top: '8%' },
};

interface BoardDropZoneProps {
  id: BoardSpace;
  occupied: boolean;
  gobPosition: boolean;
}

function BoardDropZone({ id, occupied, gobPosition }: BoardDropZoneProps) {
  const isGobBlocked = id === 'leftHand' || id === 'rightHand';
  const { ref, isDropTarget } = useDroppable({
    id: `board-space-${id}`,
    accept: 'gob',
    disabled: isGobBlocked,
  });

  const position = boardSpacePositions[id];

  return (
    <div
      ref={ref}
      role='group'
      aria-label={BOARD_SPACES[id]}
      aria-disabled={isGobBlocked}
      className={[
        'absolute z-10 flex h-[14%] w-[14%] -translate-x-1/2 -translate-y-1/2',
        'items-center justify-center rounded-full border-3 border-dashed shadow-lg transition-all',
        isGobBlocked
          ? 'cursor-not-allowed border-stone-500/60 bg-stone-950/40 opacity-60'
          : 'border-stone-100 bg-stone-950/20',
      ].join(' ')}
      style={{ left: position.left, top: position.top }}>
      {gobPosition ? <GobToken /> : null}
      <span className='pointer-events-none absolute -bottom-5 whitespace-nowrap rounded-md bg-stone-950/80 px-2 py-0.5 text-2xs font-semibold uppercase tracking-wide text-amber-100'>
        {BOARD_SPACES[id]}
      </span>
      {isDropTarget && !occupied ? (
        <div className='absolute -inset-1 scale-110 rounded-full border-2 border-solid border-amber-200 bg-amber-300/20' />
      ) : null}
    </div>
  );
}

function Board() {
  const [gobSpace, setGobSpace] = useState<BoardSpace>('salon');

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const targetId = event.operation.target?.id as string | undefined;
        if (!targetId?.startsWith('board-space-')) return;

        const space = targetId.replace('board-space-', '') as BoardSpace;
        if (space === 'leftHand' || space === 'rightHand') return;
        if (space in BOARD_SPACES) setGobSpace(space);
      }}>
      <div
        className='relative h-full w-full overflow-hidden bg-cover bg-center'
        style={{
          backgroundImage: `url("${publicAssetPath('images/board/board.webp')}")`,
        }}>
        {(Object.keys(BOARD_SPACES) as BoardSpace[]).map((space) => (
          <BoardDropZone
            key={space}
            id={space}
            occupied={gobSpace === space}
            gobPosition={gobSpace === space}
          />
        ))}

        <DragOverlay>
          {gobSpace ? (
            <div className='h-12 w-12 rotate-3 drop-shadow-2xl'>
              <GobToken draggable={false} />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DragDropProvider>
  );
}

export default Board;
