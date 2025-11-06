import { IsString, IsOptional, IsObject, IsNumber, IsEnum, IsBoolean } from 'class-validator';

export class CreateAlbumTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  thumbnail: string;

  @IsEnum(['grid', 'masonry', 'timeline'])
  layout: string;

  @IsEnum(['classic', 'modern', 'vintage', 'minimal'])
  theme: string;

  @IsNumber()
  pages: number;

  @IsOptional()
  @IsObject()
  layoutSettings?: {
    columns: number;
    spacing: number;
    padding: number;
    borderRadius: number;
  };

  @IsOptional()
  @IsObject()
  themeSettings?: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: number;
  };

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
