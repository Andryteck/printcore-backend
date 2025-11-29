import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ unique: false }) // Уникальность обеспечивается комбинацией userId + orderId
  orderId: string; // Уникальный ID заказа в корзине (например, photo-1234567890)

  @Column()
  orderNumber: string;

  @Column()
  orderName: string;

  @Column()
  orderType: string; // 'photo' | 'poster' | 'business-card' | 'flyer' | 'brochure' | 'other'

  @Column({ type: 'json' })
  items: any[]; // Массив товаров в заказе

  @Column()
  status: string; // Статус заказа в корзине

  @Column({ type: 'json' })
  options: Record<string, any>; // Опции заказа (sets, premiumBoxes, etc.)

  @Column()
  editLink: string; // Ссылка для редактирования заказа

  @Column({ type: 'text', nullable: true })
  createdAt: string; // Дата создания в формате строки

  @CreateDateColumn()
  created: Date; // Дата создания в БД

  @UpdateDateColumn()
  updatedAt: Date;
}

