import { useState } from 'react';
import ToastComponent from '~/components/ui/ToastComponent';
import { BsArrowLeft, BsFillPersonFill } from 'react-icons/bs';
import { NavLink } from 'react-router';
import LanguageSelector from '~/components/ui/LanguageSelector';
import { useLanguage } from '~/lib/i18n';

interface RoomInfoProps {
  roomId: string | number;
  numberOfPlayers: number;
  turnNumber: number;
  turnPhase: 'use' | 'buy';
}

export default function RoomInfo({
  roomId,
  numberOfPlayers,
  turnNumber,
  turnPhase,
}: RoomInfoProps) {
  const { t } = useLanguage();
  const [showToast, setShowToast] = useState(false);

  function onCopy() {
    navigator.clipboard.writeText(roomId.toString());
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  function renderPlayerIcons() {
    const icons = [];
    for (let index = 0; index < numberOfPlayers; index++) {
      icons.push(<BsFillPersonFill size='2em' key={index} />);
    }
    return icons;
  }

  return (
    <div className='flex items-center justify-between w-full h-full'>
      <div className='ml-3'>
        <LanguageSelector />
      </div>
      <NavLink
        to='/'
        className='flex text-white ml-4 items-center justify-center gap-2 bg-espresso/75 p-4 rounded-4xl cursor-pointer hover:bg-espresso-dark'>
        <BsArrowLeft />
      </NavLink>

      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='flex text-sunlit-clay'>{renderPlayerIcons()}</div>
        <div>
          {/* Turn phase indicator */}
          <div className='flex w-full items-center gap-3 text-sm'>
            <span
              className={
                turnPhase === 'use'
                  ? 'text-amber-400 font-bold'
                  : 'text-stone-500'
              }>
              {t('useCard')}
            </span>
            <span className='text-stone-600'>→</span>
            <span
              className={
                turnPhase === 'buy'
                  ? 'text-amber-400 font-bold'
                  : 'text-stone-500'
              }>
              {t('buyCard')}
            </span>
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center justify-center gap-2 bg-espresso/75 p-4 rounded-sm'>
        <h1
          className='text-2xl font-bold font-emphasis text-sand-dune cursor-pointer'
          onClick={onCopy}>
          {t('room')}: <span className='text-fern-light'>{roomId}</span>
        </h1>
        <p className='text-sm text-white'>
          {t('playerTurn', { player: turnNumber % numberOfPlayers })}
        </p>
        <p className='text-sm text-white'>{t('turnNumber', { number: turnNumber })}</p>
      </div>

      <div className='fixed bottom-4 right-4 z-50'>
        <ToastComponent
          text={t('roomCopied')}
          type='success'
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
}
