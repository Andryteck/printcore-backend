import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    // Если есть DATABASE_URL (Railway PostgreSQL), используем PostgreSQL
    // Иначе используем SQLite для локальной разработки
    const databaseUrl = process.env.DATABASE_URL;
    
    if (databaseUrl) {
      // PostgreSQL для Railway/Production/любого внешнего провайдера
      // Поддерживает: Railway PostgreSQL, Supabase, Neon, собственный PostgreSQL и др.
      console.log('📊 Используется PostgreSQL (DATABASE_URL найден)');
      
      // Парсим DATABASE_URL (формат: postgresql://user:password@host:port/database)
      const url = new URL(databaseUrl);
      
      return {
        type: 'postgres',
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        username: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Убираем первый слэш
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.DB_SYNC === 'true' || process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      } as TypeOrmModuleOptions;
    } else {
      // SQLite для локальной разработки
      console.log('📊 Используется SQLite (локальная разработка)');
      
      return {
        type: 'better-sqlite3',
        database: process.env.DB_FILE || 'printcore.db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.DB_SYNC === 'true' || process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
      } as TypeOrmModuleOptions;
    }
  },
);

