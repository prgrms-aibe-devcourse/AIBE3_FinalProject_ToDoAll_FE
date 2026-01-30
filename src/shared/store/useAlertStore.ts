import { create } from 'zustand/react';

type UIType = 'success' | 'error' | 'info' | 'warning';

export type OpenAlertModalArgs = {
  type: UIType;
  title?: string;
  message: string;
  onClose?: () => void;
  confirmText?: string;
  onConfirm?: () => void;
};

type ActionType = {
  openAlertModal: (_args: OpenAlertModalArgs) => void;
  closeAlertModal: () => void;
};

export type ModalPropsType = {
  open: boolean;
} & OpenAlertModalArgs;

type StoreType = {
  action: ActionType;
} & ModalPropsType;

export const useAlertStore = create<StoreType>((set) => ({
  open: false,
  type: 'info',
  title: '',
  message: '',
  onClose: () => null,
  confirmText: '확인',
  onConfirm: () => null,
  action: {
    openAlertModal: (args: OpenAlertModalArgs) => {
      set(() => ({ title: args.title, message: args.message, open: true }));
      if (args.onClose) set(() => ({ onClose: args.onClose }));
      if (args.confirmText) set(() => ({ confirmText: args.confirmText }));
      if (args.onConfirm) set(() => ({ onConfirm: args.onConfirm }));
    },
    closeAlertModal: () => {
      set(() => ({ open: false }));
    },
  },
}));
