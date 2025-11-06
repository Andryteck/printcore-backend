# Mockups API - Backend Documentation

## Описание

REST API для управления макетами клиентов с использованием **Sharp** (обработка изображений) и **Multer** (загрузка файлов).

## 🛠️ Технологии

- **NestJS** - фреймворк для создания API
- **TypeORM** - ORM для работы с БД
- **SQLite** - база данных
- **Sharp** - обработка и оптимизация изображений
- **Multer** - загрузка файлов

## 📦 Установленные пакеты

```json
{
  "dependencies": {
    "sharp": "^0.33.x",
    "multer": "^2.0.2",
    "@types/multer": "^2.0.0"
  }
}
```

## 🗂️ Структура модуля

```
src/mockups/
├── entities/
│   └── mockup.entity.ts           # TypeORM Entity
├── dto/
│   ├── upload-mockup.dto.ts       # DTO для загрузки
│   └── query-mockups.dto.ts       # DTO для фильтрации
├── mockups.controller.ts          # HTTP контроллер
├── mockups.service.ts             # Бизнес-логика + Sharp
└── mockups.module.ts              # NestJS модуль
```

## 📊 Database Schema

### Mockup Entity

```typescript
@Entity('mockups')
export class Mockup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;              // Имя файла на сервере

  @Column()
  originalName: string;          // Оригинальное имя файла

  @Column()
  mimeType: string;              // MIME тип (image/jpeg, application/pdf)

  @Column({ type: 'int' })
  size: number;                  // Размер в байтах

  @Column({ nullable: true })
  thumbnailPath: string;         // Путь к превью

  @ManyToOne(() => User)
  user: User;                    // Связь с пользователем

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => Order)
  order: Order;                  // Связь с заказом

  @Column({ nullable: true })
  orderId: string;

  @Column({ type: 'text', nullable: true })
  description: string;           // Описание макета

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>; // Метаданные изображения

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 🚀 API Endpoints

### 1. Upload Mockup

**POST** `/api/mockups/upload`

Загрузка нового макета с автоматической обработкой через Sharp.

**Request:**
```typescript
Content-Type: multipart/form-data

{
  file: File,                    // Required
  userId?: string,               // Optional UUID
  orderId?: string,              // Optional UUID
  description?: string           // Optional
}
```

**Response:**
```json
{
  "success": true,
  "mockup": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fileName": "mockup_1699564800000_abc123xyz.jpg",
    "originalName": "my-design.jpg",
    "mimeType": "image/jpeg",
    "size": 2048576,
    "thumbnailPath": "thumb_mockup_1699564800000_abc123xyz.jpg",
    "userId": "user-uuid",
    "orderId": "order-uuid",
    "description": "Client design",
    "metadata": {
      "width": 3000,
      "height": 2000,
      "format": "jpeg",
      "space": "srgb",
      "density": 72
    },
    "createdAt": "2025-11-06T10:00:00.000Z",
    "updatedAt": "2025-11-06T10:00:00.000Z"
  },
  "message": "Макет успешно загружен"
}
```

**Sharp обработка:**
- Автоматическое создание превью (300x300px, JPEG 80%)
- Извлечение метаданных (размер, формат, цветовое пространство)
- Оптимизация изображения

**Ограничения:**
- Максимальный размер: 50 МБ
- Разрешенные типы: JPEG, PNG, GIF, WEBP, TIFF, PDF

### 2. Get All Mockups

**GET** `/api/mockups`

Получить список всех макетов с пагинацией и фильтрацией.

**Query Parameters:**
```typescript
{
  page?: number,        // Default: 1
  limit?: number,       // Default: 50
  userId?: string,      // Filter by user UUID
  orderId?: string      // Filter by order UUID
}
```

**Request Example:**
```
GET /api/mockups?page=1&limit=20&userId=user-uuid
```

**Response:**
```json
{
  "mockups": [
    {
      "id": "mockup-uuid",
      "fileName": "mockup_1699564800000_abc123xyz.jpg",
      "originalName": "design.jpg",
      "mimeType": "image/jpeg",
      "size": 2048576,
      "thumbnailPath": "thumb_mockup_1699564800000_abc123xyz.jpg",
      "user": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "order": {
        "id": "order-uuid",
        "orderNumber": "ORDER-2025-001"
      },
      "metadata": {...},
      "createdAt": "2025-11-06T10:00:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

### 3. Get Mockup by ID

**GET** `/api/mockups/:id`

Получить информацию о конкретном макете.

**Response:**
```json
{
  "id": "mockup-uuid",
  "fileName": "mockup_1699564800000_abc123xyz.jpg",
  "originalName": "design.jpg",
  "mimeType": "image/jpeg",
  "size": 2048576,
  "thumbnailPath": "thumb_mockup_1699564800000_abc123xyz.jpg",
  "user": {...},
  "order": {...},
  "metadata": {
    "width": 3000,
    "height": 2000,
    "format": "jpeg"
  },
  "description": "Client design",
  "createdAt": "2025-11-06T10:00:00.000Z",
  "updatedAt": "2025-11-06T10:00:00.000Z"
}
```

### 4. Download Mockup

**GET** `/api/mockups/:id/download`

Скачать оригинальный файл макета.

**Response:**
- Content-Type: original file MIME type
- Content-Disposition: attachment; filename="original-name.jpg"
- Body: File stream

**Example:**
```typescript
const response = await fetch(`/api/mockups/${mockupId}/download`);
const blob = await response.blob();
const url = URL.createObjectURL(blob);
// Download file
```

### 5. Get Thumbnail

**GET** `/api/mockups/:id/thumbnail`

Получить превью макета (300x300px).

**Response:**
- Content-Type: image/jpeg
- Cache-Control: public, max-age=31536000
- Body: JPEG image (300x300px)

**Sharp configuration:**
```typescript
sharp(filePath)
  .resize(300, 300, {
    fit: 'inside',
    withoutEnlargement: true,
  })
  .jpeg({ quality: 80 })
  .toFile(thumbnailPath);
```

### 6. Get Custom Preview

**GET** `/api/mockups/:id/preview`

Создать превью кастомного размера с помощью Sharp.

**Query Parameters:**
```typescript
{
  width?: number,    // Default: 800
  height?: number    // Default: 800
}
```

**Request Example:**
```
GET /api/mockups/:id/preview?width=1200&height=800
```

**Response:**
- Content-Type: image/jpeg
- Cache-Control: public, max-age=3600
- Body: JPEG image (resized)

**Sharp processing:**
```typescript
await sharp(filePath)
  .resize(width, height, {
    fit: 'inside',
    withoutEnlargement: true,
  })
  .jpeg({ quality: 85 })
  .toBuffer();
```

### 7. Delete Mockup

**DELETE** `/api/mockups/:id`

Удалить макет и все связанные файлы.

**Response:**
```json
{
  "success": true,
  "message": "Макет успешно удален"
}
```

**Actions performed:**
1. Удаление оригинального файла
2. Удаление превью (если есть)
3. Удаление записи из БД

## 🎨 Sharp Features

### 1. Automatic Thumbnail Generation

При загрузке изображения автоматически создается превью:

```typescript
await sharp(filePath)
  .resize(300, 300, {
    fit: 'inside',              // Сохранить пропорции
    withoutEnlargement: true,   // Не увеличивать маленькие изображения
  })
  .jpeg({ quality: 80 })        // JPEG сжатие
  .toFile(thumbnailPath);
```

### 2. Metadata Extraction

Извлечение метаданных изображения:

```typescript
const imageMetadata = await sharp(filePath).metadata();

metadata = {
  width: imageMetadata.width,      // Ширина в пикселях
  height: imageMetadata.height,    // Высота в пикселях
  format: imageMetadata.format,    // Формат (jpeg, png, etc)
  space: imageMetadata.space,      // Цветовое пространство
  density: imageMetadata.density,  // DPI
};
```

### 3. Dynamic Preview Generation

Создание превью любого размера на лету:

```typescript
const buffer = await sharp(filePath)
  .resize(width, height, {
    fit: 'inside',
    withoutEnlargement: true,
  })
  .jpeg({ quality: 85 })
  .toBuffer();
```

### 4. Image Optimization

Sharp автоматически оптимизирует изображения:
- Удаление метаданных EXIF
- Оптимизация палитры
- Прогрессивная загрузка JPEG
- Сжатие без потери качества

## 📂 File Storage

### Directory Structure

```
uploads/
├── mockups/                    # Оригинальные файлы
│   ├── mockup_1699564800000_abc123xyz.jpg
│   ├── mockup_1699564900000_def456uvw.png
│   └── mockup_1699565000000_ghi789rst.pdf
└── thumbnails/                 # Превью (только для изображений)
    ├── thumb_mockup_1699564800000_abc123xyz.jpg
    └── thumb_mockup_1699564900000_def456uvw.jpg
```

### File Naming

```typescript
// Формат имени файла
const timestamp = Date.now();
const randomString = Math.random().toString(36).substring(2, 15);
const ext = path.extname(originalName);
const fileName = `mockup_${timestamp}_${randomString}${ext}`;

// Пример: mockup_1699564800000_abc123xyz.jpg
```

## 🔧 Configuration

### Environment Variables

```env
# .env
PORT=3001
NODE_ENV=development
DB_FILE=printcore.db

# Опционально для production
UPLOADS_DIR=/path/to/uploads
MAX_FILE_SIZE=52428800  # 50MB в байтах
```

### Service Configuration

```typescript
// mockups.service.ts
private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'mockups');
private readonly thumbnailsDir = path.join(process.cwd(), 'uploads', 'thumbnails');
```

## 🔒 Validation & Security

### File Type Validation

```typescript
const allowedTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/tiff',
  'application/pdf',
];

if (!allowedTypes.includes(file.mimetype)) {
  throw new BadRequestException('Неподдерживаемый тип файла');
}
```

### File Size Limit

```typescript
const maxSize = 50 * 1024 * 1024; // 50 MB

if (file.size > maxSize) {
  throw new BadRequestException('Файл слишком большой');
}
```

### Unique File Names

```typescript
// Предотвращение перезаписи файлов
const fileName = `mockup_${Date.now()}_${Math.random().toString(36).substring(2, 15)}${ext}`;
```

## 🧪 Testing

### Test Upload

```bash
curl -X POST http://localhost:3001/api/mockups/upload \
  -F "file=@/path/to/image.jpg" \
  -F "userId=user-uuid" \
  -F "description=Test mockup"
```

### Test Download

```bash
curl -O http://localhost:3001/api/mockups/{mockup-id}/download
```

### Test Thumbnail

```bash
curl -O http://localhost:3001/api/mockups/{mockup-id}/thumbnail
```

## 📈 Performance

### Sharp Performance

- **Быстрое изменение размера:** Sharp использует libvips (в 4-5 раз быстрее ImageMagick)
- **Низкое потребление памяти:** Потоковая обработка
- **Параллельная обработка:** Обработка нескольких изображений одновременно

### Optimization Tips

```typescript
// Используйте буферы для кеширования
const buffer = await sharp(filePath)
  .jpeg({ 
    quality: 85,
    progressive: true,
    mozjpeg: true,
  })
  .toBuffer();

// Используйте streams для больших файлов
const readStream = fs.createReadStream(filePath);
const transform = sharp().resize(800, 600);
readStream.pipe(transform).pipe(res);
```

## 🐛 Error Handling

### Common Errors

```typescript
// Файл не найден
throw new NotFoundException('Макет не найден');

// Недопустимый тип файла
throw new BadRequestException('Неподдерживаемый тип файла');

// Файл слишком большой
throw new BadRequestException('Файл слишком большой');

// Ошибка обработки изображения
throw new InternalServerErrorException('Ошибка обработки изображения');
```

## 🚀 Deployment

### Production Checklist

- [ ] Установить NODE_ENV=production
- [ ] Настроить правильные пути для uploads
- [ ] Настроить резервное копирование файлов
- [ ] Настроить CDN для статических файлов
- [ ] Включить компрессию ответов
- [ ] Настроить rate limiting
- [ ] Мониторинг дискового пространства

### Docker Support

```dockerfile
FROM node:20-alpine

# Установка sharp зависимостей
RUN apk add --no-cache \
    libc6-compat \
    vips-dev \
    fftw-dev \
    build-base

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

## 📚 Additional Resources

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Multer Documentation](https://github.com/expressjs/multer)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
- [TypeORM Relations](https://typeorm.io/relations)

## 🎯 Next Steps

- [ ] Добавить поддержку видео файлов
- [ ] Добавить водяные знаки
- [ ] Добавить batch upload
- [ ] Добавить S3 интеграцию
- [ ] Добавить webhook уведомления
- [ ] Добавить аналитику загрузок

---

**Backend готов к использованию!** 🎉

Запустите сервер: `npm run start:dev`
API доступен на: `http://localhost:3001/api`
Swagger docs: `http://localhost:3001/api`

