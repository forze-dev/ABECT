'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import ContactModal from '@/client/components/ContactModal';

interface ModalContextType {
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  // Listen for clicks on elements with data-open-modal attribute
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const modalTrigger = target.closest('[data-open-modal]');

      if (modalTrigger) {
        e.preventDefault();
        openContactModal();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isContactModalOpen,
        openContactModal,
        closeContactModal,
      }}
    >
      {children}
      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
