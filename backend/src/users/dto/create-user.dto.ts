import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  username: string;
}