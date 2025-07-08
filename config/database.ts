//database connection

import { Sequelize } from 'sequelize-typescript';
import config from './config';
// Import your models
import UserModel from '../models/User';
import RoomModel from '../models/Room';
import GameModel from '../models/Game';

export async function initSequelizeDatabase(){
    const env = process.env.NODE_ENV || 'development';
    const sequelizeConfig = config[env];
    
    const sequelize = new Sequelize(sequelizeConfig);
    
    const User = UserModel(sequelize);
    const Room = RoomModel(sequelize);
    const Game = GameModel(sequelize);
    
    //This is to sync sequielize modes to db (only in dev mode)
    await sequelize.sync({ force: true }); // Set to `true` to drop and recreate tables
    const newRoom = await Room.create({ NAME:'LOBBY'});
    return sequelize
}