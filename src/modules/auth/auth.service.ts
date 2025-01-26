import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthTokens } from './types';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ERROR_MESSAGES } from 'src/common/constants';
import { handleHttpException } from 'src/common/exceptions/handle-http.exception';
import { JwtTokenService } from './token/jwt-token.service';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async login(dto: LoginAuthDto): Promise<AuthTokens> {
    try {
      const user = await this.validateLoginCredentials(dto);
      const tokens = await this.jwtTokenService.generateTokens({
        email: user.email,
        id: user.id,
      });
      const hashedRefreshToken = await bcrypt.hash(
        tokens.refreshToken,
        this.saltRounds,
      );

      await this.userService.updateUser(user.id, {
        refreshToken: hashedRefreshToken,
      });

      return tokens;
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.AUTH.LOGIN_FAILED);
    }
  }

  async register(dto: RegisterAuthDto): Promise<AuthTokens> {
    try {
      const emailExists = await this.userService.doesEmailExist(dto.email);

      if (emailExists) {
        throw new BadRequestException(
          `${ERROR_MESSAGES.USER.EMAIL_EXISTS}: ${dto.email}`,
        );
      }

      const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);
      const newUser = await this.userService.createUser({
        ...dto,
        password: hashedPassword,
      });

      const tokens = await this.jwtTokenService.generateTokens({
        email: newUser.email,
        id: newUser.id,
      });

      const hashedRefreshToken = await bcrypt.hash(
        tokens.refreshToken,
        this.saltRounds,
      );
      await this.userService.updateUser(newUser.id, {
        refreshToken: hashedRefreshToken,
      });

      return tokens;
    } catch (error) {
      handleHttpException(error, ERROR_MESSAGES.AUTH.REGISTRATION_FAILED);
    }
  }

  private async validateLoginCredentials(dto: LoginAuthDto): Promise<User> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    return user;
  }
}
