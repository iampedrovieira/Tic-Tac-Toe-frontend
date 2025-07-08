
async function startServer() {
   
    const {initSequelizeDatabase} = require('./../config/database'); // Import Sequelize instance
    const sequelize = await initSequelizeDatabase()
    const express = require("express");
    const app = express();

    const io = require('./Connections/SocketConnection')(app,8080);
 
    require('./Modules/SocketListeners')(io,sequelize);

}
startServer()
