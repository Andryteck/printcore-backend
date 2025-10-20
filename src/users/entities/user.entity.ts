import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'user' })
  role: string; // 'user' | 'admin'

  @Column({ default: 'individual' })
  userType: string; // 'individual' | 'legal'

  @Column({ nullable: true })
  unp: string; // УНП (Учетный номер плательщика) для юридических лиц

  @Column({ nullable: true })
  legalAddress: string; // Юридический адрес для юридических лиц

  @Column({ nullable: true })
  bankName: string; // Название банка

  @Column({ nullable: true })
  bankAccount: string; // Расчетный счет

  @Column({ nullable: true })
  bankCode: string; // БИК банка

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

