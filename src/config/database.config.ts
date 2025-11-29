import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    // SQLite - легкая и быстрая локальная база данных
    // Определяем путь к базе данных
    // На Railway используем persistent volume /app/data
    // Локально используем корневую директорию проекта
    const dbPath = process.env.DB_FILE || 
      (process.env.NODE_ENV === 'production' 
        ? '/app/data/printcore.db' 
        : 'printcore.db');
    
    console.log('[Database Config] Database path:', dbPath);
    console.log('[Database Config] NODE_ENV:', process.env.NODE_ENV);
    console.log('[Database Config] DB_SYNC:', process.env.DB_SYNC);
    
    // В production НИКОГДА не используем synchronize=true автоматически
    // synchronize=true может привести к потере данных при изменении схемы
    // Включается только явно через DB_SYNC=true
    const shouldSynchronize = process.env.DB_SYNC === 'true';
    
    console.log('[Database Config] Synchronize enabled:', shouldSynchronize);
    
    if (shouldSynchronize && process.env.NODE_ENV === 'production') {
      console.warn('[Database Config] WARNING: Synchronize is enabled in production! This can cause data loss.');
    }
    
    const config: TypeOrmModuleOptions = {
      type: 'better-sqlite3',
      database: dbPath,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      // В production синхронизация отключена по умолчанию для безопасности
      // Включается только явно через DB_SYNC=true
      synchronize: shouldSynchronize,
      logging: process.env.NODE_ENV !== 'production',
      // КРИТИЧЕСКИ ВАЖНО: Отключаем все операции, которые могут удалить данные
      dropSchema: false, // Никогда не удаляем схему
      migrationsRun: false, // Не запускаем миграции автоматически
      // Дополнительная защита от потери данных
      extra: {
        // SQLite настройки для безопасности
        enableWAL: true, // Write-Ahead Logging для лучшей производительности и надежности
      },
    };
    
    // Дополнительная проверка в production
    if (process.env.NODE_ENV === 'production') {
      if (config.synchronize) {
        console.error('[Database Config] КРИТИЧЕСКАЯ ОШИБКА: synchronize=true в production!');
        console.error('[Database Config] Это может привести к потере данных!');
        throw new Error('synchronize не может быть включен в production без явного DB_SYNC=true');
      }
      console.log('[Database Config] Production режим: все операции изменения схемы отключены');
    }
    
    return config;
  },
);

