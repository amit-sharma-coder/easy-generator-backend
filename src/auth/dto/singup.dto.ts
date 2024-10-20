import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must be at least 8 characters long, contain at least one letter, one number, and one special character!'
  })
  password: string;
}