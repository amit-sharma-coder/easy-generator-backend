import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import { SignupDto } from './dto/singup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginpDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload, ILoginReturnType, ISignupReturnType } from './types.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(signupDto: SignupDto): Promise<ISignupReturnType> {
    const { email, name, password } = signupDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await this.userModel.create({
        email,
        name,
        password: hashedPassword,
      });
      return {
        message: 'Signup successful',
      };
    } catch (error) {
      if (error.code === 11000) {
        // 11000 is the code for duplicate records for email
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findUser(loginDto: LoginpDto): Promise<ILoginReturnType> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: IJwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      return { message: 'Login successful', token: accessToken };
    }
    throw new UnauthorizedException('Please check your login credentials');
  }

  async findOne(payload: IJwtPayload): Promise<User> {
    const { email } = payload;
    const user: User = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
