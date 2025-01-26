import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAuthDto extends CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    minLength: 2,
    maxLength: 50,
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
    minLength: 2,
    maxLength: 50,
  })
  lastName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for the user account',
    minLength: 8,
    maxLength: 50,
  })
  password: string;
}
