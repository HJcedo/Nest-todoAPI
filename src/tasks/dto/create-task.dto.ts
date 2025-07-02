import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString() @MaxLength(120) title: string;
  @IsOptional() @IsString() description?: string;
  @Transform(({ value }) => value === 'true') // <- transforma string em boolean
  @IsBoolean()
  completed: boolean;
  @IsOptional() @IsString() imageUrl?: string; // preenchido no controller
}
