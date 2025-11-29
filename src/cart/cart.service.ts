import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async create(userId: string, createCartDto: CreateCartDto): Promise<Cart> {
    // Проверяем, существует ли уже заказ с таким orderId для этого пользователя
    const existingCart = await this.cartRepository.findOne({
      where: { userId, orderId: createCartDto.orderId },
    });

    if (existingCart) {
      // Если заказ существует, обновляем его
      Object.assign(existingCart, createCartDto);
      return this.cartRepository.save(existingCart);
    }

    // Создаем новый заказ
    const cart = this.cartRepository.create({
      ...createCartDto,
      userId,
    });

    return this.cartRepository.save(cart);
  }

  async findAll(userId: string): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { userId },
      order: { created: 'DESC' },
    });
  }

  async findOne(userId: string, orderId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId, orderId },
    });

    if (!cart) {
      throw new NotFoundException('Заказ в корзине не найден');
    }

    return cart;
  }

  async update(
    userId: string,
    orderId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    const cart = await this.findOne(userId, orderId);
    Object.assign(cart, updateCartDto);
    return this.cartRepository.save(cart);
  }

  async remove(userId: string, orderId: string): Promise<void> {
    const cart = await this.findOne(userId, orderId);
    await this.cartRepository.remove(cart);
  }

  async removeAll(userId: string): Promise<void> {
    const carts = await this.findAll(userId);
    await this.cartRepository.remove(carts);
  }
}

