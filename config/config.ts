import { SequelizeOptions } from 'sequelize-typescript';

const config: { [key: string]: SequelizeOptions } = {
  development: {
    username: process.env.DB_USERNAME || 'test',
    password: process.env.DB_PASSWORD || 'test',
    database: process.env.DB_NAME || 'tictactoe',
    host: process.env.DB_HOST || '172.17.0.1',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USERNAME || 'your_db_username',
    password: process.env.DB_PASSWORD || 'your_db_password',
    database: process.env.DB_NAME || 'your_db_name',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME || 'your_db_username',
    password: process.env.DB_PASSWORD || 'your_db_password',
    database: process.env.DB_NAME || 'your_db_name',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
};

export default config;
