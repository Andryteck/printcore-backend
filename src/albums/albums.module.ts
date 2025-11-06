import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsController, AlbumTemplatesController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { Album } from './entities/album.entity';
import { AlbumPage } from './entities/album-page.entity';
import { AlbumPhoto } from './entities/album-photo.entity';
import { AlbumTemplate } from './entities/album-template.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Album,
      AlbumPage,
      AlbumPhoto,
      AlbumTemplate,
    ]),
  ],
  controllers: [AlbumsController, AlbumTemplatesController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
