import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { handleHttpException } from 'src/common/exceptions/handle-http.exception';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly repository: UserRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      return await this.repository.create(dto);
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MESSAGES.USER.CREATE_FAILED);
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.repository.findOne(id);
      if (!user) {
        throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
      }
      return user;
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.USER.NOT_FOUND);
    }
  }
}
