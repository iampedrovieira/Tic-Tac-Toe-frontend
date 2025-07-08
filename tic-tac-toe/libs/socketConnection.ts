import PlayerInfo from "Components/PlayerInfo/PlayerInfo";
import { platform } from "os";
import { io, Socket } from "socket.io-client";
import Player from "Types/Player";

export async function connectSocket():Promise<Socket>{

    let socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);
  
    const promiseSocketConnection = new Promise<Socket>((resolve, reject) => {
        socket.on("connect", () => {
     
            resolve(socket);
        });
        
        socket.on("connect_error", (err) => {
            reject(err)
        });
    });

    await promiseSocketConnection;

    return socket

}

export function emitSendPlayerInfo(socket:Socket,playerName:string,roomName:string):void{
    
    socket.emit("newPlayerJoin",playerName,roomName);
    return;
}

export function onWaitingPlayer(socket:Socket,setMessage:(message:string)=>void,){

    socket.on('waitingPlayer',(msg:string)=>{
        setMessage(msg)
        return;
    })
    return;
}

export function onPlayersChange(socket:Socket,setPlayersList:(players:Player[])=>void){
    socket.on('onPlayersChange',(players:Player[])=>{
        console.log(players)
        setPlayersList(players);
        return;
    })
    return;
}
    