import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
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

    @Get('members/:id')
    async getMember(@Param('id') id: string) {
        return this.usersService.getMember(id);
    }

    @Delete('members/:id')
    async removeMember(@Param('id') id: string) {
        return this.usersService.removeMember(id);
    }
}
