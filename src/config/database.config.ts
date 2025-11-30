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
      // В проде по умолчанию выключено. Можно принудительно включить через DB_SYNC=true
      synchronize:
        process.env.DB_SYNC === 'true' || process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    } as TypeOrmModuleOptions;
  },
);

