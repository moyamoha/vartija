import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schemas/user.schema';
export declare class UserService {
    private userModel;
    private mailerService;
    constructor(userModel: Model<UserDocument>, mailerService: MailerService);
    createUser(userObj: Partial<UserDocument>): Promise<UserDocument>;
    findOneByEmail(email: string): Promise<UserDocument>;
    deactivate(user: UserDocument): Promise<void>;
    deleteAccount(id: string): Promise<void>;
    confirmEmail(id: string): Promise<string>;
    getInActives(): Promise<UserDocument[]>;
    changeMfaState(id: string, mfaEnabled: boolean): Promise<UserDocument>;
    changeName(user: UserDocument, body: {
        firstname: string;
        lastname: string;
    }): Promise<void>;
    changePassword(user: UserDocument, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<void>;
    findUserByCode(code: number): Promise<UserDocument>;
}
