import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({ example: 'password123', minimum: 6 })
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
  password: string;

  @ApiProperty({ example: 'Иван Иванов' })
  @IsString()
  @MinLength(2, { message: 'Имя должно быть минимум 2 символа' })
  name: string;

  @ApiProperty({ example: '+375 29 123-45-67', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

