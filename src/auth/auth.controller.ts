import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/singup.dto';
import { LoginpDto } from './dto/login.dto';
import { ILoginReturnType, ISignupReturnType } from './types.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  singup(@Body() signupDto: SignupDto): Promise<ISignupReturnType> {
    return this.authService.createUser(signupDto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginpDto): Promise<ILoginReturnType> {
    return this.authService.findUser(loginDto);
  }

  @Get('/check-authorization')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  authorize(@Req() req): { message: string; data: { name: string; } } {
    return {
      message: 'Authorized!',
      data: {
        name: req.user.name,
      }
    }
  }
}
