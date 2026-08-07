import { useState, useCallback } from 'react';

export interface UseModalStateReturn<T = unknown> {
  open: boolean;
  data: T | null;
  showModal: (data?: T) => void;
  hideModal: () => void;
  toggleModal: () => void;
}

/**
 * Hook quản lý trạng thái mở/đóng Modal hoặc Drawer kèm theo data truyền vào nếu có
 */
export function useModalState<T = unknown>(initialOpen = false): UseModalStateReturn<T> {
  const [open, setOpen] = useState(initialOpen);
  const [data, setData] = useState<T | null>(null);

  const showModal = useCallback((modalData?: T) => {
    if (modalData !== undefined) {
      setData(modalData);
    }
    setOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setOpen(false);
    setData(null);
  }, []);

  const toggleModal = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return {
    open,
    data,
    showModal,
    hideModal,
    toggleModal,
  };
}
