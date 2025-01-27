import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
    format: 'email',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description: 'The password of the user',
    minLength: 8,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(8, 50, { message: 'Password must be between 8 and 50 characters' })
  @Exclude()
  password: string;

  @ApiProperty({
    example: 'some-refresh-token',
    description: 'The refresh token for the user',
    minLength: 8,
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsNotEmpty({ message: 'Refresh token cannot be empty' })
  @Length(8, 50, {
    message: 'Refresh token must be between 8 and 50 characters',
  })
  @Exclude()
  refreshToken: string;
}
