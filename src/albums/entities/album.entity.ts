import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AlbumPage } from './album-page.entity';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  templateId: string;

  @Column({ type: 'json' })
  template: {
    id: string;
    name: string;
    layout: string;
    theme: string;
    pages: number;
  };

  @Column({ type: 'json', nullable: true })
  settings: {
    coverType: string;
    paperType: string;
    size: string;
    binding: string;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'draft' })
  status: 'draft' | 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';

  @OneToMany(() => AlbumPage, page => page.album)
  pages: AlbumPage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
