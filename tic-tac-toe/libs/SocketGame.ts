// * All socket functions used in game
import { Socket } from "socket.io-client";

import Game from "./../Types/Game";
import EndGameStatus from 'Types/EndGameStatus';

export function onPlayerAvailable(socket:Socket,setHideCheckReadyBox:(visible:boolean)=>void,setCheckBox:(visible:boolean)=>void,setMessage:(message:string)=>void){

  socket.on('playerAvailable',()=>{
    setMessage('')
    setCheckBox(false);
    setHideCheckReadyBox(true);
      return;
  });
  return;
}

export function onPlayerMove(socket:Socket,setGame:(game:Game)=>void,setMessage:(message:string)=>void){

  socket.on("playerMove", (gameState: Game) => {
    
    const newGameState: Game = {
      player1: gameState.player1,
      player2: gameState.player2,
      playerAllowed: gameState.playerAllowed,
      gameState: gameState.gameState,
      positionRemove: gameState.positionRemove,
    };
    setGame(newGameState);
    
    if(socket.id == gameState.playerAllowed) setMessage("It's your time to play");
    if(socket.id != gameState.player1?.id && socket.id != gameState.player2?.id){
      if(gameState.playerAllowed == gameState.player1?.id){
        setMessage("It's " + gameState.player1?.name + " turn to play");
      }else{
        setMessage("It's " + gameState.player2?.name + " turn to play");
      }
    }else{
      if(socket.id != gameState.playerAllowed) setMessage("Wait for other player move");
    } 

  });
}

export function onGameStart(socket:Socket,setMessage:(message:string)=>void,setGame:(game:Game)=>void,setHideCheckReadyBox:(visible:boolean)=>void,setGameEnd:(gameEnde:Boolean)=>void,setTitle:(message:string)=>void,playerId?:String) {
    socket.on("gameStart",(data:Game)=>{
        console.log(data);
        setHideCheckReadyBox(false);
        setGame(data);
        setGameEnd(false);
        const title = data.player1?.name + " VS " + data.player2?.name; 
        setTitle(title);

        if(socket.id == data.playerAllowed) setMessage("It's your time to play");
        if(socket.id != data.player1?.id && socket.id != data.player2?.id){
          if(data.playerAllowed == data.player1?.id){
            setMessage("It's " + data.player1?.name + " turn to play");
          }else{
            setMessage("It's " + data.player2?.name + " turn to play");
          }
        }else{
          if(socket.id != data.playerAllowed) setMessage("Wait for other player move");
        } 
      })
    
}

export function onGameEnd(socket:Socket,setMessage:(message:string)=>void,setGameEnd:(gameEnde:Boolean)=>void){

  socket.on("gameEnd",(endGameStatus:any)=>{
  
    setGameEnd(true);
    console.log(endGameStatus)
    if(endGameStatus.isDraw){
      if(endGameStatus.nextPlayers.length==0){
        setMessage('Its a draw. Other game with same players');
      }else{
        setMessage('Its a draw. Next Players -> '+endGameStatus.nextPlayers[0].NAME+ ' and '+ endGameStatus.nextPlayers[1].NAME);
      }
    }else{
      setMessage(endGameStatus.playerWin + ' Win the game. Nexts Players are '+ endGameStatus.nextPlayers[0].NAME + ' and ' + endGameStatus.nextPlayers[1].NAME);
    }
    

  });
}