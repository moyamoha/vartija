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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const auth_token_gaurd_1 = require("../config/auth-token.gaurd");
const user_service_1 = require("../services/user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async deleteAccount(req) {
        await this.userService.deactivate(req.user);
    }
    async toggleMfa(req, mfaEnabled) {
        const updated = await this.userService.changeMfaState(req.user._id, mfaEnabled);
        return {
            email: updated.email,
            firstname: updated.firstname,
            lastname: updated.lastname,
            mfaEnabled: updated.mfaEnabled,
        };
    }
    async confirmEmail(id) {
        return await this.userService.confirmEmail(id);
    }
    async changeName(req, body) {
        await this.userService.changeName(req.user, body);
    }
    async changePassword(req, body) {
        if (await bcrypt.compare(body.newPassword, req.user.password)) {
            throw new common_1.BadRequestException('New password can not the same as old password');
        }
        if (!(await bcrypt.compare(body.currentPassword, req.user.password))) {
            throw new common_1.BadRequestException('Current password is incorrect!');
        }
        await this.userService.changePassword(req.user, body);
    }
};
__decorate([
    (0, common_1.UseGuards)(auth_token_gaurd_1.AuthTokenGaurd),
    (0, common_1.Patch)('deactivate'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_gaurd_1.AuthTokenGaurd),
    (0, common_1.Patch)('toggle-mfa'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('mfaEnabled')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "toggleMfa", null);
__decorate([
    (0, common_1.Get)('confirm'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "confirmEmail", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_gaurd_1.AuthTokenGaurd),
    (0, common_1.Put)('change-name'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeName", null);
__decorate([
    (0, common_1.UseGuards)(auth_token_gaurd_1.AuthTokenGaurd),
    (0, common_1.Patch)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map