import { useState } from 'react';
import ToastComponent from './utils/ToastComponent';

interface RoomInfoProps {
  roomNumber: number;
  numberOfPlayers: number;
}

function RoomInfo({ roomNumber, numberOfPlayers }: RoomInfoProps) {
  const [showToast, setShowToast] = useState(false);

  function onCopy() {
    navigator.clipboard.writeText(roomNumber.toString());
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center gap-2 bg-espresso/75 p-4 rounded-sm'>
        <h1
          className='text-2xl font-bold font-emphasis text-sand-dune cursor-pointer'
          onClick={onCopy}>
          Room: <span className='text-fern-light'>{roomNumber}</span>
        </h1>
        <p className='text-sm text-white'>
          Number of Players: {numberOfPlayers}
        </p>
      </div>

      <div className='fixed bottom-4 right-4 z-50'>
        <ToastComponent
          text='Room number copied!'
          type='success'
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    </>
  );
}

export default RoomInfo;
