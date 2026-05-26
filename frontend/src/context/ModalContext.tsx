import React, { createContext, useContext, useState, ReactNode } from 'react';
import CustomModal from '../components/Modal/CustomModal';

type ModalType = 'alert' | 'confirm';

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  message: string;
  resolve: ((value: boolean) => void) | null;
}

interface ModalContextType {
  showAlert: (message: string) => Promise<boolean>;
  showConfirm: (message: string) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: 'alert',
    message: '',
    resolve: null,
  });

  const showAlert = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'alert',
        message,
        resolve,
      });
    });
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'confirm',
        message,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    if (modalState.resolve) modalState.resolve(true);
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    if (modalState.resolve) modalState.resolve(false);
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <CustomModal 
        isOpen={modalState.isOpen}
        type={modalState.type}
        message={modalState.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ModalContext.Provider>
  );
};
