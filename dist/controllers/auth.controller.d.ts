import { AuthService } from 'src/services/auth.service';
import { CustomReq } from 'src/types/custom';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: CustomReq): Promise<void | {
        accessToken: string;
    }>;
    signup(userData: any): Promise<void>;
    verifyCode(body: {
        code: number;
    }): Promise<{
        accessToken: string;
    }>;
    resetPassword(body: {
        email: string;
    }): Promise<void>;
}
