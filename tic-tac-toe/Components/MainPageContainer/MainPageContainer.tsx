import React, { useEffect, useState } from 'react';
import { Socket } from "socket.io-client";
import styles from "../../styles/Home.module.css";
import {
  connectSocket,
  emitSendPlayerInfo,
  onPlayersChange,
  onWaitingPlayer,
} from "../../libs/socketConnection";
import {
  onGameEnd,
  onGameStart,
  onPlayerAvailable,
  onPlayerMove,
} from "../../libs/SocketGame";

import PlayerListComponent from "../PlayersList/PlayerList";
import BoardComponent from "../Board/Board";
import CheckReadyModal from "../CheckReady/CheckReadyModal";
import InputNameModal from "../InputName/InputNameModal";
import ServerConnectionModal from "../ServerConnectionModal/ServerConnectionModal";

import Player from "Types/Player";
import Game from "Types/Game";
import Move from "Types/Move";

interface MainPageContainerProps {
  roomName?: string; // Optional - 'LOBBY' if not provided
}

const MainPageContainer: React.FC<MainPageContainerProps> = ({ roomName = 'LOBBY' }) => {
  const [socket, setSocket] = useState<Socket>();
  const [playerId, setPlayerId] = useState<String>();
  const [game, setGame] = useState<Game>();
  const [gameEnd, setGameEnd] = useState<Boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  
  const [name, setName] = useState<string>("");
  const [hideNameBox, setHideNameBox] = useState<boolean>(false);
  const [hideCheckReadyBox, setHideCheckReadyBox] = useState<boolean>(false);
  const [checkBox, setCheckBox] = useState<boolean>(false);
  const [playersList, setPlayersList] = useState<Player[]>([]);
  
  // New state for room creation
  const [newRoomName, setNewRoomName] = useState<string>("");
  
  // State for mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  // State for server connection
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  // Helper function to get current room display name
  const getCurrentRoomName = () => {
    return roomName === 'LOBBY' ? 'Main Lobby' : roomName;
  };

  // Helper function to get player vs player text
  const getPlayerVsText = () => {
    if (game?.player1 && game?.player2) {
      return `${game.player1.name} vs ${game.player2.name}`;
    } else if (game?.player1) {
      return `${game.player1.name} vs ...`;
    } else if (game?.player2) {
      return `... vs ${game.player2.name}`;
    }
    return "Waiting for players...";
  };

  // Socket server connection
  useEffect(() => {
    async function connection() {
      try {
        setIsConnecting(true);
        setConnectionError(false);
        const socketClient = await connectSocket();
        setSocket(socketClient);
        setHideNameBox(true);
        setIsConnecting(false);
      } catch (error) {
        console.error('Connection failed:', error);
        setConnectionError(true);
        setIsConnecting(false);
      }
    }
    connection();
  }, []);

  // This is run when player is connected to server
  useEffect(() => {
    if (!socket) return;
    
    setPlayerId(socket.id);
    onPlayerAvailable(socket, setHideCheckReadyBox, setCheckBox, setMessage);
    setHideNameBox(true);
    onWaitingPlayer(socket, setMessage);
    onPlayersChange(socket, setPlayersList);
    onGameEnd(socket, setMessage, setGameEnd);
    onGameStart(socket, setMessage, setGame, setHideCheckReadyBox, setGameEnd, setTitle, playerId);
    onPlayerMove(socket, setGame, setMessage);
  }, [socket, playerId]);

  // Close sidebar when game starts (mobile only)
  useEffect(() => {
    if (game && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [game]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  function handleName(): void {
    if (!name) return;
    if (!socket) return;
    emitSendPlayerInfo(socket, name, roomName);
    setHideNameBox(false);
  }

  function handleCheckBox() {
    if (!checkBox) {
      setCheckBox(!checkBox);
      socket?.emit("playerCheck", roomName);
    } else {
      setCheckBox(!checkBox);
      socket?.emit("playerUnCheck", roomName);
    }
  }

  function handleEmitMove(move: Move) {
    socket!.emit("playerMove", move, roomName);
  }

  function handleCreateRoom() {
    if (!newRoomName.trim()) return;
    
    // Navigate to the new room - you might want to use a router for this
    const cleanRoomName = newRoomName.trim().replace(/\s+/g, '-');
    window.location.href = `/room/${cleanRoomName}`;
  }

  function handleRoomInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleCreateRoom();
    }
  }

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  function handleRetryConnection() {
    // Reset socket state and try reconnection
    setSocket(undefined);
    setConnectionError(false);
    setIsConnecting(true);
    
    // Trigger reconnection
    setTimeout(async () => {
      try {
        const socketClient = await connectSocket();
        setSocket(socketClient);
        setHideNameBox(true);
        setIsConnecting(false);
      } catch (error) {
        console.error('Retry connection failed:', error);
        setConnectionError(true);
        setIsConnecting(false);
      }
    }, 1000);
  }

  return (
    <div className={styles.container}>
      {/* Server Connection Modal */}
      <ServerConnectionModal 
        isConnecting={isConnecting || connectionError} 
      />
      
      {name && !hideNameBox && (
        <>
          {/* Game Header - Just the title */}
          <div className={styles.GameHeader}>
            <h1 className={styles.gameTitle}>Trick-Tac-Toe</h1>
          </div>

          {/* Room Info - Centered above game board */}
          <div className={styles.RoomInfo}>
            <h2 className={styles.roomName}>{getCurrentRoomName()}</h2>
            <h3 className={styles.playerVs}>{getPlayerVsText()}</h3>
          </div>

          {/* Mobile Sidebar Toggle */}
          <div className={styles.sidebarToggle}>
            <button 
              onClick={toggleSidebar} 
              className={styles.sidebarToggleButton}
              aria-label="Open menu"
            >
              <span>☰</span>
              Players & Rooms
            </button>
          </div>

          {/* Sidebar Overlay */}
          <div 
            className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.open : ''}`}
            onClick={closeSidebar}
          />

          {/* Sidebar with Players and Room Creator */}
          <div className={`${styles.Sidebar} ${isSidebarOpen ? styles.open : ''}`}>
            {/* Close button for mobile */}
            <button 
              onClick={closeSidebar} 
              className={styles.sidebarCloseButton}
              aria-label="Close menu"
            >
              ×
            </button>

            {/* Players List */}
            <div className={styles.Players}>
              <PlayerListComponent players={playersList} />
            </div>

            {/* Room Creator */}
            <div className={styles.RoomCreator}>
              <h3 className={styles.roomCreatorTitle}>Create New Room</h3>
              <div className={styles.roomCreatorForm}>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  onKeyDown={handleRoomInputKeyDown}
                  placeholder="Enter room name..."
                  className={styles.roomInput}
                  maxLength={20}
                />
                <button
                  onClick={handleCreateRoom}
                  disabled={!newRoomName.trim()}
                  className={styles.createRoomButton}
                >
                  Create
                </button>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div className={styles.Game}>
            {socket && game && (
              <BoardComponent 
                game={game} 
                socket={socket} 
                setMessage={setMessage} 
                handleEmitMove={handleEmitMove} 
                gameEnd={gameEnd}
              />
            )} 
            <div className={styles.message}> 
              <h3>{message}</h3>
            </div>
          </div>
        </>
      )}
      <InputNameModal
        open={hideNameBox}
        setOpen={setHideNameBox}
        name={name}
        setName={setName}
        onHandleName={handleName}
      />
      <CheckReadyModal
        open={hideCheckReadyBox}
        setOpen={setHideCheckReadyBox}
        check={checkBox}
        onChangeCheck={handleCheckBox}
      />
    </div>
  );
};

export default MainPageContainer;
