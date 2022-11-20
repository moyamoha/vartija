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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const category_service_1 = require("./category.service");
const user_service_1 = require("./user.service");
let TaskService = class TaskService {
    constructor(userService, categoryServive) {
        this.userService = userService;
        this.categoryServive = categoryServive;
    }
    async deleteInActives() {
        const users = await this.userService.getInActives();
        for (const user of users) {
            if (user.lastLoggedIn &&
                !user.isActive &&
                Date.now() - Date.parse(user.lastLoggedIn.toISOString()) >=
                    1 * 2629800000) {
                await this.userService.deleteAccount(user._id);
                const userCategs = await this.categoryServive.getAll(user._id);
                for (const categ of userCategs) {
                    await this.categoryServive.deleteCategory(categ._id, user._id);
                }
            }
        }
    }
};
__decorate([
    (0, schedule_1.Cron)('* 55 23 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskService.prototype, "deleteInActives", null);
TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        category_service_1.CategoryService])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map