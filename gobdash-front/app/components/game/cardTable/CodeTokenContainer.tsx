import CodeToken from './CodeToken';
import type { CodeTokenType } from './CodeToken';

interface CodeTokenContainerProps {
  placedTokens: Record<CodeTokenType, boolean>;
  className?: string;
}

function CodeTokenContainer({
  placedTokens,
  className = '',
}: CodeTokenContainerProps) {
  const allPlaced = placedTokens.program && placedTokens.error;

  return (
    <div
      className={`flex items-center justify-center gap-3 min-h-[128px] ${className}`}>
      {!placedTokens.program && <CodeToken type='program' id='program1' />}

      {!placedTokens.error && <CodeToken type='error' id='error1' />}

      {allPlaced && (
        <span className='text-xs text-stone-500 italic px-2 text-center select-none'>
          Tokens placed
        </span>
      )}
    </div>
  );
}

export default CodeTokenContainer;
