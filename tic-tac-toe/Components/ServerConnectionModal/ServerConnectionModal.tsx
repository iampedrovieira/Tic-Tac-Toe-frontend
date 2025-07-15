import React, { useEffect, useState } from 'react';
import styles from './ServerConnectionModal.module.css';

interface ServerConnectionModalProps {
  isConnecting: boolean;
}

const ServerConnectionModal: React.FC<ServerConnectionModalProps> = ({ 
  isConnecting
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  // Fun messages with movie references and game context
  const connectionMessages = [
    "🏁 Starting engines... Ka-chiga! The servers have been hibernating in Radiator Springs!",
    "🌌 Initiating server sequences across multiple dimensions... Just like in Inception!",
    "⚡ Waking up the quantum servers from their deep space hibernation...",
    "🔧 Rusty and Dusty are working overtime to get the servers back online!",
    "🎬 The servers went to sleep during the credits... but now they're back for the sequel!",
    "🚀 Houston, we have a problem... just kidding! Servers coming back online!",
    "🎯 Remember: In Trick-Tac-Toe, only your newest 3 pieces stay on the board!",
    "⏰ Time isn't linear for our servers... they think it's still yesterday!",
    "🏎️ Speed. I am speed... but our free-tier servers need a pit stop!",
    "🌟 The servers are traveling through time faster than Cooper in Interstellar!"
  ];

  // Cycle through messages every 8 seconds (slower)
  useEffect(() => {
    if (!isConnecting) return;

    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % connectionMessages.length);
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [isConnecting, connectionMessages.length]);

  if (!isConnecting) return null;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Animated game pieces */}
        <div className={styles.gameAnimation}>
          <div className={styles.piece + ' ' + styles.pieceX}>✕</div>
          <div className={styles.piece + ' ' + styles.pieceO}>○</div>
          <div className={styles.piece + ' ' + styles.pieceX}>✕</div>
        </div>

        {/* Main title */}
        <h1 className={styles.title}>
          🔧 Servers Waking Up From Hibernation!
        </h1>

        {/* Subtitle with humor */}
        <h2 className={styles.subtitle}>
          Our free-tier servers have been on a long cosmic journey...
        </h2>

        {/* Time expectation notice */}
        <div className={styles.timeNotice}>
          ⏱️ <strong>This may take 1-2 minutes or more</strong> - our servers need time to wake up!
        </div>

        {/* Loading animation */}
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Connecting</div>
          <div className={styles.dots}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>

        {/* Rotating funny messages */}
        <div className={styles.messageContainer}>
          <p className={styles.message}>
            {connectionMessages[currentMessage]}
          </p>
        </div>

        {/* Game rules reminder */}
        <div className={styles.gameInfo}>
          <h3>🎮 Quick Reminder:</h3>
          <p>In Trick-Tac-Toe, you only have 3 pieces - when you place a 4th, your oldest disappears!</p>
        </div>

        {/* Action buttons */}
        <div className={styles.buttonContainer}>
          <button 
            onClick={handleRefresh}
            className={styles.refreshButton}
          >
            🔄 Refresh Page
          </button>
        </div>

        {/* Easter egg - hidden TARS reference */}
        <div className={styles.easterEgg}>
          <small>TARS: "Servers are at 90% functionality... that's impossible!"</small>
        </div>
      </div>
    </div>
  );
};

export default ServerConnectionModal;
