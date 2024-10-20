import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
// import mongoose from 'mongoose';
import { User } from './user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/singup.dto';
import { ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginpDto } from './dto/login.dto';
import { IJwtPayload } from './types.interface';

const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: typeof mockUserModel;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ]
    }).compile();

    // userModel = module.get<mongoose.Model<User>>(getModelToken(User.name));

    authService = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password'
      };
      const hashedPassword = await bcrypt.hash(signupDto.password, 10);

      userModel.create.mockResolvedValue({ ...signupDto, password: hashedPassword });

      const result = await authService.createUser(signupDto);

      expect(result).toEqual({ message: 'Signup successful' });
      expect(userModel.create).toHaveBeenCalledWith({
        email: signupDto.email,
        name: signupDto.name,
        password: expect.any(String), // Check that the password is hashed
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const user:SignupDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password'
      };

      userModel.create.mockRejectedValue({ code: 11000 });

      await expect(authService.createUser(user)).rejects.toThrow(ConflictException);
    });
    
    it('should throw InternalServerErrorException on other errors', async () => {
      const user: SignupDto = { email: 'test@example.com', name: 'Test User', password: 'password' };

      userModel.create.mockRejectedValue(new Error('Some error'));

      await expect(authService.createUser(user)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findUser', () => {
    it('should return a token for a valid user', async () => {
      const loginDto: LoginpDto = {
        email: 'test@example.com',
        password: 'password'
      };
      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const user = {
        email: loginDto.email,
        name: 'Test User',
        password: hashedPassword
      };

      userModel.findOne.mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('token');

      const result = await authService.findUser(loginDto);

      expect(result).toEqual({ message: 'Login successful', token: 'token' });
      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginpDto = { email: 'test@example.com', password: 'wrongpassword' };
      
      userModel.findOne.mockResolvedValue(null);

      await expect(authService.findUser(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findOne', () => {
    it('should return the user for a valid token payload', async () => {
      const payload: IJwtPayload = { email: 'test@example.com' };
      const user = { email: payload.email };

      userModel.findOne.mockResolvedValue(user);

      const result = await authService.findOne(payload);

      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const payload: IJwtPayload = { email: 'test@example.com' };

      userModel.findOne.mockResolvedValue(null);

      await expect(authService.findOne(payload)).rejects.toThrow(UnauthorizedException);
    });
  });

});