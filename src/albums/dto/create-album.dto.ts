import { IsString, IsOptional, IsObject, IsNumber, IsEnum, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  templateId: string;

  @IsOptional()
  @IsObject()
  settings?: {
    coverType: string;
    paperType: string;
    size: string;
    binding: string;
  };

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsEnum(['draft', 'pending', 'processing', 'ready', 'delivered', 'cancelled'])
  status?: string;
}
