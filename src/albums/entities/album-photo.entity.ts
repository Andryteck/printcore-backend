import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AlbumPage } from './album-page.entity';

@Entity('album_photos')
export class AlbumPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pageId: string;

  @ManyToOne(() => AlbumPage, page => page.photos)
  page: AlbumPage;

  @Column()
  originalUrl: string;

  @Column({ nullable: true })
  processedUrl: string;

  @Column()
  filename: string;

  @Column()
  mimeType: string;

  @Column()
  fileSize: number;

  @Column({ type: 'int' })
  width: number;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'json', nullable: true })
  cropSettings: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zoom: number;
  };
}
