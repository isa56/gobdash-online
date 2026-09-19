import { useState } from 'react';
import ToastComponent from '../ui/ToastComponent';
import { BsArrowLeft, BsFillPersonFill } from 'react-icons/bs';
import { NavLink } from 'react-router';

interface RoomInfoProps {
  roomId: string | number;
  numberOfPlayers: number;
  turnNumber: number;
}

export default function RoomInfo({
  roomId,
  numberOfPlayers,
  turnNumber,
}: RoomInfoProps) {
  const [showToast, setShowToast] = useState(false);

  function onCopy() {
    navigator.clipboard.writeText(roomId.toString());
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  function renderPlayerIcons() {
    const icons = [];
    for (let index = 0; index < numberOfPlayers; index++) {
      icons.push(<BsFillPersonFill size="2em" key={index} />);
    }
    return icons;
  }

  return (
    <div className='flex items-center justify-between w-full h-full'>
      <NavLink
        to='/'
        className='flex text-white ml-4 items-center justify-center gap-2 bg-espresso/75 p-4 rounded-4xl cursor-pointer hover:bg-espresso-dark'>
        <BsArrowLeft />
      </NavLink>

      <div className='flex text-sunlit-clay'>{renderPlayerIcons()}</div>

      <div className='flex flex-col items-center justify-center gap-2 bg-espresso/75 p-4 rounded-sm'>
        <h1
          className='text-2xl font-bold font-emphasis text-sand-dune cursor-pointer'
          onClick={onCopy}>
          Room: <span className='text-fern-light'>{roomId}</span>
        </h1>
        <p className='text-sm text-white'>
          Player {(turnNumber % numberOfPlayers)}'s turn
        </p>
        <p className='text-sm text-white'>Turn number: {turnNumber}</p>
      </div>

      <div className='fixed bottom-4 right-4 z-50'>
        <ToastComponent
          text='Room number copied!'
          type='success'
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
}

