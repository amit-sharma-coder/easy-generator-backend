import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './types.interface';
import { User } from './user.schema';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  findOne: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('test_secret'),
};

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let authService: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    authService = mockAuthService as unknown as AuthService;
    configService = mockConfigService as unknown as ConfigService;
    jwtStrategy = new JwtStrategy(authService, configService);
  });

  describe('validate', () => {
    it('should return a user if the user is found', async () => {
      const payload: IJwtPayload = { email: 'test@example.com' };
      const mockUser = new User();
      mockAuthService.findOne.mockResolvedValue(mockUser);

      const user = await jwtStrategy.validate(payload);

      expect(user).toEqual(mockUser);
      expect(mockAuthService.findOne).toHaveBeenCalledWith(payload);
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
      const payload: IJwtPayload = { email: 'test@example.com' };
      mockAuthService.findOne.mockImplementation(async () => {
        throw new UnauthorizedException();
      });

      await expect(jwtStrategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.findOne).toHaveBeenCalledWith(payload);
    });
  });
});
