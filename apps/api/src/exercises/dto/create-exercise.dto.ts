import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUrl } from 'class-validator';

export class CreateExerciseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(['youtube', 'vimeo', 'internal_upload'])
    video_source: 'youtube' | 'vimeo' | 'internal_upload';

    @IsUrl()
    @IsNotEmpty()
    video_url: string;

    @IsUrl()
    @IsOptional()
    thumbnail_url?: string;
}
