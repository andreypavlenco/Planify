import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  lastName: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(8, 50, { message: 'Password must be between 8 and 50 characters' })
  @Exclude()
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(8, 50, { message: 'Password must be between 8 and 50 characters' })
  @Exclude()
  refreshToken: string;
}
