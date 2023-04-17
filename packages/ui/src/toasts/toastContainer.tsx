import { ToastType, useToastStore } from 'toasts/state/toastStore';
import { AnimatePresence } from 'framer-motion';
import { Toast } from './toast';

export const ToastContainer = ({
  toasts,
  removeToast
}: {
  toasts: Array<ToastType>;
  removeToast: (toastId: string) => void;
}) => {
  return (
    <AnimatePresence>
      {toasts.map((toast: ToastType, index) => {
        return (
          <Toast
            index={index}
            key={toast.id}
            toast={toast}
            removeToast={removeToast}
          />
        );
      })}
    </AnimatePresence>
  );
};
