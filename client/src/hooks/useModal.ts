import { useState } from 'react';

interface ModalConfig {
  title?: string;
  message: string;
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({ message: '' });

  const showModal = ({ title, message }: ModalConfig) => {
    setModalConfig({ title, message });
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    modalConfig,
    showModal,
    hideModal
  };
}