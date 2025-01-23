import { DataBaseModule } from 'src/database/database.module';
import { userProviders } from './providers/user.providers';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DataBaseModule],
  providers: [
    UserService,
    ...userProviders,
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
