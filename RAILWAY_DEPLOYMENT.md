# 🚂 Деплой на Railway - Пошаговая инструкция

## 📋 Что понадобится
- GitHub аккаунт
- Railway аккаунт (бесплатная регистрация через GitHub)
- Ваш код в GitHub репозитории

---

## 🚀 Шаг 1: Подготовка проекта

### 1.1. Создайте GitHub репозиторий

```bash
cd dev/printcore-backend
git init
git add .
git commit -m "Initial commit - PrintCore Backend with SQLite"
git branch -M main
git remote add origin https://github.com/ваш-username/printcore-backend.git
git push -u origin main
```

---

## 🎯 Шаг 2: Деплой на Railway

### 2.1. Создайте проект

1. Откройте [railway.app](https://railway.app)
2. Нажмите **"Start a New Project"**
3. Выберите **"Deploy from GitHub repo"**
4. Найдите и выберите `printcore-backend`
5. Railway автоматически начнет деплой

### 2.2. Настройте переменные окружения

В Railway Dashboard → ваш проект → **Variables**:

```env
# База данных (ВАЖНО: путь для persistent storage)
DB_FILE=/app/data/printcore.db

# JWT
JWT_SECRET=смените_на_безопасный_ключ_production_12345678
JWT_EXPIRES_IN=7d

# Сервер
PORT=3001
NODE_ENV=production

# Frontend URL (обновите после деплоя frontend)
FRONTEND_URL=https://printcore.by
```

⚠️ **Важно:** Измените `JWT_SECRET` на уникальный безопасный ключ!

### 2.3. Настройте Persistent Storage

**Автоматически:**
Railway должен автоматически создать volume из `railway.toml` файла.

**Вручную (если не создался):**
1. В Railway Dashboard → ваш проект
2. Перейдите в **Data** или **Volumes**
3. Нажмите **"Add Volume"**
4. Заполните:
   - **Name**: `printcore-data`
   - **Mount Path**: `/app/data`
5. Нажмите **"Add"**

### 2.4. Получите URL

После успешного деплоя Railway даст вам URL типа:
```
https://printcore-backend-production.up.railway.app
```

Сохраните его - он понадобится для frontend.

---

## ✅ Шаг 3: Проверка деплоя

### 3.1. Проверьте логи

В Railway Dashboard → **Deployments** → кликните на активный деплой → **View Logs**

Должны увидеть:
```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] LOG Successfully connected to database ✅
[Nest] INFO [NestApplication] Nest application successfully started
🚀 Server is running on: http://[::]:3001
```

### 3.2. Проверьте API

Откройте в браузере:
```
https://ваш-railway-url.up.railway.app/api/docs
```

Должна открыться Swagger документация.

### 3.3. Тест регистрации

В Swagger или через curl:
```bash
curl -X POST https://ваш-railway-url.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@printcore.by",
    "password": "test123",
    "name": "Test User",
    "phone": "+375291234567"
  }'
```

Должны получить токен и данные пользователя.

### 3.4. Проверьте Persistent Storage

1. Создайте тестового пользователя через API
2. В Railway: **Settings** → **Redeploy**
3. После redeploy попробуйте войти с теми же данными
4. ✅ Если вход успешен - persistent storage работает!

---

## 🔧 Шаг 4: Дополнительные настройки

### 4.1. Custom Domain (опционально)

1. Railway Dashboard → ваш проект → **Settings**
2. Прокрутите до **Domains**
3. Нажмите **"Generate Domain"** для поддомена Railway
4. Или нажмите **"Custom Domain"** для своего домена

Для `api.printcore.by`:
1. Добавьте в Railway: `api.printcore.by`
2. Railway покажет CNAME запись
3. Добавьте CNAME в DNS hoster.by:
   ```
   Тип: CNAME
   Имя: api
   Значение: [что даст Railway].proxy.rlwy.net
   ```

### 4.2. Автоматический деплой

Railway автоматически делает деплой при push в `main` ветку!

Просто:
```bash
git add .
git commit -m "Update backend"
git push origin main
```

Railway сам задеплоит изменения.

---

## 📊 Мониторинг

### Логи
Railway Dashboard → ваш проект → **Deployments** → **View Logs**

### Метрики
Railway Dashboard → ваш проект → **Metrics**

Показывает:
- CPU usage
- Memory usage
- Network traffic
- Request count

---

## 💰 Стоимость

**Railway Hobby Plan:**
- **$5/месяц** или $500 бесплатных кредитов для новых аккаунтов
- Persistent volumes включены
- Автоматические деплои
- SSL сертификаты

---

## 🔄 Обновление Frontend URL

После деплоя backend обновите frontend:

**В `dev/printcore_website/.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://api.printcore.by
# или
NEXT_PUBLIC_API_URL=https://ваш-railway-url.up.railway.app/api
```

**В Railway (Backend) обновите:**
```env
FRONTEND_URL=https://printcore.by
```

---

## 🐛 Troubleshooting

### Проблема: База данных пустая после redeploy
**Решение:** Volume не настроен. Проверьте:
1. `railway.toml` в репозитории
2. Volume создан в Railway Dashboard
3. `DB_FILE=/app/data/printcore.db` в переменных окружения

### Проблема: CORS ошибки
**Решение:** 
1. Проверьте `FRONTEND_URL` в Railway
2. Убедитесь что frontend использует правильный API URL

### Проблема: 502 Bad Gateway
**Решение:**
1. Проверьте логи деплоя
2. Убедитесь что `PORT=3001` или используется `process.env.PORT`
3. Railway может назначить другой порт - проверьте в логах

### Проблема: JWT ошибки
**Решение:**
1. Убедитесь что `JWT_SECRET` одинаковый между деплоями
2. Не используйте дефолтный секрет в production!

---

## 📞 Полезные ссылки

- **Railway Docs:** https://docs.railway.app/
- **Railway Discord:** https://discord.gg/railway
- **Railway Status:** https://status.railway.app/

---

## ✅ Checklist

- [ ] Код в GitHub репозитории
- [ ] Проект создан на Railway
- [ ] Переменные окружения настроены
- [ ] `JWT_SECRET` изменен на безопасный
- [ ] Persistent Volume создан
- [ ] `DB_FILE=/app/data/printcore.db` установлен
- [ ] Деплой успешен (проверить логи)
- [ ] Swagger доступен по URL
- [ ] API отвечает на запросы
- [ ] Persistent storage работает (тест redeploy)
- [ ] CORS настроен для frontend
- [ ] Frontend URL обновлен

---

**Готово! Backend на Railway с SQLite и Persistent Storage! 🎉**

© 2025 PrintCore

