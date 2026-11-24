import CodeToken from './CodeToken';
import type { CodeTokenType } from './CodeToken';

interface CodeTokenContainerProps {
  placedTokens: Record<CodeTokenType, boolean>;
  className?: string;
  selectedToken?: CodeTokenType;
  onSelectToken?: (token: CodeTokenType) => void;
}

function CodeTokenContainer({
  placedTokens,
  className = '',
  selectedToken,
  onSelectToken,
}: CodeTokenContainerProps) {
  const allPlaced = placedTokens.program && placedTokens.error;

  return (
    <div
      className={`flex items-center justify-center gap-3 min-h-[128px] ${className}`}>
      {!placedTokens.program && (
        <CodeToken
          type='program'
          id='program1'
          selected={selectedToken === 'program'}
          onSelect={() => onSelectToken?.('program')}
        />
      )}

      {!placedTokens.error && (
        <CodeToken
          type='error'
          id='error1'
          selected={selectedToken === 'error'}
          onSelect={() => onSelectToken?.('error')}
        />
      )}

      {allPlaced && (
        <span className='text-xs text-stone-500 italic px-2 text-center select-none'>
          Tokens placed
        </span>
      )}
    </div>
  );
}

export default CodeTokenContainer;
