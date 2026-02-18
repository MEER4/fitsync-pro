import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service'; // Service import
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('users')
@UseGuards(SupabaseAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('members')
    async getMembers() {
        return this.usersService.getMembers();
    }
}
