function MiniBoard() {
  const onClick = () => {
    // Implement the logic to open the board modal
    alert('Board modal opened!'); // Placeholder for actual modal logic
  };

  return (
    <>
      <img
        className='cursor-pointer border-none hover:scale-105 transition-transform border-amber-400 border-2 duration-200 '
        src='/images/board/mini_board.webp'
        alt='Game Board'
        onClick={onClick}
      />
    </>
  );
}

export default MiniBoard;
