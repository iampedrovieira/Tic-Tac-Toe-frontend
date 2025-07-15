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
        const socketClient = await connectSocket();
        setSocket(socketClient);
        setHideNameBox(true);
      } catch {
        // Handle connection error
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

  return (
    <div className={styles.container}>
      {name && !hideNameBox && (
        <>
          {/* Game Header - Top Left */}
          <div className={styles.GameHeader}>
            <h1 className={styles.gameTitle}>Tricky-Tac-Toe</h1>
            <div className={styles.roomInfo}>
              <h2 className={styles.roomName}>{getCurrentRoomName()}</h2>
              <h3 className={styles.playerVs}>{getPlayerVsText()}</h3>
            </div>
          </div>

          {/* Sidebar with Room Creator and Players */}
          <div className={styles.Sidebar}>
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

            {/* Players List */}
            <div className={styles.Players}>
              <PlayerListComponent players={playersList} />
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
