import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import {User} from './User';
import {Game} from './Game';

interface RoomAttributes {
  ID: number;
  NAME: string;
}

interface RoomCreationAttributes extends Optional<RoomAttributes, 'ID'> {}

export class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes{
  
  public ID!: number;
  public NAME!: string;
  // Define associations if needed
  static associate(models: any) {
      Room.hasMany(models.User, { foreignKey: 'ROOMID' })
      Room.hasOne(models.Game, { foreignKey: 'ROOMID' })
     }
     
  public async getPlayers() {
    const allUsers = await User.findAll({ where: { ROOMID: this.ID }, order: [['ID', 'ASC']]});
    
    return allUsers;
  }
  public async getGame() {
    const game = await Game.findOne({ where: { ROOMID: this.ID } });
    return game;
  }
  
  //Create setters and getters
  public getName():string{
    return this.NAME;
  }
  public setName(NAME:string){
    this.NAME = NAME;
  }
  
}

function RoomModel (sequelize:Sequelize){
      Room.init(
        {
          ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          NAME: {
            type: new DataTypes.STRING(128),
            allowNull: false,
          },
        },
        {
          tableName: 'ROOM',
          sequelize,
        }
      );
    
    return Room;
}

export default RoomModel;

