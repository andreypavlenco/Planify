import { Body, Controller, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Public } from '../../common/decorators';
import { AUTH_CONTROLLER, AUTH_ROUTES } from './constants';

@ApiTags('Auth')
@Controller(AUTH_CONTROLLER)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @ApiBody({ type: LoginAuthDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post(AUTH_ROUTES.SIGN_IN)
  singIn(@Body() dto: LoginAuthDto) {
    return this.authService.singIn(dto);
  }

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User registered successfully',
    schema: {
      example: {
        id: 1,
        email: 'example@example.com',
        createdAt: '2025-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid registration data',
  })
  @ApiBody({ type: RegisterAuthDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post(AUTH_ROUTES.SIGN_UP)
  singUp(@Body() dto: RegisterAuthDto) {
    return this.authService.singUp(dto);
  }
}
