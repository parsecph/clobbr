import clsx from 'clsx';
import { motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import { ToastType } from './state/toastStore';
import { Typography } from '@mui/material';

export const Toast = ({
  index,
  toast,
  removeToast
}: {
  index: number;
  toast: ToastType;
  removeToast: (toastId: string) => void;
}) => {
  const dismissToast = () => {
    removeToast(toast.id as string);
  };

  const serverityToColorMap: {
    [key: string]: string;
  } = {
    success: '!bg-lime-500/20',
    error: '!bg-red-500/20',
    info: '!bg-blue-500/20',
    warning: '!bg-yellow-500/20'
  };

  return (
    <motion.div
      initial={{ translateY: -30, opacity: 0 }}
      animate={{
        translateY: 0,
        opacity: 1
      }}
      exit={{ translateY: -60, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20
      }}
      className={clsx(
        'fixed z-120 flex w-full pointer-events-none',
        toast.anchorOrigin?.vertical === 'top' ? 'top-0' : 'bottom-0',
        toast.anchorOrigin?.horizontal === 'left'
          ? 'justify-start'
          : toast.anchorOrigin?.horizontal === 'right'
          ? 'justify-end'
          : 'justify-center'
      )}
      style={{
        [toast.anchorOrigin?.vertical === 'top'
          ? 'marginTop'
          : 'marginBottom']: `${index * 5}px`
      }}
    >
      <Alert
        className={clsx(
          'w-auto backdrop-blur-lg m-10 max-w-xs pointer-events-auto shadow-md',
          toast.type ? serverityToColorMap[toast.type] : ''
        )}
        onClose={dismissToast}
        severity={toast.type}
        icon={false}
        sx={{ width: '100%' }}
        action={
          toast.dismissible ? (
            <IconButton
              aria-label="Dismiss"
              onClick={dismissToast}
              className="!mb-1 opacity-90 "
            >
              <Close className="text-black dark:text-white" />
            </IconButton>
          ) : null
        }
      >
        <Typography
          variant="body1"
          className="flex h-full items-center text-black dark:text-white"
        >
          {toast.message}
        </Typography>
      </Alert>
    </motion.div>
  );
};
