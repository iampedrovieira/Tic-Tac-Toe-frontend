import { Socket } from "socket.io-client";
import ButtonConfig from "./ButtonConfig";
import Game from "./Game";

export default interface BoardState{
    playerId:string,
    playerOption:number,
    game:Game,
    isGameEnd:Boolean,
    setMessage:Function,
    handleEmitMove:Function,
    socket:Socket,
    buttonsState:Array<Array<ButtonConfig>>
}