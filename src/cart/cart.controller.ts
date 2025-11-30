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
  async findAll(@Request() req) {
    console.log('[CartController] GET /cart - получен запрос:', {
      userId: req.user?.id || req.user?.userId,
      userEmail: req.user?.email,
      hasUser: !!req.user
    });
    
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) {
        console.error('[CartController] GET /cart - userId не найден в req.user:', req.user);
        throw new Error('User ID not found');
      }
      
      const result = await this.cartService.findAll(userId);
      console.log('[CartController] GET /cart - успешно обработан:', {
        resultLength: Array.isArray(result) ? result.length : 'not array',
        resultType: typeof result,
        isArray: Array.isArray(result),
        result: Array.isArray(result) ? result : JSON.stringify(result).substring(0, 200)
      });
      return result;
    } catch (error) {
      console.error('[CartController] GET /cart - ошибка:', error);
      throw error;
    }
  }

  @Post()
  @ApiOperation({ summary: 'Сохранить заказ в корзину' })
  async create(@Request() req, @Body() createCartDto: CreateCartDto) {
    console.log('[CartController] POST /cart - получен запрос:', {
      userId: req.user?.id,
      orderId: createCartDto?.orderId,
      orderName: createCartDto?.orderName,
      orderType: createCartDto?.orderType,
      itemsCount: createCartDto?.items?.length || 0,
      hasStatus: !!createCartDto?.status,
      hasOptions: !!createCartDto?.options,
      hasEditLink: !!createCartDto?.editLink,
      hasCreatedAt: !!createCartDto?.createdAt,
      fullDto: createCartDto
    });
    
    try {
      const result = await this.cartService.create(req.user.id, createCartDto);
      console.log('[CartController] POST /cart - успешно обработан:', {
        orderId: result.orderId,
        orderName: result.orderName,
        id: result.id
      });
      return result;
    } catch (error) {
      console.error('[CartController] POST /cart - ошибка:', error);
      throw error;
    }
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

