import CodeToken from './CodeToken';
import type { CodeTokenType } from './CodeToken';

interface CodeTokenContainerProps {
  placedTokens: Record<CodeTokenType, boolean>;
}

function CodeTokenContainer({ placedTokens }: CodeTokenContainerProps) {
  return (
    <div className='flex items-center justify-center gap-2'>
      {!placedTokens.program && <CodeToken type='program' id='program1' />}

      {!placedTokens.error && <CodeToken type='error' id='error1' />}
    </div>
  );
}

export default CodeTokenContainer;
