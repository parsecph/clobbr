import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export type ToastType = {
  id?: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  dismissible?: boolean;
  autoHideDuration?: number;
  anchorOrigin?: {
    vertical: "top" | "bottom" | string;
    horizontal: "left" | "center" | "right" | string;
  };
};

interface ToastState {
  toasts: Array<ToastType>;
  addToast: (toast: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>()(
  devtools(
    (set, get) => ({
      toasts: [] as Array<ToastType>,

      addToast: (newToast) => {
        const id = uuidv4();
        const autoHideDuration = newToast.autoHideDuration || 5000;

        const toast = {
          id,
          message: newToast.message,
          type: newToast.type || "success",
          dismissible: newToast.dismissible || true,
          autoHideDuration,
          anchorOrigin: {
            vertical: newToast.anchorOrigin?.vertical || "top",
            horizontal: newToast.anchorOrigin?.horizontal || "center",
          },
        };

        set((state) => {
          return { toasts: state.toasts.concat(toast) };
        });

        setTimeout(() => {
          set((state) => {
            return {
              toasts: state.toasts.filter((toast) => toast.id !== id),
            };
          });
        }, autoHideDuration);
      },

      removeToast: (id) => {
        set((state) => {
          return {
            toasts: state.toasts.filter((toast) => toast.id !== id),
          };
        });
      },
    }),
    {
      name: "toast-storage",
    }
  )
);
