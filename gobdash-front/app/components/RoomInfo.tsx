interface RoomInfoProps {
  roomNumber: number;
  numberOfPlayers: number;
}

function RoomInfo({ roomNumber, numberOfPlayers }: RoomInfoProps) {

  function onCopy() {
    navigator.clipboard.writeText(roomNumber.toString());
    // show a toast notification that the room number has been copied
    
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center gap-2 bg-espresso/75 p-4 rounded-sm'>
        <h1 className='text-2xl font-bold font-emphasis text-sand-dune'>Room: <span className='text-fern' onClick={onCopy}>{roomNumber}</span></h1>
        <p className='text-sm text-gray-200'>
          Number of Players: {numberOfPlayers}
        </p>
      </div>
    </>
  );
}

export default RoomInfo;
