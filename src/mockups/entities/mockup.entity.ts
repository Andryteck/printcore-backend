import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('mockups')
export class Mockup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string; // Имя файла на диске

  @Column()
  originalName: string; // Оригинальное имя файла

  @Column()
  mimeType: string; // MIME тип файла

  @Column({ type: 'int' })
  size: number; // Размер файла в байтах

  @Column({ type: 'varchar', nullable: true })
  thumbnailPath: string;

  @Column({ type: 'varchar', nullable: true })
  userId: string;

  @Column({ type: 'varchar', nullable: true })
  orderId: string;

  @Column({ type: 'text', nullable: true })
  description: string; // Описание макета

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>; // Дополнительные метаданные (размеры, разрешение и т.д.)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

