import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import Move from "../src/Types/Move";
import {User} from './User';
import StatusGame from "../src/Types/StatusGame";
import { publicDecrypt } from "crypto";

interface GameAttributes {
  ID: number;
  GAMESTATE:number[][];
  PLAYSHISTORIC:number[][];
  POSTIONREMOVE:number[];
  PLAYER1:string;
  PLAYER2:string;
  PLAYERALLOWED:string;
  DRAWS:number;
  ROOMID:number;
}
interface GameCreationAttributes extends Optional<GameAttributes, 'ID'|'GAMESTATE'|'PLAYSHISTORIC'|'POSTIONREMOVE'> {}
export class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
  public ID!: number;
  public GAMESTATE!: number[][];
  public PLAYSHISTORIC!: number[][];
  public POSTIONREMOVE!: number[];
  public PLAYER1!: string;
  public PLAYER2!: string;
  public PLAYERALLOWED!: string;
  public DRAWS!: number;
  public ROOMID!:number;

  // Define associations
  static associate(models: any) {
    Game.belongsTo(models.Room, { foreignKey: 'ROOMID' });
  }

  public async getGameInfoOutput(){

    const player1Obj = await User.findOne({ where: { SOCKETID: this.PLAYER1 } });
    const player2Obj = await User.findOne({ where: { SOCKETID: this.PLAYER2 } });

    return {
      gameState: this.GAMESTATE,
      player1: player1Obj?.getUserOutput(),
      player2: player2Obj?.getUserOutput(),
      playerAllowed: this.PLAYERALLOWED,
      positionRemove:this.POSTIONREMOVE,
      draws: this.DRAWS
    }
  }

  // Add your custom methods here
  public move(playerMove: Move, playerId: string): StatusGame {
    // Update game state logic
    if (playerId != this.PLAYERALLOWED) {
      return {
        win: false,
        playerWin: '',
        playerWinOption: -1,
        draw: false,
        message: 'Not allowed to play',
      };
    }

    // Verify if play is possible
    if (this.GAMESTATE[playerMove.positionX][playerMove.positionY] != -1) {
      return {
        win: false,
        playerWin: '',
        playerWinOption: -1,
        draw: false,
        message: 'Cannot play here',
      };
    }

    let playerOption: number = -1;
    
    if (this.PLAYER1 == playerId) {
      playerOption = 0; // Assuming option 0 for player1
      this.GAMESTATE[playerMove.positionX][playerMove.positionY] = playerOption;
      this.PLAYERALLOWED = this.PLAYER2;
    } else if (this.PLAYER2 == playerId) {
      playerOption = 1; // Assuming option 1 for player2
      this.GAMESTATE[playerMove.positionX][playerMove.positionY] = playerOption;
      this.PLAYERALLOWED = this.PLAYER1;
    }
    
    this.PLAYSHISTORIC.push([playerMove.positionX,playerMove.positionY]);

    //After player play
    if(this.POSTIONREMOVE.length > 0){
      this.GAMESTATE[this.POSTIONREMOVE[0]][this.POSTIONREMOVE[1]] = -1;
      this.POSTIONREMOVE = []
    }

    //Before next player play
    if(this.PLAYSHISTORIC.length === 6){
      this.POSTIONREMOVE = this.PLAYSHISTORIC.shift()!;
    }

    

    let winOption: number = -1;

    // Check lines
    if (this.GAMESTATE[0][0] == this.GAMESTATE[0][1] && this.GAMESTATE[0][1] == this.GAMESTATE[0][2] && this.GAMESTATE[0][2] != -1)
      winOption = this.GAMESTATE[0][2];
    if (this.GAMESTATE[1][0] == this.GAMESTATE[1][1] && this.GAMESTATE[1][1] == this.GAMESTATE[1][2] && this.GAMESTATE[1][2] != -1)
      winOption = this.GAMESTATE[1][2];
    if (this.GAMESTATE[2][0] == this.GAMESTATE[2][1] && this.GAMESTATE[2][1] == this.GAMESTATE[2][2] && this.GAMESTATE[2][2] != -1)
      winOption = this.GAMESTATE[2][2];

    // Check columns
    if (this.GAMESTATE[0][0] == this.GAMESTATE[1][0] && this.GAMESTATE[1][0] == this.GAMESTATE[2][0] && this.GAMESTATE[2][0] != -1)
      winOption = this.GAMESTATE[2][0];
    if (this.GAMESTATE[0][1] == this.GAMESTATE[1][1] && this.GAMESTATE[1][1] == this.GAMESTATE[2][1] && this.GAMESTATE[2][1] != -1)
      winOption = this.GAMESTATE[2][1];
    if (this.GAMESTATE[0][2] == this.GAMESTATE[1][2] && this.GAMESTATE[1][2] == this.GAMESTATE[2][2] && this.GAMESTATE[2][2] != -1)
      winOption = this.GAMESTATE[2][2];

    // Check diagonals
    if (this.GAMESTATE[0][0] == this.GAMESTATE[1][1] && this.GAMESTATE[1][1] == this.GAMESTATE[2][2] && this.GAMESTATE[2][2] != -1)
      winOption = this.GAMESTATE[2][2];
    if (this.GAMESTATE[2][0] == this.GAMESTATE[1][1] && this.GAMESTATE[1][1] == this.GAMESTATE[0][2] && this.GAMESTATE[0][2] != -1)
      winOption = this.GAMESTATE[0][2];

    // Check draw
    let isDraw: boolean = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.GAMESTATE[i][j] == -1 || winOption != -1) {
          isDraw = false;
          break;
        }
      }
      if (!isDraw) break;
    }
    //New feature logic (first in firt out)
    
    
    // Explicitly set the gameState to ensure Sequelize recognizes the change
    this.changed('GAMESTATE',true)
    this.changed('PLAYSHISTORIC',true)
    this.changed('POSTIONREMOVE',true)

    if (isDraw) {
      return {
        win: false,
        playerWin: '',
        playerWinOption: -1,
        draw: true,
        message: '',
      };
    }

    if (winOption != -1) {
      return {
        win: true,
        playerWin: playerId,
        playerWinOption: playerOption,
        draw: false,
        message: '',
      };
    }

    return {
      win: false,
      playerWin: '',
      playerWinOption: -1,
      draw: false,
      message: '',
    };
  }

  public restart() {
    this.GAMESTATE = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
    this.PLAYSHISTORIC = [];
    this.POSTIONREMOVE = [];
    // Explicitly set the gameState to ensure Sequelize recognizes the change
    this.changed('GAMESTATE',true)
    this.changed('GAMESTATE',true)
    this.changed('PLAYSHISTORIC',true)
    this.changed('POSTIONREMOVE',true)
  }

  //Create setters and getters
  public getGameState():number[][]{
    return this.GAMESTATE;
  }

  public getPlayer1():string{
    return this.PLAYER1;
  }
  public getPlayer2():string{
    return this.PLAYER2;
  }
  public getPlayerAllowed():string{
    return this.PLAYERALLOWED;
  }
  public getDraws():number{
    return this.DRAWS;
  }
  public getRoomID():number{
    return this.ROOMID;
  }
  public setGameState(GAMESTATE:number[][]){
    this.GAMESTATE = GAMESTATE;
  }
  public setPlayer1(PLAYER1:string){
    this.PLAYER1 = PLAYER1;
  }
  public setPlayer2(PLAYER2:string){
    this.PLAYER2 = PLAYER2;
  }
  public setPlayerAllowed(PLAYERALLOWED:string){
    this.PLAYERALLOWED = PLAYERALLOWED;
  }
  public setDraws(DRAWS:number){
    this.DRAWS = DRAWS;
  }
  
}

function GameModel(sequelize: Sequelize) {

  // Initialize the Game model
  Game.init(
    {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      GAMESTATE: {
        type: DataTypes.JSONB, // Store game state as JSON
        allowNull: false,
        defaultValue: [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]],
      },
      PLAYSHISTORIC: {
        type: DataTypes.JSONB, // Store game state as JSON
        allowNull: false,
        defaultValue: [],
      },
      POSTIONREMOVE: {
        type: DataTypes.JSONB, // Store game state as JSON
        allowNull: false,
        defaultValue: [],
      },
      PLAYER1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PLAYER2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PLAYERALLOWED: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ROOMID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'ROOM', // 'rooms' refers to table name
          key: 'ID',
        },
      },
      DRAWS: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'GAME',
      sequelize, // passing the `sequelize` instance is required
    }
  );

  return Game;
}

export default GameModel;
