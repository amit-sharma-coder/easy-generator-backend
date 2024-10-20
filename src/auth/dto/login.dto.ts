import { IsNotEmpty, IsString } from "class-validator";

export class LoginpDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}