import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title!: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  slug!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @IsPositive()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsIn(['man', 'woman', 'kid', 'unisex'])
  gender: string;
}
