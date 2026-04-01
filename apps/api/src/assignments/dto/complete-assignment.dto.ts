import { IsString, IsOptional } from 'class-validator';

export class CompleteAssignmentDto {
    @IsString()
    @IsOptional()
    feedback?: string;
}
