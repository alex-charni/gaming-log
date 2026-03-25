import { ToastState } from './toast-state.type';

export const toastInitialState: ToastState = {
  title: '',
  message: '',
  icon: '',
  type: 'info',
  isOpen: false,
  isClosing: false,
};
