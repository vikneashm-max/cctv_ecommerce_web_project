import React from 'react';
import './CustomModal.css';

interface CustomModalProps {
  isOpen: boolean;
  type: 'alert' | 'confirm';
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, type, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        <div className="custom-modal-header">
          <div className="custom-modal-icon">
            {type === 'confirm' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3b82f6' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            )}
          </div>
          <h3 className="custom-modal-title">
            {type === 'confirm' ? 'Confirm Action' : 'Notification'}
          </h3>
        </div>
        
        <div className="custom-modal-body">
          <p>{message}</p>
        </div>
        
        <div className="custom-modal-footer">
          {type === 'confirm' && (
            <button className="custom-modal-btn cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button className="custom-modal-btn confirm-btn" onClick={onConfirm}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
