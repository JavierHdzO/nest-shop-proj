import { IsInt, IsPositive, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}