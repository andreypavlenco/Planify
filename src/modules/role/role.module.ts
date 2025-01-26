import { DataBaseModule } from 'src/database/database.module';
import { RoleService } from './role.service';
import { Module } from '@nestjs/common';
import { RoleRepository } from './repository/role.repository';
import { RoleProviders } from 'src/database/providers';

@Module({
  imports: [DataBaseModule],
  providers: [RoleService, ...RoleProviders, RoleRepository],
  exports: [RoleService],
})
export class RoleModule {}
