import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Socket } from "socket.io-client";
import {
  connectSocket,
  emitSendPlayerInfo,
  onPlayersChange,
  onWaitingPlayer,
} from "./../libs/socketConnection";
import {
  onGameEnd,
  onGameStart,
  onPlayerAvailable,
  onPlayerMove,
} from "./../libs/SocketGame";

import PlayerListComponent from "./../Components/PlayersList/PlayerList";
import BoardComponent from "./../Components/Board/Board";
import CheckReadyModal from "./../Components/CheckReady/CheckReadyModal";
import InputNameModal from "./../Components/InputName/InputNameModal";

import Player from "Types/Player";
import Game from "Types/Game";
import Move from "Types/Move";

const Home = () => {
 
  const [socket, setSocket] = useState<Socket>();
  const [playerId, setPlayerId] = useState<String>();
  const [game, setGame] = useState<Game>();
  const [gameEnd,setGameEnd] = useState<Boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  
  const [name, setName] = useState<string>("");
  const [hideNameBox, setHideNameBox] = useState<boolean>(false);
  const [hideCheckReadyBox, setHideCheckReadyBox] = useState<boolean>(false);
  const [checkBox, setCheckBox] = useState<boolean>(false);
  const [playersList, setPlayersList] = useState<Player[]>([]);

  // Socket server connection
  useEffect(() => {
    alert("Welcome to a Unique Tic-Tac-Toe Experience!\n\nThis isn't your ordinary tic-tac-toe. Here's what makes our game special:\n\n- Limited Moves: You can only use 3 positions on the board. If you play a fourth move, your first move will be automatically removed. Keep track of your opponent's moves as well!\n\n- Player Limit: Only the first 2 players to join can play the game. Anyone else who joins will be a spectator. So, get in quick!\n\n- Creating a New Room: Want to start your own game? Simply navigate to /room/roomname in your browser. For example, https://tictactoe.iampedrovieira.pt/room/test. Share the link with your opponent to start playing against each other.\n\nEnjoy the game, and may the best player win!");
    async function connection() {
      try{
        const socketClient = await connectSocket();
        setSocket(socketClient)
        setHideNameBox(true)
      }catch{
        
      }
    }
    connection();
  },[]);

  //This is run when player is connected to server
  useEffect(() => {
  
    if (!socket) return;
    setPlayerId(socket.id);
    onPlayerAvailable(socket, setHideCheckReadyBox, setCheckBox,setMessage);
    setHideNameBox(true);
    onWaitingPlayer(socket, setMessage);
    onPlayersChange(socket, setPlayersList);
    onGameEnd(socket,setMessage,setGameEnd);
    onGameStart(socket,setMessage,setGame,setHideCheckReadyBox,setGameEnd,setTitle,playerId);
    onPlayerMove(socket,setGame,setMessage)    
  
  }, [socket]);

  function handleName(): void {
    if (!name) return;
    if (!socket) return;
    emitSendPlayerInfo(socket, name,'LOBBY');
    setHideNameBox(false);
  }

  function handleCheckBox() {
    if (!checkBox) {
      setCheckBox(!checkBox);
      socket?.emit("playerCheck",'LOBBY');
    } else {
      setCheckBox(!checkBox);
      socket?.emit("playerUnCheck",'LOBBY');
    }
  }

  function handleEmitMove(move:Move){
    socket!.emit("playerMove", move,'LOBBY');
  }

  return (
    <div className={styles.container}>
        <div className={styles.Title}> 
          <h1>{title}</h1>
        </div>
        <div className={styles.Players}>
          <PlayerListComponent players={playersList} />
        </div>
        <div className={styles.Game}>
          { socket && game &&
            <BoardComponent game={game} socket={socket} setMessage = {setMessage} handleEmitMove={handleEmitMove} gameEnd={gameEnd}/>
          } 
          <div className={styles.message}> 
          <h3> {message}
            </h3>
            </div>
        </div>
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

export default Home;
