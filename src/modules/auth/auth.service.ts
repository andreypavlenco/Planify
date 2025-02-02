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
import { JwtTokenService } from './token/jwt-token.service';
import { WinstonLoggerService } from 'src/shared/utils/logger';
import { handleHttpException } from 'src/shared/exceptions';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async singIn(dto: LoginAuthDto): Promise<AuthTokens> {
    try {
      this.logger.info('Login attempt started', { email: dto.email });

      const user = await this.validateLoginCredentials(dto);
      this.logger.info('User validated successfully', { userId: user.id });

      const tokens = await this.jwtTokenService.generateTokens({
        email: user.email,
        id: user.id,
      });
      this.logger.info('Tokens generated successfully', { userId: user.id });

      const hashedRefreshToken = await bcrypt.hash(
        tokens.refreshToken,
        this.saltRounds,
      );
      await this.userService.updateUser(user.id, {
        refreshToken: hashedRefreshToken,
      });
      this.logger.info('Refresh token stored in the database', {
        userId: user.id,
      });

      return tokens;
    } catch (error) {
      this.logger.error('Login failed', { error: error.message });
      handleHttpException(error, ERROR_MESSAGES.AUTH.LOGIN_FAILED);
    }
  }

  async singUp(dto: RegisterAuthDto): Promise<AuthTokens> {
    try {
      this.logger.info('Registration attempt started', { email: dto.email });

      const emailExists = await this.userService.doesEmailExist(dto.email);
      if (emailExists) {
        this.logger.warn('Email already exists', { email: dto.email });
        throw new BadRequestException(
          `${ERROR_MESSAGES.USER.EMAIL_EXISTS}: ${dto.email}`,
        );
      }

      const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);
      this.logger.info('Password hashed successfully', { email: dto.email });

      const newUser = await this.userService.createUser({
        ...dto,
        password: hashedPassword,
      });
      this.logger.info('User created successfully', { userId: newUser.id });

      const tokens = await this.jwtTokenService.generateTokens({
        email: newUser.email,
        id: newUser.id,
      });
      this.logger.info('Tokens generated successfully', {
        userId: newUser.id,
      });

      const hashedRefreshToken = await bcrypt.hash(
        tokens.refreshToken,
        this.saltRounds,
      );
      await this.userService.updateUser(newUser.id, {
        refreshToken: hashedRefreshToken,
      });
      this.logger.info('Refresh token stored in the database', {
        userId: newUser.id,
      });

      return tokens;
    } catch (error) {
      this.logger.error('Registration failed', { error: error.message });
      handleHttpException(error, ERROR_MESSAGES.AUTH.REGISTRATION_FAILED);
    }
  }

  private async validateLoginCredentials(dto: LoginAuthDto): Promise<User> {
    try {
      this.logger.debug('Validating user credentials', { email: dto.email });

      const user = await this.userService.findByEmail(dto.email);
      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        this.logger.warn('Invalid credentials', { email: dto.email });
        throw new UnauthorizedException(
          ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        );
      }

      this.logger.info('User credentials validated successfully', {
        userId: user.id,
      });
      return user;
    } catch (error) {
      this.logger.error('Credential validation failed', {
        error: error.message,
      });
      throw error;
    }
  }
}
