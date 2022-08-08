import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

const configService = new ConfigService();

const typeOrmConfig = new DataSource({
  type: 'mysql',
  host: 'mysqldb',
  port: configService.get<number | undefined>('database.port'),
  database: configService.get<string>('database.name'),
  username: configService.get<string>('database.user'),
  password: configService.get<string>('database.pass'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  // Timezone configured on the MySQL server.
  // This is used to typecast server date/time values to JavaScript Date object and vice versa.
  timezone: 'Z',
  synchronize: false,
  debug: configService.get<string>('env') === 'development',
});

export default typeOrmConfig;
