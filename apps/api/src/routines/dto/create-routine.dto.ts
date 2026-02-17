import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoutineItemDto {
    @IsUUID()
    exercise_id: string;

    @IsInt()
    order_index: number;

    @IsInt()
    @IsOptional()
    sets?: number;

    @IsString()
    @IsOptional()
    reps?: string;

    @IsInt()
    @IsOptional()
    rest_seconds?: number;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class CreateRoutineDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    difficulty_level?: string;

    @IsInt()
    @IsOptional()
    estimated_duration_min?: number;

    @IsBoolean()
    @IsOptional()
    is_public?: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateRoutineItemDto)
    items: CreateRoutineItemDto[];
}
