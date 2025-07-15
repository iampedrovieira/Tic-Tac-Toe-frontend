import React from 'react';
import styles from './WelcomeScreen.module.css';
import { cn } from '../../utils/classNames';
import { XIcon, OIcon } from '../UI/GameIcons';

interface WelcomeScreenProps {
  open: boolean;
  onClose?: () => void;
  onContinue: () => void;
  title?: string;
  subtitle?: string;
  showOverlay?: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  open,
  onClose,
  onContinue,
  title = "Welcome to Trick-Tac-Toe",
  subtitle = "Not your grandma's game!",
  showOverlay = true
}) => {
  const handleClose = (e: React.MouseEvent) => {
    // Only close if clicking the overlay and onClose is provided
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  if (!open) return null;

  const content = (
    <div 
      className={styles.welcomeContainer}
      onClick={e => e.stopPropagation()}
    >
      <div className={styles.welcomeContent}>
        <h1 className={styles.welcomeTitle}>{title}</h1>
        <p className={styles.welcomeSubtitle}>
          {subtitle}
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
            onClick={onContinue}
          >
            Let's Play!
          </button>
        </div>
      </div>
    </div>
  );

  if (showOverlay) {
    return (
      <div className={styles.overlay} onClick={handleClose}>
        {content}
      </div>
    );
  }

  return content;
};

export default WelcomeScreen;
