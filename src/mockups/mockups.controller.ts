import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { MockupsService } from './mockups.service';
import { UploadMockupDto } from './dto/upload-mockup.dto';
import { QueryMockupsDto } from './dto/query-mockups.dto';
import * as fs from 'fs';

@ApiTags('mockups')
@Controller('mockups')
export class MockupsController {
  constructor(private readonly mockupsService: MockupsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Загрузить макет' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        userId: { type: 'string', format: 'uuid' },
        orderId: { type: 'string', format: 'uuid' },
        description: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Макет успешно загружен' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadMockup(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadMockupDto: UploadMockupDto,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    // Очищаем пустые строки, преобразуем в undefined
    const cleanDto = {
      userId: uploadMockupDto.userId && uploadMockupDto.userId.trim() !== '' 
        ? uploadMockupDto.userId 
        : undefined,
      orderId: uploadMockupDto.orderId && uploadMockupDto.orderId.trim() !== '' 
        ? uploadMockupDto.orderId 
        : undefined,
      description: uploadMockupDto.description,
    };

    try {
      const mockup = await this.mockupsService.uploadMockup(file, cleanDto);

      return {
        success: true,
        mockup,
        message: 'Макет успешно загружен',
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Получить список макетов' })
  @ApiResponse({ status: 200, description: 'Список макетов' })
  async findAll(@Query() queryDto: QueryMockupsDto) {
    return await this.mockupsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить макет по ID' })
  @ApiResponse({ status: 200, description: 'Информация о макете' })
  @ApiResponse({ status: 404, description: 'Макет не найден' })
  async findOne(@Param('id') id: string) {
    return await this.mockupsService.findOne(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Скачать макет' })
  @ApiResponse({ status: 200, description: 'Файл макета' })
  @ApiResponse({ status: 404, description: 'Макет не найден' })
  async downloadMockup(@Param('id') id: string, @Res() res: Response) {
    const mockup = await this.mockupsService.findOne(id);
    const filePath = this.mockupsService.getFilePath(mockup.fileName);

    if (!(await this.mockupsService.fileExists(filePath))) {
      throw new BadRequestException('Файл не найден на сервере');
    }

    const stream = fs.createReadStream(filePath);

    res.set({
      'Content-Type': mockup.mimeType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(mockup.originalName)}"`,
      'Content-Length': mockup.size,
    });

    stream.pipe(res);
  }

  @Get(':id/thumbnail')
  @ApiOperation({ summary: 'Получить превью макета' })
  @ApiResponse({ status: 200, description: 'Превью изображения' })
  @ApiResponse({ status: 404, description: 'Макет не найден' })
  async getThumbnail(@Param('id') id: string, @Res() res: Response) {
    const mockup = await this.mockupsService.findOne(id);

    if (!mockup.thumbnailPath) {
      throw new BadRequestException('Превью не доступно для этого макета');
    }

    const thumbnailPath = this.mockupsService.getThumbnailPath(
      mockup.thumbnailPath,
    );

    if (!(await this.mockupsService.fileExists(thumbnailPath))) {
      throw new BadRequestException('Превью не найдено на сервере');
    }

    const stream = fs.createReadStream(thumbnailPath);

    res.set({
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000',
    });

    stream.pipe(res);
  }

  @Get(':id/preview')
  @ApiOperation({ summary: 'Создать кастомное превью макета' })
  @ApiResponse({ status: 200, description: 'Превью изображения' })
  @ApiResponse({ status: 400, description: 'Превью доступно только для изображений' })
  @ApiResponse({ status: 404, description: 'Макет не найден' })
  async getPreview(
    @Param('id') id: string,
    @Res() res: Response,
    @Query('width') width?: number,
    @Query('height') height?: number,
  ) {
    const previewWidth = width ? Number(width) : 800;
    const previewHeight = height ? Number(height) : 800;

    const buffer = await this.mockupsService.createPreview(
      id,
      previewWidth,
      previewHeight,
    );

    res.set({
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=3600',
    });

    res.send(buffer);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить макет' })
  @ApiResponse({ status: 200, description: 'Макет успешно удален' })
  @ApiResponse({ status: 404, description: 'Макет не найден' })
  async remove(@Param('id') id: string) {
    await this.mockupsService.remove(id);
    return {
      success: true,
      message: 'Макет успешно удален',
    };
  }
}

