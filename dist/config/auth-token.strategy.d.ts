import { Strategy } from 'passport-jwt';
import { UserService } from 'src/services/user.service';
declare const TokenStrategy_base: new (...args: any[]) => Strategy;
export declare class TokenStrategy extends TokenStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: any): Promise<import("../schemas/user.schema").UserDocument>;
}
export {};
