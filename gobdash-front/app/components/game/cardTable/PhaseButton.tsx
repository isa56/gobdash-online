import type { BoughtSelection, TurnPhase } from '~/store/gameStore';
import FloatingButton from '~/components/ui/FloatingButton';
import { useLanguage } from '~/lib/i18n';

interface PhaseButtonProps {
  turnPhase: TurnPhase;
  hasStaged: boolean;
  bought: BoughtSelection;
  handleConfirmUse: () => void;
  handleConfirmBuy: () => void;
}

function PhaseButton({
  turnPhase,
  hasStaged,
  bought,
  handleConfirmUse,
  handleConfirmBuy,
}: PhaseButtonProps) {
  const { t } = useLanguage();
  return (
    <>
      {turnPhase === 'use' ? (
        <FloatingButton
          icon='→'
          label={t('confirmUse')}
          ariaLabel={t('confirmUseAria')}
          disabled={!hasStaged}
          onClick={handleConfirmUse}
          position='bottom-right'
          className='bg-amber-500 hover:bg-amber-600 border-amber-300 shadow-amber-900/30'
        />
      ) : (
        <FloatingButton
          icon='✓'
          label={t('confirmBuy')}
          ariaLabel={t('confirmBuyAria')}
          disabled={bought === null}
          onClick={handleConfirmBuy}
          position='bottom-right'
          className='bg-sky-500 hover:bg-sky-600 border-sky-300 shadow-sky-900/30'
        />
      )}
    </>
  );
}

export default PhaseButton;
