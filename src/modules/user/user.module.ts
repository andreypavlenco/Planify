import { DataBaseModule } from 'src/database/database.module';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { UserProviders } from 'src/database/providers';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [DataBaseModule, RoleModule],
  providers: [UserService, ...UserProviders, UserRepository],
  exports: [UserService],
})
export class UserModule {}
