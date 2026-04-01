import { Controller, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service'; // Service import
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('users')
@UseGuards(SupabaseAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('members')
    async getMembers(@Request() req: any) {
        const userId = req.user.sub;
        return this.usersService.getMembers(userId);
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
