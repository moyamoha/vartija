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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const constants_1 = require("../utils/constants");
let UserService = class UserService {
    constructor(userModel, mailerService) {
        this.userModel = userModel;
        this.mailerService = mailerService;
    }
    async createUser(userObj) {
        let created;
        try {
            const mockUser = new this.userModel(userObj);
            await mockUser.validate();
            const hashedPassoword = await bcrypt.hash(userObj.password, 10);
            const newUser = new this.userModel(Object.assign(Object.assign({}, userObj), { password: hashedPassoword, lastLoggedIn: null }));
            created = await newUser.save({ validateBeforeSave: false });
        }
        catch (e) {
            if (e.code === 11000) {
                throw new common_1.BadRequestException('Email address is already taken');
            }
            else {
                throw new common_1.BadRequestException(e, e.message);
            }
        }
        const confirmationLink = `${process.env.SITE_ADDRESS}/users/confirm/?id=${created._id}`;
        await this.mailerService.sendMail({
            from: process.env.EMAIL_SENDER,
            to: created.email,
            text: 'Welcome to Guardian',
            subject: 'Welcome to Guardian',
            html: `<p><strong>Dear ${created.firstname}!</strong><br></br>We are glad you chose Guardian to keep your passwords safe and secure. 
      Before you can do anything, please confirm your email address by clicking <a href="${confirmationLink}">This link</a>
      <br></br><i>Team Guardian.</i></p>`,
        });
        return created;
    }
    async findOneByEmail(email) {
        return await this.userModel.findOne({ email: email });
    }
    async deactivate(user) {
        try {
            user.isActive = false;
            await this.mailerService.sendMail({
                from: process.env.EMAIL_SENDER,
                to: user.email,
                subject: 'Your account is DEACTIVATED',
                html: `<p><strong>Dear ${user.firstname}!</strong><br></br>${constants_1.accountDeactivedEmailResp}
        <br></br><i>Team Guardian.</i></p>`,
            });
            await user.save();
        }
        catch (e) { }
    }
    async deleteAccount(id) {
        const user = await this.userModel.findByIdAndDelete(id);
        await this.mailerService.sendMail({
            from: process.env.EMAIL_SENDER,
            to: user.email,
            subject: 'Your account was DELETED',
            html: `<p><strong>Dear ${user.firstname}!</strong><br></br>${constants_1.accountDeletedEmailResp}
      <br></br><i>Team Guardian.</i></p>`,
        });
    }
    async confirmEmail(id) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User ${id} was not found`);
        }
        user.emailConfirmed = true;
        await user.save();
        return 'You are all set. Enjoy using our application ❤️';
    }
    async getInActives() {
        return await this.userModel.find({ isActive: false });
    }
    async changeMfaState(id, mfaEnabled) {
        try {
            const updated = await this.userModel.findByIdAndUpdate(id, { mfaEnabled: mfaEnabled }, { returnDocument: 'after' });
            const bodyText = mfaEnabled ? constants_1.mfaEnabledEmailResp : constants_1.mfaDisabledEmailResp;
            await this.mailerService.sendMail({
                from: process.env.EMAIL_SENDER,
                to: updated.email,
                subject: mfaEnabled
                    ? 'Your account is now SECURE'
                    : 'Oops! your account is VULNERABLE',
                html: `<p><strong>Dear ${updated.firstname}!</strong><br></br>${bodyText}
        <br></br><i>Team Guardian.</i></p>`,
            });
            return updated;
        }
        catch (e) {
            throw new common_1.BadRequestException('Could not update user');
        }
    }
    async changeName(user, body) {
        user.firstname = body.firstname;
        user.lastname = body.lastname;
        try {
            await user.save();
        }
        catch (e) {
            throw new common_1.BadRequestException(e, e.message);
        }
    }
    async changePassword(user, body) {
        try {
            const mockUser = new this.userModel({
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                password: body.newPassword,
            });
            await mockUser.validate();
            user.password = await bcrypt.hash(body.newPassword, 10);
            await user.save({ validateBeforeSave: false });
        }
        catch (e) {
            throw new common_1.BadRequestException(e, e.message);
        }
    }
    async findUserByCode(code) {
        return await this.userModel.findOne({ verificationCode: code });
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mailer_1.MailerService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map