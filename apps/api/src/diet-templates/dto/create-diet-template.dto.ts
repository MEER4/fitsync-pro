import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateDietTemplateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsObject()
    @IsNotEmpty()
    content: any;
}
