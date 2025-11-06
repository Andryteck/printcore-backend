import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    // SQLite - легкая и быстрая локальная база данных
    return {
      type: 'better-sqlite3',
      database: process.env.DB_FILE || 'printcore.db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    } as TypeOrmModuleOptions;
  },
);

