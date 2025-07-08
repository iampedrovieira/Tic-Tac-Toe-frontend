import { Socket } from "socket.io";
import { Sequelize } from "sequelize";

module.exports = (io:any,sequelize:Sequelize)=>{
    
    const onConnection = (socket:Socket) =>{
        // * Put here the Listenters
      const {onDisconnecting} = require('./Handlers/DisconnectingHandler')(io,socket,sequelize);
      socket.on("disconnect",onDisconnecting);
        // * New player join the game
      const {onNewPlayerJoin,onPlayerCheck,onPlayerUnCheck} = require('./Handlers/ConnectionHandlers')(io,socket,sequelize);
      socket.on("newPlayerJoin",onNewPlayerJoin);
      socket.on('playerCheck',onPlayerCheck);
      socket.on('playerUnCheck',onPlayerUnCheck);  
      
      const {onPlayerMove} = require('./Handlers/GameHandlers')(io,socket,sequelize);
      socket.on("playerMove",onPlayerMove);

    }
    
    return io.on("connection",onConnection)
}