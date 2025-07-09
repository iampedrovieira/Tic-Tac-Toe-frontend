
import React, { useState, useEffect } from 'react';
import styles from './InputNameModal.module.css';
import { cn } from '../../utils/classNames';
import { XIcon, OIcon } from '../UI/GameIcons';

interface InputNameModalProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  name: string;
  setName: (name: string) => void;
  onHandleName: () => void;
}

const InputNameModal: React.FC<InputNameModalProps> = ({
  open,
  setOpen,
  name,
  setName,
  onHandleName
}) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isNameValid, setIsNameValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset to welcome screen whenever modal opens
  useEffect(() => {
    if (open) {
      setShowWelcome(true);
    }
  }, [open]);

  // Validate name on change
  useEffect(() => {
    const trimmedName = name.trim();
    
    if (trimmedName.length === 0) {
      setIsNameValid(true);
      setErrorMessage('');
    } else if (trimmedName.length < 2) {
      setIsNameValid(false);
      setErrorMessage('Name must be at least 2 characters long');
    } else if (trimmedName.length > 20) {
      setIsNameValid(false);
      setErrorMessage('Name must be no more than 20 characters');
    } else {
      setIsNameValid(true);
      setErrorMessage('');
    }
  }, [name]);

  const handleClose = (e: React.MouseEvent) => {
    // Only close if clicking the overlay, not the modal content
    // And only allow closing on the name input screen, not welcome screen
    if (e.target === e.currentTarget && !showWelcome) {
      if (name.trim() && isNameValid) {
        setOpen(false);
      } else {
        setIsNameValid(false);
        setErrorMessage('Please enter a valid name to continue');
      }
    }
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setIsNameValid(false);
      setErrorMessage('Please enter your name to continue');
      return;
    }
    
    if (trimmedName.length < 2) {
      setIsNameValid(false);
      setErrorMessage('Name must be at least 2 characters long');
      return;
    }
    
    if (isNameValid) {
      setIsLoading(true);
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      onHandleName();
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isNameValid && name.trim() && !isLoading && !showWelcome) {
      handleSubmit();
    }
    
    if (e.key === 'Escape') {
      handleClose(e as any);
    }
  };

  const handleContinueToGame = () => {
    setShowWelcome(false);
  };

  if (!open) return null;

  // Combine CSS classes using the utility function
  const inputClassName = cn(styles.input, {
    [styles.inputError]: !isNameValid
  });

  const buttonClassName = cn(styles.button, {
    [styles.buttonLoading]: isLoading
  });

  // Welcome Screen
  if (showWelcome) {
    return (
      <div className={styles.overlay} onClick={handleClose}>
        <div 
          className={styles.welcomeContainer}
          onClick={e => e.stopPropagation()}
        >
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>Welcome to Trick-Tac-Toe</h1>
            <p className={styles.welcomeSubtitle}>
              Not your grandma's game!
            </p>
            
            <div className={styles.infoBlock}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <XIcon size={18} />
                </div>
                <span className={styles.infoText}>You only have 3 active pieces at a time.</span>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <OIcon size={18} />
                </div>
                <span className={styles.infoText}>Place a new one? The oldest vanishes.</span>
              </div>
            </div>
            
            <p className={styles.simpleText}>
              Create a game at /room/roomname and share the link.
            </p>
            
            <div className={styles.welcomeActions}>
              <button 
                className={cn(styles.button, styles.primaryButton)}
                onClick={handleContinueToGame}
              >
                Let's Play!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Name Input Screen
  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div 
        className={styles.container}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Welcome Player</h2>
            <p className={styles.subtitle}>
              Enter your name to join the game
            </p>
          </div>
          
          <div className={styles.body}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Your name here..."
                className={inputClassName}
                autoFocus
                disabled={isLoading}
              />
              {!isNameValid && errorMessage && (
                <div className={styles.errorMessage}>
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.footer}>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !isNameValid || isLoading}
              className={buttonClassName}
            >
              {isLoading ? (
                <span className={styles.spinner} />
              ) : (
                'Join Game'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputNameModal;
