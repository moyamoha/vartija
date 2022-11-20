"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const faker_1 = require("@faker-js/faker");
const user_service_1 = require("./user.service");
const random_1 = require("../utils/random");
let AuthService = class AuthService {
    constructor(userService, jwtService, mailerService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
    }
    async login(user) {
        user.lastLoggedIn = new Date();
        if (!user.isActive)
            user.isActive = true;
        const payload = {
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            mfaEnabled: user.mfaEnabled,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
        });
        await user.save();
        return { accessToken };
    }
    async validateUser(email, pass) {
        const user = await this.userService.findOneByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            return user;
        }
        return null;
    }
    async singup(userObj) {
        await this.userService.createUser(userObj);
    }
    async sendVerificationCode(user) {
        const randomNum = parseInt(faker_1.faker.random.numeric(parseInt(process.env.VERIFICATION_CODE_LENGTH), {
            allowLeadingZeros: false,
        }));
        if (!user.mfaEnabled) {
            throw new common_1.ForbiddenException('User has not enabled multi-factorauthentication');
        }
        user.verificationCode = randomNum;
        await user.save();
        this.mailerService.sendMail({
            from: process.env.EMAIL_SENDER,
            to: user.email,
            subject: 'Verification code',
            html: `<p><strong>Dear ${user.firstname}!</strong><br></br>Your verification code is <strong>${randomNum}</strong>
      <br></br><i>Team Guardian.</i></p>`,
        });
    }
    async verifyLogin(code) {
        const foundUser = await this.userService.findUserByCode(code);
        if (foundUser) {
            foundUser.verificationCode = 0;
            await foundUser.save();
            return this.login(foundUser);
        }
        else {
            throw new common_1.UnauthorizedException('The verification code you provided is wrong!');
        }
    }
    async sendTemporaryPassword(email) {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('Email not associated to any user');
        }
        const randomPassword = (0, random_1.randomPass)() + (0, random_1.randomPass)();
        user.password = await bcrypt.hash(randomPassword, 10);
        await user.save();
        this.mailerService.sendMail({
            from: process.env.EMAIL_SENDER,
            to: user.email,
            subject: 'Reset password',
            html: `<p><strong>Dear ${user.firstname}!</strong><br></br>Use this password: <strong>${randomPassword}</strong> to log in. Please make sure to change it after you log in </strong>
      <br></br><i>Team Guardian.</i></p>`,
        });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        mailer_1.MailerService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map