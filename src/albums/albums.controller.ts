import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CreateAlbumTemplateDto } from './dto/create-album-template.dto';

@ApiTags('albums')
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новый альбом' })
  @ApiResponse({ status: 201, description: 'Альбом успешно создан' })
  async createAlbum(@Request() req, @Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.createAlbum(req.user.id, createAlbumDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все альбомы пользователя' })
  @ApiResponse({ status: 200, description: 'Список альбомов получен' })
  async findAllAlbums(@Request() req) {
    return this.albumsService.findAllAlbums(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить альбом по ID' })
  @ApiResponse({ status: 200, description: 'Альбом найден' })
  @ApiResponse({ status: 404, description: 'Альбом не найден' })
  async findOneAlbum(@Request() req, @Param('id') id: string) {
    return this.albumsService.findOneAlbum(id, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить альбом' })
  @ApiResponse({ status: 200, description: 'Альбом обновлен' })
  async updateAlbum(@Request() req, @Param('id') id: string, @Body() updateData: Partial<CreateAlbumDto>) {
    return this.albumsService.updateAlbum(id, req.user.id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить альбом' })
  @ApiResponse({ status: 200, description: 'Альбом удален' })
  async deleteAlbum(@Request() req, @Param('id') id: string) {
    return this.albumsService.deleteAlbum(id, req.user.id);
  }
}

@ApiTags('album-templates')
@Controller('album-templates')
export class AlbumTemplatesController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новый шаблон альбома' })
  @ApiResponse({ status: 201, description: 'Шаблон успешно создан' })
  async createTemplate(@Body() createTemplateDto: CreateAlbumTemplateDto) {
    return this.albumsService.createTemplate(createTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все активные шаблоны' })
  @ApiResponse({ status: 200, description: 'Список шаблонов получен' })
  async findAllTemplates() {
    return this.albumsService.findAllTemplates();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить шаблон по ID' })
  @ApiResponse({ status: 200, description: 'Шаблон найден' })
  @ApiResponse({ status: 404, description: 'Шаблон не найден' })
  async findOneTemplate(@Param('id') id: string) {
    return this.albumsService.findOneTemplate(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить шаблон' })
  @ApiResponse({ status: 200, description: 'Шаблон обновлен' })
  async updateTemplate(@Param('id') id: string, @Body() updateData: Partial<CreateAlbumTemplateDto>) {
    return this.albumsService.updateTemplate(id, updateData);
  }

  @Put(':id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Переключить статус шаблона' })
  @ApiResponse({ status: 200, description: 'Статус шаблона изменен' })
  async toggleTemplateStatus(@Param('id') id: string) {
    return this.albumsService.toggleTemplateStatus(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить шаблон' })
  @ApiResponse({ status: 200, description: 'Шаблон удален' })
  async deleteTemplate(@Param('id') id: string) {
    return this.albumsService.deleteTemplate(id);
  }
}
