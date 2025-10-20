import { IsEmail, IsString, MinLength, IsOptional, IsIn, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({ example: 'password123', minimum: 6 })
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
  password: string;

  @ApiProperty({ example: 'ООО "Принт Коре"' })
  @IsString()
  @MinLength(2, { message: 'Название организации должно быть минимум 2 символа' })
  name: string;

  @ApiProperty({ example: '+375 29 123-45-67', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'individual', enum: ['individual', 'legal'], default: 'individual' })
  @IsOptional()
  @IsIn(['individual', 'legal'], { message: 'Тип пользователя должен быть "individual" или "legal"' })
  userType?: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{9}$/, { message: 'УНП должен содержать 9 цифр' })
  unp?: string;
}

