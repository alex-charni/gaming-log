import { Toast } from '@presentation/schemas/types';

export type ToastState = {
  title: string;
  message: string;
  icon: string;
  type: Toast;
  isOpen: boolean;
  isClosing: boolean;
};
