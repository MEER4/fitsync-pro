import { IsUUID, IsNotEmpty, IsDateString } from 'class-validator';

export class AssignRoutineDto {
    @IsUUID()
    @IsNotEmpty()
    memberId: string;

    @IsUUID()
    @IsNotEmpty()
    routineId: string;

    @IsDateString()
    @IsNotEmpty()
    scheduledDate: string;
}
