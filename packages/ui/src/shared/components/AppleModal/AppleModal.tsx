import clsx from 'clsx';
import { useEffect, useRef } from 'react';

import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { rootContainer } from 'rootContainer';

import { Button } from '@mui/material';

const WrappedDialog = Dialog as unknown as React.ElementType<any>;

const rootOpenClasses = ['scale-95', 'origin-top'];

export const Modal = ({
  open = false,
  maxWidth = 'xl',
  onClose,
  children,
  footerComponent,
  footerButtons,
  closeButtonText
}: {
  open?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  onClose: () => void;
  children: React.ReactNode;
  footerComponent?: React.ReactNode;
  footerButtons?: React.ReactNode;
  closeButtonText?: string;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      rootContainer.classList.add(...rootOpenClasses);

      if (modalRef?.current) {
        setTimeout(() => {
          (modalRef.current as HTMLElement).scrollTop = 0;
        }, 0);
      }
    } else {
      rootContainer.classList.remove(...rootOpenClasses);
    }

    return () => rootContainer.classList.remove(...rootOpenClasses);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <WrappedDialog
          className="fixed inset-0 z-50"
          onClose={onClose}
          open={open}
        >
          <div
            className="fixed inset-0 bg-gray-100/30 dark:bg-gray-900/30"
            aria-hidden="true"
          />

          <div className="flex h-full flex-col items-center justify-center mt-auto pt-6 lg:pt-12 px-4 tall-lg:pt-6 ">
            <Dialog.Overlay
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] }
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] }
              }}
              className="fixed inset-0 bg-black/40"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{
                y: 0,
                transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] }
              }}
              exit={{
                y: '100%',
                opacity: 0,
                transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] }
              }}
              className={clsx(
                'z-0 flex flex-col w-full h-full bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm rounded-t-lg shadow-xl overflow-auto',
                'tall-lg:h-auto tall-lg:min-h-[840px]',
                maxWidth && `max-w-${maxWidth}`
              )}
              ref={modalRef}
            >
              {children}

              <div className="mt-auto flex flex-col p-4">
                {footerComponent ? footerComponent : ''}

                <div className="flex justify-center gap-2">
                  {footerButtons ? footerButtons : ''}
                  <Button onClick={onClose} color="secondary" size="small">
                    {closeButtonText || 'Done'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </WrappedDialog>
      )}
    </AnimatePresence>
  );
};
