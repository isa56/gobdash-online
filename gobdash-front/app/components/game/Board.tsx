import { useState } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { useDroppable } from '@dnd-kit/react';
import GobToken from './board/GobToken';
import FoodToken from './board/FoodToken';
import { publicAssetPath } from '~/lib/assets';
import { ingredients } from '~/types/constants';
import type { Ingredient } from '~/types/game';

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
type PantryFood = { id: number; food: Ingredient };

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
  foodTokens: PantryFood[];
  onAddFood: () => void;
}

function BoardDropZone({ id, occupied, gobPosition, foodTokens, onAddFood }: BoardDropZoneProps) {
  const isHand = id === 'leftHand' || id === 'rightHand';
  const { ref, isDropTarget } = useDroppable({
    id: `board-space-${id}`,
    accept: ['gob', 'food'],
  });

  const position = boardSpacePositions[id];

  return (
    <div
      ref={ref}
      role='group'
      aria-label={BOARD_SPACES[id]}
      className={[
        'absolute z-10 flex h-[14%] w-[14%] -translate-x-1/2 -translate-y-1/2',
        'items-center justify-center rounded-full border-3 border-dashed shadow-lg transition-all',
        isHand
          ? 'border-stone-500/60 bg-stone-950/40'
          : 'border-stone-100 bg-stone-950/20',
      ].join(' ')}
      style={{ left: position.left, top: position.top }}>
      {gobPosition ? <GobToken /> : null}
      {foodTokens.map((token) => (
        <FoodToken
          key={token.id}
          food={{ ...token.food, image: publicAssetPath(token.food.image) }}
          draggable
          dragId={`food-token-${token.id}`}
          className='absolute h-[82%] w-[82%] rounded-full border border-amber-100/70'
        />
      ))}
      {id === 'pantry' ? (
        <button
          type='button'
          onClick={onAddFood}
          aria-label='Choose a food token for the pantry'
          className='absolute -left-[72%] flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-200 bg-fern text-xl font-bold text-white shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300'
        >
          +
        </button>
      ) : null}
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
  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [foodPositions, setFoodPositions] = useState<Record<number, BoardSpace>>({});
  const [foodTokens, setFoodTokens] = useState<PantryFood[]>([]);
  const [draggedFood, setDraggedFood] = useState<PantryFood | null>(null);

  const addFoodToPantry = (food: Ingredient) => {
    const id = Date.now();
    setFoodTokens((current) => [...current, { id, food }]);
    setFoodPositions((current) => ({ ...current, [id]: 'pantry' }));
    setFoodModalOpen(false);
  };

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
        setDraggedFood(null);
        if (event.canceled) return;

        const targetId = event.operation.target?.id as string | undefined;
        const sourceId = event.operation.source?.id as string | undefined;
        if (!targetId?.startsWith('board-space-')) return;

        const space = targetId.replace('board-space-', '') as BoardSpace;
        if (!(space in BOARD_SPACES)) return;

        if (sourceId === 'gob-token') {
          if (space !== 'leftHand' && space !== 'rightHand') setGobSpace(space);
          return;
        }

        if (sourceId?.startsWith('food-token-')) {
          const id = Number(sourceId.replace('food-token-', ''));
          setFoodPositions((current) => ({ ...current, [id]: space }));
        }
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
            foodTokens={foodTokens.filter((token) => foodPositions[token.id] === space)}
            onAddFood={() => setFoodModalOpen(true)}
          />
        ))}

        {foodModalOpen ? (
          <div
            className='absolute inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-sm'
            role='dialog'
            aria-modal='true'
            aria-label='Choose a food token'
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setFoodModalOpen(false);
            }}>
            <div className='flex max-h-[80%] w-[88%] flex-col rounded-2xl border border-amber-200/40 bg-stone-900 p-4 shadow-2xl'>
              <div className='mb-3 flex items-center justify-between'>
                <h2 className='font-bold text-amber-100'>Choose an ingredient</h2>
                <button
                  type='button'
                  onClick={() => setFoodModalOpen(false)}
                  aria-label='Close food token chooser'
                  className='rounded-full px-3 py-1 text-xl text-amber-100 hover:bg-stone-700'
                >
                  ×
                </button>
              </div>
              <div className='grid grid-cols-4 gap-3 overflow-y-auto pr-1'>
                {ingredients.map((food) => (
                  <button
                    key={food.name}
                    type='button'
                    onClick={() => addFoodToPantry(food)}
                    className='aspect-square overflow-hidden rounded-lg border-2 border-transparent bg-stone-800 transition hover:border-amber-300 hover:scale-105'
                    aria-label={`Add ${food.name} to pantry`}
                  >
                    <img
                      src={publicAssetPath(food.image)}
                      alt={food.name}
                      className='h-full w-full object-cover'
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

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
