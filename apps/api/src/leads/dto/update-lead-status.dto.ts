import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateLeadStatusDto {
    @IsEnum(['new', 'contacted', 'qualified', 'converted', 'lost'])
    @IsNotEmpty()
    status: string;
}
