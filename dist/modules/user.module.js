"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const category_schema_1 = require("../schemas/category.schema");
const entry_schema_1 = require("../schemas/entry.schema");
const user_schema_1 = require("../schemas/user.schema");
const category_service_1 = require("../services/category.service");
const user_controller_1 = require("../controllers/user.controller");
const task_service_1 = require("../services/task.service");
const user_service_1 = require("../services/user.service");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                { name: entry_schema_1.Entry.name, schema: entry_schema_1.EntrySchema },
            ]),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: process.env.SENDGRID_SERVER,
                    auth: {
                        user: process.env.SENDGRID_USERNAME,
                        pass: process.env.SENDGRID_API_KEY,
                    },
                },
            }),
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, task_service_1.TaskService, user_service_1.UserService, category_service_1.CategoryService],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map