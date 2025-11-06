import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('album_templates')
export class AlbumTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  thumbnail: string;

  @Column()
  layout: 'grid' | 'masonry' | 'timeline';

  @Column()
  theme: 'classic' | 'modern' | 'vintage' | 'minimal';

  @Column({ type: 'int' })
  pages: number;

  @Column({ type: 'json', nullable: true })
  layoutSettings: {
    columns: number;
    spacing: number;
    padding: number;
    borderRadius: number;
  };

  @Column({ type: 'json', nullable: true })
  themeSettings: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: number;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column()
  createdBy: string;

  @ManyToOne(() => User)
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
