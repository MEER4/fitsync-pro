import { IsUUID, IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class UpsertDietDto {
    @IsUUID()
    @IsNotEmpty()
    memberId: string;

    @IsObject()
    @IsNotEmpty()
    content: any;

    @IsString()
    @IsOptional()
    name?: string;
}
