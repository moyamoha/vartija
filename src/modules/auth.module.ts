import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { LocalStrategy } from 'src/config/auth-local.strategy';
import { TokenStrategy } from 'src/config/auth-token.strategy';
import { AuthController } from 'src/controllers/auth.controller';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { UserModule } from './user.module';
import {
  UserActivity,
  UserActivitySchema,
} from 'src/schemas/user-activity.schema';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secretOrPrivateKey: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '7d',
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserActivity.name, schema: UserActivitySchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, TokenStrategy],
})
export class AuthModule {}
