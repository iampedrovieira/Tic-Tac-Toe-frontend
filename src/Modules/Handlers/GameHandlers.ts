import { Socket } from "socket.io";

import Move from "../../Types/Move"
import StatusGame from "../../Types/StatusGame";
import { Sequelize } from "sequelize";
import RoomModel from "../../../models/Room";
import UserModel,{User} from "../../../models/User";
import GameModel from "../../../models/Game";

module.exports = (io:any,socket:Socket,sequelize:Sequelize)=>{

    const onPlayerMove = async function (move:Move,roomName:string){
      //Get the room from DB
       //Find a room on the DB
      const room = RoomModel(sequelize);
      const user = UserModel(sequelize);
      const game = GameModel(sequelize);
      const roomObj = await room.findOne({ where: { NAME: roomName }});
      if (!roomObj) return;
      //Get Room game from db
      const gameObj = await game.findOne({ where: { ROOMID: roomObj.ID } });
      if (!gameObj) return;

      //Check if player is allowed to play
      if(gameObj.getPlayerAllowed()!=socket.id){
        socket.emit('cannotPlay','cannotPlay')
        return;
      }
      
      const status:StatusGame = gameObj.move(move,socket.id);
      await gameObj.save();

      const player1Info = await user.findOne({ where: { SOCKETID: gameObj.getPlayer1() } });
      if (!player1Info) return;
      const player2Info = await user.findOne({ where: { SOCKETID: gameObj.getPlayer2() } });
      if (!player2Info) return;
      
      io.to(roomName).emit("playerMove",await gameObj.getGameInfoOutput());

      if(status.draw){
        const gameEndStatus ={
          'playerWin':'',
          'isDraw':status.draw,
          'playerWinId':'',
          'playerLossId':'',
          'playerNextId':'',
          'nextPlayers':[player1Info,player2Info]
        }

        io.to(roomName).emit('gameEnd',gameEndStatus)
      }
      if(status.win){
        let playerWinName =  await user.findOne({ where: { SOCKETID: status.playerWin } })
        const gameEndStatus ={
          'playerWin':playerWinName?.getName(),
          'isDraw':'',
          'playerWinId':'',
          'playerLossId':'',
          'playerNextId':'',
          'nextPlayers':[player1Info,player2Info]
        }
        io.to(roomName).emit('gameEnd',gameEndStatus)
      }

      if(status.draw || status.win){
        //Delete the game in DB
        await game.destroy({where: { ROOMID: roomObj.ID }});
        
        setTimeout(async() => {
          //Update player 1 and player 2 option to -2 on DB 
          player1Info.setOption(-2);
          player2Info.setOption(-2);

          await player1Info.save();
          await player2Info.save();
          const playersInRoom = await user.findAll({ where: { ROOMID: roomObj?.ID }, order: [['ID', 'ASC']]});
          const playersOutput = playersInRoom.map((player: User) => {return player.getUserOutput()});

          io.to(roomObj.NAME).emit("onPlayersChange", playersOutput);
          io.to(playersInRoom[0].getSocketID()).emit("playerAvailable");
          io.to(playersInRoom[1].getSocketID()).emit("playerAvailable");
        
        }, 2500);
      }
    }

    return {
        onPlayerMove
    }
}