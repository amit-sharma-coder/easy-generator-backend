import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { SignupDto } from './dto/singup.dto';
import { LoginpDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    createUser: jest.fn(),
    findUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should successfully signup a user', async () => {
      const signupDto: SignupDto = { email: 'testuser', name: 'Test User', password: 'testpass' };
      const result = { id: 1, username: 'testuser' };

      mockAuthService.createUser.mockResolvedValue(result);

      expect(await authController.singup(signupDto)).toEqual(result);
      expect(mockAuthService.createUser).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto: LoginpDto = { email: 'testuser', password: 'testpass' };
      const result = { accessToken: 'someAccessToken' };

      mockAuthService.findUser.mockResolvedValue(result);

      expect(await authController.login(loginDto)).toEqual(result);
      expect(mockAuthService.findUser).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('authorize', () => {
    it('should authorize a user', () => {
      const req = { user: { name: 'Test User' } };
      const result = authController.authorize(req as any);
      expect(result).toEqual({
        message: 'Authorized!',
        data: {
          name: 'Test User',
        },
      });
    });
  });
});