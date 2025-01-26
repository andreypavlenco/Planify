import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtTokenService } from './token/jwt-token.service';
import { PassportModule } from '@nestjs/passport';
import { RoleGuard } from './guards/role.guard';
import { RoleModule } from '../role/role.module';
import { JwtAccessTokenStrategy } from './ strategy/jwt-access.token.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [JwtModule.register({}), UserModule, PassportModule, RoleModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtTokenService,
    JwtAccessTokenStrategy,
    JwtAuthGuard,
    RoleGuard,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
