import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mockup } from './entities/mockup.entity';
import { UploadMockupDto } from './dto/upload-mockup.dto';
import { QueryMockupsDto } from './dto/query-mockups.dto';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const access = promisify(fs.access);

@Injectable()
export class MockupsService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'mockups');
  private readonly thumbnailsDir = path.join(process.cwd(), 'uploads', 'thumbnails');

  constructor(
    @InjectRepository(Mockup)
    private mockupsRepository: Repository<Mockup>,
  ) {
    this.ensureUploadDirs();
  }

  // Создание директорий для загрузки
  private async ensureUploadDirs() {
    try {
      await mkdir(this.uploadsDir, { recursive: true });
      await mkdir(this.thumbnailsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directories:', error);
    }
  }

  // Загрузка макета
  async uploadMockup(
    file: Express.Multer.File,
    uploadMockupDto: UploadMockupDto,
  ): Promise<Mockup> {
    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    // Генерируем уникальное имя файла
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.originalname);
    const fileName = `mockup_${timestamp}_${randomString}${ext}`;
    const filePath = path.join(this.uploadsDir, fileName);

    // Сохраняем файл
    await fs.promises.writeFile(filePath, file.buffer);

    // Создаем превью для изображений
    let thumbnailPath: string | undefined = undefined;
    if (file.mimetype.startsWith('image/')) {
      thumbnailPath = await this.createThumbnail(filePath, fileName);
    }

    // Получаем метаданные изображения
    let metadata: Record<string, any> | undefined = undefined;
    if (file.mimetype.startsWith('image/')) {
      try {
        const imageMetadata = await sharp(filePath).metadata();
        metadata = {
          width: imageMetadata.width,
          height: imageMetadata.height,
          format: imageMetadata.format,
          space: imageMetadata.space,
          density: imageMetadata.density,
        };
      } catch (error) {
        console.error('Error extracting image metadata:', error);
      }
    }

    // Создаем запись в базе данных
    const mockup = this.mockupsRepository.create({
      fileName: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      thumbnailPath: thumbnailPath,
      userId: uploadMockupDto.userId,
      orderId: uploadMockupDto.orderId,
      description: uploadMockupDto.description,
      metadata: metadata,
    });

    return await this.mockupsRepository.save(mockup);
  }

  // Создание превью изображения
  private async createThumbnail(
    filePath: string,
    originalFileName: string,
  ): Promise<string | undefined> {
    try {
      const thumbnailFileName = `thumb_${originalFileName}`;
      const thumbnailPath = path.join(this.thumbnailsDir, thumbnailFileName);

      await sharp(filePath)
        .resize(300, 300, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      return thumbnailFileName;
    } catch (error) {
      console.error('Error creating thumbnail:', error);
      return undefined;
    }
  }

  // Получение списка макетов
  async findAll(queryDto: QueryMockupsDto): Promise<{
    mockups: Mockup[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { userId, orderId, page = 1, limit = 50 } = queryDto;

    console.log('Finding mockups with filters:', { userId, orderId, page, limit });

    const queryBuilder = this.mockupsRepository
      .createQueryBuilder('mockup');

    if (userId) {
      console.log('Filtering by userId:', userId);
      queryBuilder.andWhere('mockup.userId = :userId', { userId });
    }

    if (orderId) {
      console.log('Filtering by orderId:', orderId);
      queryBuilder.andWhere('mockup.orderId = :orderId', { orderId });
    }

    const total = await queryBuilder.getCount();

    const mockups = await queryBuilder
      .orderBy('mockup.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      mockups,
      total,
      page,
      limit,
    };
  }

  // Получение макета по ID
  async findOne(id: string): Promise<Mockup> {
    const mockup = await this.mockupsRepository.findOne({
      where: { id },
    });

    if (!mockup) {
      throw new NotFoundException('Макет не найден');
    }

    return mockup;
  }

  // Получение пути к файлу макета
  getFilePath(fileName: string): string {
    return path.join(this.uploadsDir, fileName);
  }

  // Получение пути к превью
  getThumbnailPath(thumbnailFileName: string): string {
    return path.join(this.thumbnailsDir, thumbnailFileName);
  }

  // Проверка существования файла
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  // Удаление макета
  // Обновление макета (например, привязка к заказу)
  async update(id: string, updateData: Partial<Mockup>): Promise<Mockup> {
    const mockup = await this.findOne(id);

    // Обновляем поля
    Object.assign(mockup, updateData);

    return await this.mockupsRepository.save(mockup);
  }

  async remove(id: string): Promise<void> {
    const mockup = await this.findOne(id);

    // Удаляем файлы
    const filePath = this.getFilePath(mockup.fileName);
    if (await this.fileExists(filePath)) {
      await unlink(filePath);
    }

    if (mockup.thumbnailPath) {
      const thumbnailPath = this.getThumbnailPath(mockup.thumbnailPath);
      if (await this.fileExists(thumbnailPath)) {
        await unlink(thumbnailPath);
      }
    }

    // Удаляем запись из базы данных
    await this.mockupsRepository.remove(mockup);
  }

  // Создание превью для существующего макета
  async createPreview(
    id: string,
    width: number = 800,
    height: number = 800,
  ): Promise<Buffer> {
    const mockup = await this.findOne(id);

    if (!mockup.mimeType.startsWith('image/')) {
      throw new BadRequestException('Превью доступно только для изображений');
    }

    const filePath = this.getFilePath(mockup.fileName);

    if (!(await this.fileExists(filePath))) {
      throw new NotFoundException('Файл макета не найден');
    }

    return await sharp(filePath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer();
  }
}

