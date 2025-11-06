import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Album } from './album.entity';
import { AlbumPhoto } from './album-photo.entity';

@Entity('album_pages')
export class AlbumPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  albumId: string;

  @ManyToOne(() => Album, album => album.pages)
  album: Album;

  @Column()
  pageNumber: number;

  @Column()
  layout: string;

  @Column({ type: 'json', nullable: true })
  layoutSettings: {
    columns: number;
    spacing: number;
    alignment: string;
  };

  @OneToMany(() => AlbumPhoto, photo => photo.page)
  photos: AlbumPhoto[];
}
