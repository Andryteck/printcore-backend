import { IsString, IsOptional, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'Иван Иванов', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Имя должно быть минимум 2 символа' })
  name?: string;

  @ApiProperty({ example: '+375 29 123-45-67', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{9}$/, { message: 'УНП должен содержать 9 цифр' })
  unp?: string;

  @ApiProperty({ example: 'г. Минск, ул. Ленина, д. 1, офис 100', required: false })
  @IsOptional()
  @IsString()
  legalAddress?: string;

  @ApiProperty({ example: 'ОАО "Беларусбанк"', required: false })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({ example: 'BY86AKBB36429000000000000000', required: false })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiProperty({ example: 'AKBBBY2X', required: false })
  @IsOptional()
  @IsString()
  bankCode?: string;
}

