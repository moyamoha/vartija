import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/schemas/user.schema';
import { UserService } from './user.service';
export declare class AuthService {
    private userService;
    private jwtService;
    private mailerService;
    constructor(userService: UserService, jwtService: JwtService, mailerService: MailerService);
    login(user: UserDocument): Promise<{
        accessToken: string;
    }>;
    validateUser(email: string, pass: string): Promise<UserDocument>;
    singup(userObj: Partial<UserDocument>): Promise<void>;
    sendVerificationCode(user: UserDocument): Promise<void>;
    verifyLogin(code: number): Promise<{
        accessToken: string;
    }>;
    sendTemporaryPassword(email: string): Promise<void>;
}
