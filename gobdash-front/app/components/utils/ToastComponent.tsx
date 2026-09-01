import { AnimatePresence, motion } from 'motion/react';
import { Toast, ToastToggle } from 'flowbite-react';
import { BsBan, BsCheckLg, BsExclamation, BsInfo } from 'react-icons/bs';

interface ToastComponentProps {
  text: string;
  type: 'success' | 'error' | 'warning' | 'info';
  show: boolean;
  onClose?: () => void;
}

const typeStyles = {
  success: {
    border: 'border-green-700',
    iconBg: 'bg-green-100 text-green-700',
    icon: <BsCheckLg className='h-5 w-5' />,
  },
  error: {
    border: 'border-red-700',
    iconBg: 'bg-red-100 text-red-700',
    icon: <BsBan className='h-5 w-5' />,
  },
  warning: {
    border: 'border-yellow-700',
    iconBg: 'bg-yellow-100 text-yellow-700',
    icon: <BsExclamation className='h-5 w-5' />,
  },
  info: {
    border: 'border-blue-700',
    iconBg: 'bg-blue-100 text-blue-700',
    icon: <BsInfo className='h-5 w-5' />,
  },
};

function ToastComponent({ text, type, show, onClose }: ToastComponentProps) {
  const { border, iconBg, icon } = typeStyles[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <Toast className={`bg-sunlit-clay`}>
            <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${border} ${iconBg}`}>
              {icon}
            </div>
            <div className='ml-3 text-sm font-bold pr-2 text-espresso'>{text}</div>
            <ToastToggle onDismiss={onClose} />
          </Toast>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ToastComponent;

