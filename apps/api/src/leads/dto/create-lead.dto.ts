import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum } from 'class-validator';

export class CreateLeadDto {
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    age?: string;

    @IsString()
    @IsOptional()
    weight?: string;

    @IsString()
    @IsOptional()
    height?: string;

    @IsEnum(['male', 'female', 'other', 'prefer_not_to_say'])
    @IsOptional()
    gender?: string;

    @IsString()
    @IsOptional()
    goal?: string;

    @IsString()
    @IsOptional()
    plan?: string;

    @IsEnum(['beginner', 'intermediate', 'advanced'])
    @IsOptional()
    experience_level?: string;

    @IsString()
    @IsOptional()
    availability?: string;

    @IsString()
    @IsOptional()
    medical_conditions?: string;

    @IsEnum(['email', 'phone', 'whatsapp'])
    @IsOptional()
    contact_preference?: string;
}
