import React from 'react';
import { cn } from '../../utils/classNames';
import styles from "./CheckReadyModal.module.css";

interface CheckReadyModalProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  check: boolean;
  onChangeCheck: () => void;
}

const CheckReadyModal: React.FC<CheckReadyModalProps> = ({
  open,
  setOpen,
  check,
  onChangeCheck
}) => {
  const handleClose = (e: React.MouseEvent) => {
    // Only close if clicking the overlay, not the modal content
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
    if (e.key === 'Enter' || e.key === ' ') {
      onChangeCheck();
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div 
        className={styles.container}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Set Ready Status</h2>
            <p className={styles.subtitle}>
              Toggle your ready status for the game
            </p>
          </div>
          
          <div className={styles.body}>
            <div className={styles.checkboxContainer}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={check}
                  onChange={onChangeCheck}
                  onKeyDown={handleKeyDown}
                  className={styles.hiddenCheckbox}
                />
                <div className={cn(styles.customCheckbox, { [styles.checked]: check })}>
                  <div className={styles.checkmark}>
                    {check && (
                      <svg
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4.5L4.5 8L11 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={styles.checkboxText}>
                  {check ? "Ready to play!" : "Not ready yet"}
                </span>
              </label>
            </div>
          </div>
          
          <div className={styles.footer}>
            <button
              onClick={() => setOpen(false)}
              className={styles.button}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckReadyModal;
