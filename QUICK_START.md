# ⚡ Быстрый старт - PrintCore Backend

## ✅ Что уже настроено

- ✅ NestJS 11 установлен
- ✅ SQLite база данных (локальная)
- ✅ TypeORM настроен
- ✅ JWT авторизация
- ✅ 4 модуля: Auth, Users, Services, Orders
- ✅ Swagger документация
- ✅ Валидация данных
- ✅ .env файл настроен

## 🚀 Запуск

```bash
cd C:\Users\Core\Desktop\PrintCore\printcore-backend
npm run start:dev
```

Сервер запустится на: **http://localhost:3001**

## 📚 Swagger документация

После запуска откройте: **http://localhost:3001/api/docs**

Там вы увидите все доступные API endpoints:
- 🔐 Auth (регистрация, вход)
- 👤 Users (профиль, обновление)
- 🛍️ Services (услуги)
- 📦 Orders (заказы)

## 🧪 Тестирование API

### 1. Регистрация

**POST** `http://localhost:3001/api/auth/register`

Body:
```json
{
  "email": "test@printcore.by",
  "password": "test123",
  "name": "Тест Пользователь",
  "phone": "+375 29 123-45-67"
}
```

Ответ:
```json
{
  "user": {
    "id": "uuid",
    "email": "test@printcore.by",
    "name": "Тест Пользователь",
    ...
  },
  "token": "eyJhbGciOiJIUzI1..."
}
```

### 2. Вход

**POST** `http://localhost:3001/api/auth/login`

Body:
```json
{
  "email": "test@printcore.by",
  "password": "test123"
}
```

### 3. Получить профиль

**GET** `http://localhost:3001/api/users/me`

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1...
```

### 4. Создать заказ

**POST** `http://localhost:3001/api/orders`

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1...
```

Body:
```json
{
  "serviceId": "1",
  "serviceName": "Визитки 500 шт",
  "quantity": 500,
  "price": 25,
  "notes": "Матовая ламинация"
}
```

## 🔗 Endpoints

### Auth (без токена)
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход

### Users (с токеном)
- `GET /api/users/me` - Мой профиль
- `PATCH /api/users/me` - Обновить профиль

### Services (публичные)
- `GET /api/services` - Все услуги
- `GET /api/services?category=digital` - По категории
- `GET /api/services/:id` - Одна услуга

### Orders (с токеном)
- `GET /api/orders` - Мои заказы
- `POST /api/orders` - Создать заказ
- `GET /api/orders/:id` - Детали заказа
- `PATCH /api/orders/:id` - Обновить заказ

## 🗄️ База данных

Используется **SQLite** - локальная база данных в файле `printcore.db`.

**Преимущества:**
- ✅ Не требует установки отдельного сервера БД
- ✅ Автоматически создается при первом запуске
- ✅ Легко удалить и пересоздать

## 📊 Таблицы (создаются автоматически)

- `users` - Пользователи
- `services` - Услуги
- `orders` - Заказы

**Сброс базы данных:**
```bash
rm printcore.db
npm run start:dev  # База создастся заново
```

## 🔄 Интеграция с Frontend

В `printcore_website/lib/services/authService.ts` замените URL:

```typescript
const API_URL = 'http://localhost:3001/api';

export const authService = {
  async register(data: RegisterData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    
    localStorage.setItem('auth_token', result.token);
    return result.user;
  },
  
  async login(credentials: LoginCredentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    
    localStorage.setItem('auth_token', result.token);
    return result.user;
  },
};
```

## 🎯 Полезные команды

```bash
# Запуск dev
npm run start:dev

# Сборка
npm run build

# Production
npm run start:prod

# Просмотр логов БД
npm run typeorm -- query "SELECT * FROM users"
```

## 📞 Проверка работы

После запуска `npm run start:dev` вы должны увидеть:

```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] INFO [InstanceLoader] ConfigHostModule dependencies initialized
[Nest] LOG Successfully connected to database ✅
[Nest] INFO [RoutesResolver] AuthController {/api/auth}
[Nest] INFO [RoutesResolver] UsersController {/api/users}
[Nest] INFO [RoutesResolver] ServicesController {/api/services}
[Nest] INFO [RoutesResolver] OrdersController {/api/orders}
[Nest] INFO [NestApplication] Nest application successfully started

🚀 Server is running on: http://localhost:3001
📚 Swagger docs: http://localhost:3001/api/docs
```

## ✅ Готово!

Backend полностью настроен и готов к работе! 🎉

---

**Откройте http://localhost:3001/api/docs для тестирования API!**





