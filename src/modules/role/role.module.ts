import { DataBaseModule } from 'src/database/database.module';
import { RoleService } from './role.service';
import { Module } from '@nestjs/common';
import { RoleProviders } from 'src/common/providers/role.providers';
import { RoleRepository } from './repository/role.repository';

@Module({
  imports: [DataBaseModule],
  controllers: [],
  providers: [RoleService, ...RoleProviders, RoleRepository],
  exports: [RoleService],
})
export class RoleModule {}
