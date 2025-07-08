import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Socket } from 'socket.io';

interface UserAttributes {
  ID: number;
  NAME: string;
  SOCKETID: string;
  OPTION:number; // -1 initial, -2 not checked, -3 checked, 0 and 1 game option
  //WINS?:number;
  //LOSSES?:number;
  ROOMID?:number;
  //EMAIL?: string;
  //GOOGLEID?: string;

}


interface UserCreationAttributes extends Optional<UserAttributes, 'ID'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public ID!: number;
  public NAME!: string;
  public SOCKETID!: string;
  public OPTION!:number;
  public ROOMID?: number;
  // Define associations if needed
  static associate(models: any) {
    User.belongsTo(models.Room, { foreignKey: 'ROOMID' });
  }

  public getUserOutput(){
    return {
      id: this.SOCKETID,
      name: this.NAME,
      option: this.OPTION,
      wins:0,
      losses:0,
      draws:0
    }
  }
  //Create setters and getters 
  public getName():string{
    return this.NAME;
  }
  public getSocketID():string{
    return this.SOCKETID;
  }
  public getOption():number{
    return this.OPTION;
  }
  public getRoomID():number|undefined{
    return this.ROOMID;
  }
  public setName(NAME:string){
    this.NAME = NAME;
  }
  public setSocketID(SOCKETID:string){
    this.SOCKETID = SOCKETID;
  }
  public setOption(OPTION:number){
    this.OPTION = OPTION;
  }
  
}

 function UserModel (sequelize:Sequelize){
  
    User.init(
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
        OPTION: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        SOCKETID: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        ROOMID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: 'ROOM', // 'rooms' refers to table name
              key: 'ID',
            },
          }
      },
      {
        tableName: 'USER',
        sequelize, // passing the `sequelize` instance is required
      }
    );

    
  return User
}

export default UserModel;

