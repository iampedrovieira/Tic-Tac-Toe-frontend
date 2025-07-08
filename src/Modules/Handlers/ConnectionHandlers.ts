import { Socket } from "socket.io";
import RoomModel from "../../../models/Room";
import UserModel, { User } from "../../../models/User";
import GameModel from "../../../models/Game";
import { Sequelize } from "sequelize";



module.exports = (io: any,socket: Socket,sequelize: Sequelize) => {

  //Define global constants to connect to DB by sequelize
  const room = RoomModel(sequelize);
  const user = UserModel(sequelize);
  const game = GameModel(sequelize);

  const onNewPlayerJoin = async function (playerName: string, roomName: string) {
    
    let roomObj = await room.findOne({ where: { NAME: roomName }});

    if (roomObj == null) {
      //Create room on DB
      const newRoom = await room.create({ NAME: roomName });
      roomObj = newRoom;
    }

    const userObj = await user.create({
      NAME: playerName,
      SOCKETID: socket.id,
      ROOMID: roomObj.ID,
      OPTION: -1,
    });

    await userObj.save();

    //Create and send socket/player to the room
    socket.join(roomName);

    let playersInRoom = await roomObj.getPlayers();
  
    if(playersInRoom.length == 2){
       //Get first 2 players from the room and create a game with them in the DB
       const player1 = playersInRoom[0];
       const player2 = playersInRoom[1];
       player1.setOption(-2);
       player2.setOption(-2);
       await player1.save();
       await player2.save();

       const playersOutput = playersInRoom.map((player: User) => {return player.getUserOutput()});
       console.log(playersOutput);
       io.to(roomName).emit(
         "onPlayersChange",
         playersOutput
       );
       
       //emit to the player 1 and 2 players available
       io.to(player1.SOCKETID).emit('playerAvailable');
       io.to(player2.SOCKETID).emit('playerAvailable');
    }else{
      const gameObj = await roomObj.getGame();
      console.log(gameObj);
      playersInRoom = await roomObj.getPlayers();
      const playersOutput = playersInRoom.map((player: User) => {return player.getUserOutput()});
  
      if(playersInRoom.length > 2 && gameObj != null){        
  
        io.to(roomName).emit("gameStart", await gameObj.getGameInfoOutput());
       
        io.to(roomName).emit(
          "onPlayersChange",
          playersOutput
        );
      }else{
       
        io.to(roomName).emit(
          "onPlayersChange",
          playersOutput
        );
        socket.emit("waitingPlayer",'Waiting for player');
      }
    }
  };

  const onPlayerCheck = async function (roomName: string) {

    const roomObj = await room.findOne({ where: { NAME:roomName} });
    if(roomObj == null) return;
    const userObj = await user.findOne({ where: { SOCKETID: socket.id } });
    
    //Update the player option to -3
    userObj?.setOption(-3);
    await userObj?.save();

    let playersInRoom = await roomObj.getPlayers();
    //emit to the room the players
    //This is temporary, need to be fixed when the Models are finished
    let playersOutput = playersInRoom.map((player: User) => {return player.getUserOutput()});
  
    //Check if there are 2 players in the room with the option -3
    const playersReady = playersOutput.filter((player) => player.option == -3);
    if(playersReady.length == 2){
  
      const playerAllowed = Math.random() < 0.5 ? playersInRoom[0].SOCKETID : playersInRoom[1].SOCKETID;

      const gameObj = await game.create({ROOMID:roomObj.ID,PLAYER1:playersInRoom[0].SOCKETID,PLAYER2:playersInRoom[1].SOCKETID,PLAYERALLOWED:playerAllowed,DRAWS:0})
      //Update the player1 option to 0
      playersInRoom[0].setOption(0);
      await playersInRoom[0].save();
      //Update the player2 option to 1
      playersInRoom[1].setOption(1);
      await playersInRoom[1].save();

      playersInRoom = await user.findAll({ where: { ROOMID: roomObj?.ID }, order: [['ID', 'ASC']]});
      playersOutput = playersInRoom.map((player: User) => {return player.getUserOutput()});
      
      io.to(roomName).emit("gameStart", await gameObj.getGameInfoOutput());
    }

    io.to(roomName).emit("onPlayersChange", playersOutput);

  };

  const onPlayerUnCheck = async function (roomName: string) {
  
    const roomObj = await room.findOne({ where: { NAME:roomName} });
    if(roomObj == null) return;
    const userObj = await user.findOne({ where: { SOCKETID: socket.id } });
    //Update the player option to -2
    userObj?.setOption(-2);
    await userObj?.save();

    const playersInRoom = await user.findAll({ where: { ROOMID: roomObj?.ID }, order: [['ID', 'ASC']]});
    const playersOutput = playersInRoom.map((player: User) => {return player.getUserOutput()});
  
    io.to(roomName).emit("onPlayersChange", playersOutput);

  };
  return {
    onNewPlayerJoin,
    onPlayerCheck,
    onPlayerUnCheck,
  };
};


