type FloatingButtonProps = {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
};

function FloatingButton({
  icon = '+',
  label,
  onClick,
  className = '',
  disabled = false,
  ariaLabel,
  position = 'bottom-right',
}: FloatingButtonProps) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || label || 'Floating action button'}
      className={[
        'fixed z-50 flex items-center justify-center gap-2 rounded-full border border-fern-light bg-fern px-4 py-3 text-white shadow-lg shadow-espresso/30 transition-all duration-200 hover:scale-[1.02] hover:bg-fern-dark focus:outline-none focus:ring-2 focus:ring-sunlit-clay focus:ring-offset-2 focus:ring-offset-espresso disabled:cursor-not-allowed disabled:opacity-50',
        positionClasses[position],
        className,
      ]
        .filter(Boolean)
        .join(' ')}>
      <span className='flex h-6 w-6 items-center justify-center text-xl leading-none'>
        {icon}
      </span>
      {label && <span className='text-sm font-semibold tracking-wide'>{label}</span>}
    </button>
  );
}

export default FloatingButton;