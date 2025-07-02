import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' || value === true || value === '1' ? true : false,
  )
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
