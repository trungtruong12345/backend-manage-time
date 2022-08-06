import { DataSourceOptions } from 'typeorm';
import { config as configEnv } from 'dotenv';

configEnv();

const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: ['@/src/**/*.entity.ts', './dist/**/*.entity.js'],
  synchronize: true,
  logging: true,
};

export default config;
