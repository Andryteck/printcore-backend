import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadMockupDto {
  @ApiProperty({ required: false, description: 'ID пользователя' })
  @IsOptional()
  @ValidateIf((o) => o.userId !== '' && o.userId !== null)
  @IsUUID()
  @Transform(({ value }) => value === '' ? undefined : value)
  userId?: string;

  @ApiProperty({ required: false, description: 'ID заказа' })
  @IsOptional()
  @ValidateIf((o) => o.orderId !== '' && o.orderId !== null)
  @IsUUID()
  @Transform(({ value }) => value === '' ? undefined : value)
  orderId?: string;

  @ApiProperty({ required: false, description: 'Описание макета' })
  @IsOptional()
  @IsString()
  description?: string;
}

