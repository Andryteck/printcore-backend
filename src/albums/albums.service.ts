import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './entities/album.entity';
import { AlbumTemplate } from './entities/album-template.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CreateAlbumTemplateDto } from './dto/create-album-template.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(AlbumTemplate)
    private templateRepository: Repository<AlbumTemplate>,
  ) {}

  // Альбомы
  async createAlbum(userId: string, createAlbumDto: CreateAlbumDto): Promise<Album> {
    const template = await this.templateRepository.findOne({
      where: { id: createAlbumDto.templateId }
    });

    if (!template) {
      throw new NotFoundException('Шаблон не найден');
    }

    const album = this.albumRepository.create({
      title: createAlbumDto.title,
      description: createAlbumDto.description,
      userId,
      templateId: createAlbumDto.templateId,
      settings: createAlbumDto.settings,
      price: createAlbumDto.price || 0,
      status: (createAlbumDto.status as 'draft' | 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled') || 'draft',
    });

    return this.albumRepository.save(album);
  }

  async findAllAlbums(userId: string): Promise<Album[]> {
    return this.albumRepository.find({
      where: { userId },
      relations: ['pages', 'pages.photos'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneAlbum(id: string, userId: string): Promise<Album> {
    const album = await this.albumRepository.findOne({
      where: { id, userId },
      relations: ['pages', 'pages.photos'],
    });

    if (!album) {
      throw new NotFoundException('Альбом не найден');
    }

    return album;
  }

  async updateAlbum(id: string, userId: string, updateData: Partial<CreateAlbumDto>): Promise<Album> {
    const album = await this.findOneAlbum(id, userId);
    
    Object.assign(album, updateData);
    return this.albumRepository.save(album);
  }

  async deleteAlbum(id: string, userId: string): Promise<void> {
    const album = await this.findOneAlbum(id, userId);
    await this.albumRepository.remove(album);
  }

  // Шаблоны
  async createTemplate(createTemplateDto: CreateAlbumTemplateDto): Promise<AlbumTemplate> {
    const template = this.templateRepository.create({
      name: createTemplateDto.name,
      description: createTemplateDto.description,
      thumbnail: createTemplateDto.thumbnail,
      layout: createTemplateDto.layout as 'grid' | 'masonry' | 'timeline',
      theme: createTemplateDto.theme as 'classic' | 'modern' | 'vintage' | 'minimal',
      pages: createTemplateDto.pages,
      layoutSettings: createTemplateDto.layoutSettings,
      themeSettings: createTemplateDto.themeSettings,
      isActive: createTemplateDto.isActive !== undefined ? createTemplateDto.isActive : true,
      createdBy: 'system', // В реальном приложении это будет ID пользователя
    });
    return this.templateRepository.save(template);
  }

  async findAllTemplates(): Promise<AlbumTemplate[]> {
    return this.templateRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneTemplate(id: string): Promise<AlbumTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Шаблон не найден');
    }

    return template;
  }

  async updateTemplate(id: string, updateData: Partial<CreateAlbumTemplateDto>): Promise<AlbumTemplate> {
    const template = await this.findOneTemplate(id);
    
    Object.assign(template, updateData);
    return this.templateRepository.save(template);
  }

  async deleteTemplate(id: string): Promise<void> {
    const template = await this.findOneTemplate(id);
    await this.templateRepository.remove(template);
  }

  async toggleTemplateStatus(id: string): Promise<AlbumTemplate> {
    const template = await this.findOneTemplate(id);
    template.isActive = !template.isActive;
    return this.templateRepository.save(template);
  }
}
