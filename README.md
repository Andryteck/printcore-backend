# PrintCore Backend API

Backend сервер на NestJS для сайта типографии PrintCore с полным функционалом авторизации, управления услугами и заказами.

## 🚀 Технологии

- **NestJS** 11 - современный Node.js фреймворк
- **TypeORM** - ORM для работы с базой данных
- **SQLite** - легкая и быстрая локальная база данных
- **JWT** - авторизация через токены
- **Passport** - middleware для авторизации
- **Swagger** - автоматическая документация API
- **Class Validator** - валидация данных

## 📁 Структура проекта

```
printcore-backend/
├── src/
│   ├── auth/                  # Модуль авторизации
│   │   ├── dto/               # DTO для регистрации и входа
│   │   ├── guards/            # JWT Guard
│   │   ├── strategies/        # JWT Strategy
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── users/                 # Модуль пользователей
│   │   ├── entities/          # User entity
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── services/              # Модуль услуг
│   │   ├── dto/               # DTO для услуг
│   │   ├── entities/          # Service entity
│   │   ├── services.controller.ts
│   │   ├── services.service.ts
│   │   └── services.module.ts
│   │
│   ├── orders/                # Модуль заказов
│   │   ├── dto/               # DTO для заказов
│   │   ├── entities/          # Order entity
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── orders.module.ts
│   │
│   ├── config/                # Конфигурация
│   │   └── database.config.ts
│   │
│   ├── app.module.ts          # Главный модуль
│   └── main.ts                # Точка входа
│
├── .env                       # Переменные окружения
├── printcore.db               # SQLite база данных
└── package.json
```

## 🔧 Установка

### 1. Установите зависимости

```bash
npm install
```

### 2. Настройте переменные окружения

Скопируйте `ENV_EXAMPLE.txt` в `.env`:

```env
# SQLite база данных (локальный файл)
DB_FILE=printcore.db

# JWT авторизация
JWT_SECRET=printcore_secret_key_2025_change_me_in_production
JWT_EXPIRES_IN=7d

# Сервер
PORT=3001
NODE_ENV=development

# Frontend URL для CORS
FRONTEND_URL=http://localhost:3000
```

SQLite база данных создастся автоматически при первом запуске.

### 3. Запустите сервер

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 API Документация

После запуска сервера документация Swagger доступна по адресу:

**http://localhost:3001/api/docs**

## 🔐 API Endpoints

### Auth (Авторизация)

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/auth/register` | Регистрация | ❌ |
| POST | `/api/auth/login` | Вход | ❌ |

**Пример регистрации:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "Иван Иванов",
    "phone": "+375 29 123-45-67"
  }'
```

**Ответ:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Иван Иванов",
    "phone": "+375 29 123-45-67",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Users (Пользователи)

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/users/me` | Текущий пользователь | ✅ |
| PATCH | `/api/users/me` | Обновить профиль | ✅ |
| GET | `/api/users/:id` | Пользователь по ID | ✅ |

### Services (Услуги)

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/services` | Список услуг | ❌ |
| GET | `/api/services?category=digital` | Услуги по категории | ❌ |
| GET | `/api/services/:id` | Услуга по ID | ❌ |
| POST | `/api/services` | Создать услугу | ✅ Admin |
| PATCH | `/api/services/:id` | Обновить услугу | ✅ Admin |
| DELETE | `/api/services/:id` | Удалить услугу | ✅ Admin |

### Orders (Заказы)

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| GET | `/api/orders` | Мои заказы | ✅ |
| GET | `/api/orders/:id` | Заказ по ID | ✅ |
| POST | `/api/orders` | Создать заказ | ✅ |
| PATCH | `/api/orders/:id` | Обновить заказ | ✅ |
| DELETE | `/api/orders/:id` | Удалить заказ | ✅ |

## 🔑 Авторизация

Все защищенные эндпоинты требуют JWT токен в header:

```bash
Authorization: Bearer <your-jwt-token>
```

**Пример:**
```bash
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🗄️ База данных

### Entities

#### User (Пользователи)
- id (UUID)
- email (unique)
- password (hashed)
- name
- phone
- role ('user' | 'admin')
- isActive
- createdAt, updatedAt

#### Service (Услуги)
- id (UUID)
- title
- description
- category
- basePrice
- image
- isActive
- options (JSON)
- createdAt, updatedAt

#### Order (Заказы)
- id (UUID)
- orderNumber (unique)
- userId (FK → User)
- serviceId
- serviceName
- quantity
- price
- total
- status (enum)
- options (JSON)
- files (JSON array)
- notes
- completionDate
- createdAt, updatedAt

### Статусы заказов

- `pending` - Ожидает обработки
- `processing` - В работе
- `ready` - Готов к выдаче
- `completed` - Выполнен
- `cancelled` - Отменен

## 🔄 Интеграция с Frontend

В вашем frontend (printcore_website) обновите `authService.ts`:

```typescript
// lib/services/authService.ts
const API_URL = 'http://localhost:3001/api';

export const authService = {
  async register(data: RegisterData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    const { user, token } = await response.json();
    localStorage.setItem('auth_token', token);
    return user;
  },
  
  async login(credentials: LoginCredentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    const { user, token } = await response.json();
    localStorage.setItem('auth_token', token);
    return user;
  },
  
  async getCurrentUser() {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      localStorage.removeItem('auth_token');
      return null;
    }
    
    return response.json();
  },
};
```

## 🧪 Тестирование API

### Используя Swagger UI

1. Перейдите на http://localhost:3001/api/docs
2. Используйте "Try it out" для тестирования endpoints
3. Для protected routes: нажмите "Authorize" и введите JWT токен

### Используя cURL

```bash
# Регистрация
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Вход
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Получить профиль
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Создать заказ
curl -X POST http://localhost:3001/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId":"uuid",
    "serviceName":"Визитки",
    "quantity":500,
    "price":25
  }'
```

## 📦 Скрипты

```bash
# Разработка
npm run start:dev

# Сборка
npm run build

# Production
npm run start:prod

# Тесты
npm run test
npm run test:e2e

# Linting
npm run lint
npm run format
```

## 💾 База данных

Используется **SQLite** - легкая встраиваемая БД, которая хранится в файле `printcore.db`.

**Преимущества SQLite:**
- ✅ Не требует отдельного сервера БД
- ✅ Быстрая для небольших и средних приложений
- ✅ Идеальна для разработки и деплоя
- ✅ Автоматическое создание при первом запуске

**Управление данными:**
```bash
# Удалить базу данных
rm printcore.db

# База создастся заново при следующем запуске
npm run start:dev
```

## 🔒 Безопасность

1. **Пароли**: Хешируются с помощью bcrypt
2. **JWT**: Подписываются секретным ключом
3. **CORS**: Настроен только для вашего frontend
4. **Validation**: Все входные данные валидируются
5. **Guards**: Защита эндпоинтов через JWT

## 🚀 Деплой

### На Railway (Рекомендуется)

**Автоматический деплой с `railway.toml`:**

1. Создайте GitHub репозиторий с вашим кодом
2. Зарегистрируйтесь на [railway.app](https://railway.app)
3. Нажмите "Deploy from GitHub"
4. Выберите ваш репозиторий
5. Railway автоматически:
   - Создаст persistent volume из `railway.toml`
   - Установит зависимости
   - Запустит проект

**Настройте переменные окружения:**
```env
DB_FILE=/app/data/printcore.db
JWT_SECRET=ваш_безопасный_ключ_production
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://printcore.by
```

📚 **Подробная инструкция:** см. `RAILWAY_DEPLOYMENT.md`

### На Render

1. Создайте новый Web Service
2. Подключите GitHub репозиторий
3. Добавьте Disk в настройках:
   - Mount Path: `/app/data`
4. Установите `DB_FILE=/app/data/printcore.db`

**Важно:** Без persistent volume база данных будет очищаться при каждом деплое!

### На VPS

```bash
# Установка зависимостей
npm install --production

# Сборка
npm run build

# Запуск с PM2
pm2 start dist/main.js --name printcore-api

# Nginx конфигурация
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## 📝 TODO

- [ ] Добавить загрузку файлов (multer)
- [ ] Добавить модуль Blog
- [ ] Добавить модуль Portfolio
- [ ] Email уведомления
- [ ] Роли и permissions
- [ ] Rate limiting
- [ ] Логирование
- [ ] Migrations (TypeORM)
- [ ] Unit тесты
- [ ] E2E тесты

## 🤝 Вклад

Создан для проекта PrintCore Website.

## 📄 Лицензия

© 2024 PrintCore. Все права защищены.

---

**Готов к работе! 🎉**
