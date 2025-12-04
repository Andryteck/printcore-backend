import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

async function initDatabase() {
  const dbFile = process.env.DB_FILE || 'printcore.db';
  const dbDir = path.dirname(dbFile);
  
  console.log('\n🔄 Инициализация базы данных...');
  console.log(`📁 Файл базы данных: ${dbFile}`);
  console.log(`📂 Директория: ${dbDir}`);
  
  // Создаём директорию если не существует
  if (!fs.existsSync(dbDir)) {
    console.log(`📁 Создаю директорию: ${dbDir}`);
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Проверяем существование базы данных
  const dbExists = fs.existsSync(dbFile);
  if (dbExists) {
    console.log('ℹ️  База данных уже существует');
  } else {
    console.log('🆕 Создаю новую базу данных');
  }

  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbFile,
    entities: [path.join(__dirname, '../**/*.entity.{ts,js}')],
    synchronize: true, // Принудительно создаем/обновляем таблицы
    logging: process.env.NODE_ENV !== 'production',
  });

  try {
    console.log('🔌 Подключение к базе данных...');
    await dataSource.initialize();
    
    // Получаем список таблиц
    const queryRunner = dataSource.createQueryRunner();
    const tables = await queryRunner.getTables();
    await queryRunner.release();
    
    console.log('✅ База данных инициализирована успешно!');
    console.log(`📊 Таблицы (${tables.length}):`, tables.map(t => t.name).join(', '));
    
    await dataSource.destroy();
    console.log('✅ Инициализация завершена\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Ошибка инициализации базы данных:');
    console.error(error);
    console.error('\n💡 Проверьте:');
    console.error('  1. Права доступа к директории');
    console.error('  2. Наличие свободного места на диске');
    console.error('  3. Правильность пути к базе данных\n');
    process.exit(1);
  }
}

// Запускаем инициализацию
initDatabase().catch((error) => {
  console.error('💥 Неожиданная ошибка:', error);
  process.exit(1);
});

