import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ConfigModule,
    ],
    providers: [JwtStrategy, SupabaseAuthGuard],
    exports: [PassportModule, SupabaseAuthGuard],
})
export class AuthModule { }
