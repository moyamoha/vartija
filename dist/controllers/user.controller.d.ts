import { UserService } from 'src/services/user.service';
import { CustomReq } from 'src/types/custom';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    deleteAccount(req: CustomReq): Promise<void>;
    toggleMfa(req: CustomReq, mfaEnabled: any): Promise<{
        email: string;
        firstname: string;
        lastname: string;
        mfaEnabled: boolean;
    }>;
    confirmEmail(id: any): Promise<string>;
    changeName(req: CustomReq, body: {
        firstname: string;
        lastname: string;
    }): Promise<void>;
    changePassword(req: CustomReq, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<void>;
}
