import { useState } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { useDroppable } from '@dnd-kit/react';
import GobToken from './board/GobToken';
import FoodToken from './board/FoodToken';
import FoodModal from './board/FoodModal';
import { publicAssetPath } from '~/lib/assets';
import type { BoardSpace, PantryFood } from '~/types/game';
import { useGameStore } from '~/store/gameStore';

const BOARD_SPACES = {
  pantry: 'Pantry',
  stove: 'Stove',
  countertop: 'Countertop',
  salon: 'Salon',
  delivery: 'Delivery',
  leftHand: 'Left Hand',
  rightHand: 'Right Hand',
} as const;

type BoardSpaceName = keyof typeof BOARD_SPACES;

const boardSpacePositions: Record<BoardSpaceName, { left: string; top: string }> = {
  pantry: { left: '23%', top: '60%' },
  stove: { left: '50%', top: '43%' },
  countertop: { left: '82%', top: '60%' },
  salon: { left: '50%', top: '65%' },
  delivery: { left: '50%', top: '88%' },
  leftHand: { left: '15%', top: '10%' },
  rightHand: { left: '85%', top: '10%' },
};

type BoardSelection =
  | { kind: 'gob' }
  | { kind: 'food'; foodId: number }
  | null;

interface BoardDropZoneProps {
  id: BoardSpaceName;
  gobPosition: boolean;
  foodTokens: PantryFood[];
  selection: BoardSelection;
  onSelectGob: () => void;
  onSelectFood: (foodId: number) => void;
  onMoveSelection: (space: BoardSpaceName) => void;
  onAddFood: () => void;
  onPrepareFood: (foodId: number) => void;
}

function BoardDropZone({
  id,
  gobPosition,
  foodTokens,
  selection,
  onSelectGob,
  onSelectFood,
  onMoveSelection,
  onAddFood,
  onPrepareFood,
}: BoardDropZoneProps) {
  const isHand = id === 'leftHand' || id === 'rightHand';
  const { ref, isDropTarget } = useDroppable({
    id: `board-space-${id}`,
    accept: isHand ? ['food'] : ['gob', 'food'],
  });

  const position = boardSpacePositions[id];

  const selectOrMove = () => {
    if (selection) {
      onMoveSelection(id);
    }
  };

  return (
    <div
      ref={ref}
      role={selection ? 'button' : 'group'}
      tabIndex={selection ? 0 : undefined}
      aria-label={selection
        ? `Move selected object to ${BOARD_SPACES[id]}`
        : BOARD_SPACES[id]}
      onClick={selectOrMove}
      onKeyDown={(event) => {
        if (selection && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onMoveSelection(id);
        }
      }}
      className={[
        'absolute z-10 flex aspect-square w-[20%] -translate-x-1/2 -translate-y-1/2',
        'items-center justify-center rounded-full border-3 border-dashed shadow-lg transition-all',
        isHand
          ? 'border-stone-500/60 bg-stone-950/40'
          : 'border-stone-100 bg-stone-950/20',
      ].join(' ')}
      style={{ left: position.left, top: position.top }}>
      {gobPosition ? (
        <GobToken
          onClick={(event) => {
            event.stopPropagation();
            onSelectGob();
          }}
          selected={selection?.kind === 'gob'}
        />
      ) : null}
      {foodTokens.map((token) => (
        <FoodToken
          key={token.id}
          food={{ ...token.food, image: publicAssetPath(token.food.image) }}
          draggable
          dragId={`food-token-${token.id}`}
          selected={selection?.kind === 'food' && selection.foodId === token.id}
          onClick={(event) => {
            event.stopPropagation();
            onSelectFood(token.id);
          }}
          onDoubleClick={() => onPrepareFood(token.id)}
          className='absolute h-[82%] w-[82%] border border-amber-100/70'
        />
      ))}
      {id === 'pantry' ? (
        <button
          type='button'
          onClick={(event) => {
            event.stopPropagation();
            onAddFood();
          }}
          aria-label='Choose a food token for the pantry'
          className='absolute left-[-72%] flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-200 bg-fern text-xl font-bold text-white shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300'>
          +
        </button>
      ) : null}
      <span className='pointer-events-none absolute -bottom-5 whitespace-nowrap rounded-md bg-stone-950/80 px-2 py-0.5 text-2xs font-semibold uppercase tracking-wide text-amber-100'>
        {BOARD_SPACES[id]}
      </span>
      {isDropTarget && !gobPosition ? (
        <div className='absolute -inset-1 scale-110 rounded-full border-2 border-solid border-amber-200 bg-amber-300/20' />
      ) : null}
    </div>
  );
}

function Board() {
  const gobSpace = useGameStore((state) => state.gobSpace);
  const foodPositions = useGameStore((state) => state.foodPositions);
  const foodTokens = useGameStore((state) => state.foodTokens);
  const moveGob = useGameStore((state) => state.moveGob);
  const moveFood = useGameStore((state) => state.moveFood);
  const prepareFood = useGameStore((state) => state.prepareFood);
  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [draggedFood, setDraggedFood] = useState<PantryFood | null>(null);
  const [selection, setSelection] = useState<BoardSelection>(null);

  return (
      <DragDropProvider
        onDragStart={(event) => {
          const dragId = event.operation.source?.id as string | undefined;
          if (dragId?.startsWith('food-token-')) {
            const id = Number(dragId.replace('food-token-', ''));
            setDraggedFood(foodTokens.find((token) => token.id === id) ?? null);
          }
        }}
        onDragEnd={(event) => {
          setSelection(null);
          setDraggedFood(null);
          if (event.canceled) return;

          const targetId = event.operation.target?.id as string | undefined;
          const sourceId = event.operation.source?.id as string | undefined;
          if (!targetId?.startsWith('board-space-')) return;

          const space = targetId.replace('board-space-', '') as BoardSpace;
          if (!(space in BOARD_SPACES)) return;

          if (sourceId === 'gob-token') {
            if (space !== 'leftHand' && space !== 'rightHand')
              moveGob(space);
            return;
          }

          if (sourceId?.startsWith('food-token-')) {
            const id = Number(sourceId.replace('food-token-', ''));
            moveFood(id, space);
          }
        }}>
        <div
          className='relative h-full w-full overflow-hidden bg-contain bg-center bg-no-repeat'
          style={{
            backgroundImage: `url("${publicAssetPath('images/board/board.webp')}")`,
          }}>
          <p className='sr-only' aria-live='polite'>
            {selection
              ? 'Object selected. Choose a destination area.'
              : 'No object selected.'}
          </p>
          {(Object.keys(BOARD_SPACES) as BoardSpaceName[]).map((space) => (
            <BoardDropZone
              key={space}
              id={space}
              gobPosition={gobSpace === space}
              foodTokens={foodTokens.filter(
                (token) => foodPositions[token.id] === space,
              )}
              selection={selection}
              onSelectGob={() =>
                setSelection((current) =>
                  current?.kind === 'gob' ? null : { kind: 'gob' },
                )
              }
              onSelectFood={(foodId) =>
                setSelection((current) =>
                  current?.kind === 'food' && current.foodId === foodId
                    ? null
                    : { kind: 'food', foodId },
                )
              }
              onMoveSelection={(targetSpace) => {
                if (targetSpace === 'leftHand' || targetSpace === 'rightHand') {
                  setSelection(null);
                  return;
                }
                if (selection?.kind === 'gob') {
                  moveGob(targetSpace);
                } else if (selection?.kind === 'food') {
                  moveFood(selection.foodId, targetSpace);
                }
                setSelection(null);
              }}
              onAddFood={() => setFoodModalOpen(true)}
              onPrepareFood={prepareFood}
            />
          ))}

          <FoodModal
            open={foodModalOpen}
            onClose={() => setFoodModalOpen(false)}
          />

          <DragOverlay>
            {draggedFood ? (
              <div className='h-12 w-12 rotate-3 drop-shadow-2xl'>
                <img
                  src={publicAssetPath(draggedFood.food.image)}
                  alt={draggedFood.food.name}
                  className='h-full w-full rounded-full border border-amber-100 object-cover'
                />
              </div>
            ) : gobSpace ? (
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
