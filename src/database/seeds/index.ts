import { DataSource } from 'typeorm';
import config from '../../config/config-database';
import createTags from './createTag';

const AppDataSource = new DataSource(config);

AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');

    const tags = await createTags(AppDataSource);
    return [tags];
  })
  .then(() => {
    AppDataSource.destroy();
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
