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
exports.EntryController = void 0;
const common_1 = require("@nestjs/common");
const auth_token_gaurd_1 = require("../config/auth-token.gaurd");
const error_interceptor_1 = require("../interceptors/error.interceptor");
const entry_service_1 = require("../services/entry.service");
let EntryController = class EntryController {
    constructor(entryService) {
        this.entryService = entryService;
    }
    async getEntries(req, categId) {
        if (categId)
            return await this.entryService.getEntries(req.user, categId);
        else
            return await this.entryService.getEntries(req.user);
    }
    async getEntry(req, id) {
        return await this.entryService.getEntry(req.user._id, id);
    }
    async editEntry(req, id, entryObj) {
        return await this.entryService.editEntry(req.user._id, id, entryObj);
    }
    async addEntry(body, req, categoryId) {
        return await this.entryService.createEntry(body, req.user._id, categoryId);
    }
    async deleteEntry(req, id) {
        return await this.entryService.deleteEntry(req.user._id, id);
    }
};
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EntryController.prototype, "getEntries", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EntryController.prototype, "getEntry", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], EntryController.prototype, "editEntry", null);
__decorate([
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], EntryController.prototype, "addEntry", null);
__decorate([
    (0, common_1.HttpCode)(204),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EntryController.prototype, "deleteEntry", null);
EntryController = __decorate([
    (0, common_1.UseInterceptors)(error_interceptor_1.ErrorsInterceptor),
    (0, common_1.UseGuards)(auth_token_gaurd_1.AuthTokenGaurd),
    (0, common_1.Controller)('entries'),
    __metadata("design:paramtypes", [entry_service_1.EntryService])
], EntryController);
exports.EntryController = EntryController;
//# sourceMappingURL=entry.controller.js.map