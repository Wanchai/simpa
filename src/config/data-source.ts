import { DataSource } from 'typeorm';
import { BetterSqlite3ConnectionOptions } from 'typeorm/driver/better-sqlite3/BetterSqlite3ConnectionOptions';

export const sqliteOptions: BetterSqlite3ConnectionOptions = {
  type: 'better-sqlite3',
  database: 'data/simpa.db',
  logging: ['error'],
  entities: [__dirname + '/../modules/sites/entities/*.js'],
  migrations: [__dirname + '/../migrations/**/*.js'],
};

export const AppDataSource = new DataSource(sqliteOptions);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
