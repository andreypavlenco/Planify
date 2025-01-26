import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: 'John',
    description: 'The updated first name of the user',
    maxLength: 50,
  })
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'The updated last name of the user',
    maxLength: 50,
  })
  lastName?: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'The updated email address of the user',
    format: 'email',
  })
  email?: string;

  @ApiPropertyOptional({
    example: 'newStrongPassword123',
    description: 'The updated password of the user',
    minLength: 8,
    maxLength: 50,
  })
  password?: string;

  @ApiPropertyOptional({
    example: 'refreshTokenValue123',
    description: 'The updated refresh token for the user',
  })
  refreshToken?: string;
}
