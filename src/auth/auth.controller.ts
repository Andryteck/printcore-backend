import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
  @ApiResponse({ status: 409, description: 'Пользователь уже существует' })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      user: result.user,
      token: result.token,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({ status: 200, description: 'Успешная авторизация' })
  @ApiResponse({ status: 401, description: 'Неверные данные' })
  async login(@Body() loginDto: LoginDto) {
    console.log('[AuthController] POST /auth/login - получен запрос:', {
      email: loginDto.email,
      hasPassword: !!loginDto.password,
      passwordLength: loginDto.password?.length || 0,
      timestamp: new Date().toISOString()
    });

    try {
      const result = await this.authService.login(loginDto);
      console.log('[AuthController] POST /auth/login - успешно:', {
        userId: result.user.id,
        email: result.user.email,
        hasToken: !!result.token,
        tokenLength: result.token?.length || 0,
        tokenPreview: result.token ? `${result.token.substring(0, 20)}...` : 'none',
        timestamp: new Date().toISOString()
      });
      
      const response = {
        user: result.user,
        token: result.token,
      };
      
      console.log('[AuthController] POST /auth/login - возвращаем ответ:', {
        hasUser: !!response.user,
        hasToken: !!response.token,
        tokenType: typeof response.token
      });
      
      return response;
    } catch (error) {
      console.error('[AuthController] POST /auth/login - ошибка:', {
        message: error.message,
        status: error.status,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      // Возвращаем более детальную ошибку для отладки
      if (error.status === 401) {
        return {
          error: 'Неверный email или пароль',
          message: error.message,
          statusCode: 401
        };
      }
      
      throw error;
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiResponse({ status: 200, description: 'Информация о пользователе' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async getCurrentUser(@Request() req) {
    const user = await this.authService.validateUser(req.user.userId);
    return user;
  }
}

