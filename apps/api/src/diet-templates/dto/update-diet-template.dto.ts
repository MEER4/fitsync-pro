import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateDietTemplateDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsObject()
    @IsOptional()
    content?: any;
}
