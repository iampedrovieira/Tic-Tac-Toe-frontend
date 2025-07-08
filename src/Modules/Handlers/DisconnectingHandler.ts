import { Socket } from "socket.io";
import RoomModel from "../../../models/Room";
import UserModel,{User} from "../../../models/User";
import GameModel from "../../../models/Game";
import { Sequelize } from "sequelize";

module.exports = (io: any,socket: Socket,sequelize:Sequelize) => {
  const onDisconnecting = async function () {
    console.log("Disconnecting")
    console.log('=====================================================');
    //Create room on DB
    const room = RoomModel(sequelize);
    const user = UserModel(sequelize);
    const game = GameModel(sequelize);
    //Trougth the socket ID and User object, find the room on DB
    const userObj = await user.findOne({where :{ SOCKETID : socket.id }});
    if (!userObj) return;
    const roomObj = await room.findOne({where :{ ID: userObj.getRoomID() }});
    if (!roomObj) return;
    //Get all players in the room
    let playersInRoom = await user.findAll({where :{ ROOMID : roomObj.ID }, order: [['ID', 'ASC']]});
    if (!playersInRoom) return;

    //Get the user position in the playersInRoom
    let playerPosition = 0;
    let existPlayer = false;

    playersInRoom.forEach((player) => {
      if (player.getSocketID() == socket.id) {
        existPlayer = true;
        playerPosition = playersInRoom.indexOf(player) + 1;
        return;
      }
    });
  
    if (!existPlayer) return;
    
    if (playerPosition > 2){
      //Delete the player in DB
      await user.destroy({where: { SOCKETID: socket.id }});
    }else{
      //Delete the game in DB
      await game.destroy({where: { ROOMID: roomObj.ID }});
      
      //Delete the player in DB
      await user.destroy({where: { SOCKETID: userObj.getSocketID() }});

      playersInRoom = await user.findAll({where :{ ROOMID : roomObj.ID }, order: [['ID', 'ASC']]});

        try {
          
          const gameEndStatus = {
            playerWin: playersInRoom[0].getName(),
            isDraw: false,
            playerWinId: playersInRoom[0].getSocketID(),
            playerLossId: "",
            playerNextIds: [playersInRoom[0].getSocketID(),playersInRoom[1].getSocketID()],
            nextPlayers: [playersInRoom[0].getName(),playersInRoom[1].getName()]
          };
          
          io.to(roomObj.NAME).emit("gameEnd", gameEndStatus);
          if(playersInRoom.length >= 2){
            setTimeout(async() => {
              //Update player 1 and player 2 option to -2 on DB 
              playersInRoom[0].setOption(-2);
              playersInRoom[1].setOption(-2);

              await playersInRoom[0].save();
              await playersInRoom[1].save();
              playersInRoom = await user.findAll({ where: { ROOMID: roomObj?.ID }, order: [['ID', 'ASC']]});
              const playersOutput = playersInRoom.map((player: User) => {return player.getUserOutput()});

              io.to(roomObj.NAME).emit("onPlayersChange", playersOutput);
              io.to(playersInRoom[0].getSocketID()).emit("playerAvailable");
              io.to(playersInRoom[1].getSocketID()).emit("playerAvailable");
            
            }, 2500);
          }else{
            io.emit("waitingPlayer", "Waiting for player");
          }
          
        } catch (error) {
          io.emit("waitingPlayer", "Waiting for player");
        }
    }

    playersInRoom = await user.findAll({ where: { ROOMID: roomObj?.ID }, order: [['ID', 'ASC']]});
    const playersOutput = playersInRoom.map((player: User) => {return player.getUserOutput()});

    io.to(roomObj.NAME).emit("onPlayersChange", playersOutput);

    io.to(roomObj.NAME).emit("onPlayersChange", playersOutput);
  };

  return { onDisconnecting };
};
