import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все заказы из корзины пользователя' })
  findAll(@Request() req) {
    return this.cartService.findAll(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Сохранить заказ в корзину' })
  create(@Request() req, @Body() createCartDto: CreateCartDto) {
    return this.cartService.create(req.user.id, createCartDto);
  }

  @Put(':orderId')
  @ApiOperation({ summary: 'Обновить заказ в корзине' })
  update(
    @Request() req,
    @Param('orderId') orderId: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(req.user.id, orderId, updateCartDto);
  }

  @Delete(':orderId')
  @ApiOperation({ summary: 'Удалить заказ из корзины' })
  remove(@Request() req, @Param('orderId') orderId: string) {
    return this.cartService.remove(req.user.id, orderId);
  }

  @Delete()
  @ApiOperation({ summary: 'Очистить всю корзину пользователя' })
  removeAll(@Request() req) {
    return this.cartService.removeAll(req.user.id);
  }
}

