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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("../schemas/category.schema");
const entry_schema_1 = require("../schemas/entry.schema");
let CategoryService = class CategoryService {
    constructor(categoryModel, entryModel) {
        this.categoryModel = categoryModel;
        this.entryModel = entryModel;
    }
    async getAll(ownerId) {
        return await this.categoryModel
            .find({
            owner: ownerId,
        })
            .sort({ name: 1 })
            .collation({ locale: 'en' })
            .populate('items');
    }
    async createCategory(data, ownerId) {
        try {
            const category = new this.categoryModel(Object.assign(Object.assign({}, data), { owner: ownerId }));
            return await category.save();
        }
        catch (e) {
            throw new common_1.BadRequestException(e, e.message);
        }
    }
    async getCategory(id, ownerId) {
        const category = await this.categoryModel
            .findOne({
            owner: ownerId,
            _id: id,
        })
            .populate('items');
        if (!category) {
            throw new common_1.NotFoundException(`Category ${id} was not found`);
        }
        return category;
    }
    async deleteCategory(id, ownerId) {
        const categoryBeforeDeletion = await this.categoryModel.findOneAndDelete({
            _id: id,
            ownerId: ownerId,
        });
        if (!categoryBeforeDeletion) {
            throw new common_1.NotFoundException(`Category ${id} was not found`);
        }
        await this.entryModel.deleteMany({
            category: categoryBeforeDeletion._id,
            owner: ownerId,
        });
    }
    async editCategory(id, ownerId, categ) {
        const updated = await this.categoryModel
            .findOneAndUpdate({
            _id: id,
            owner: ownerId,
        }, categ, {
            returnDocument: 'after',
            runValidators: true,
        })
            .populate('items');
        if (!updated) {
            throw new common_1.NotFoundException(`Category ${id} was not found`);
        }
        return updated;
    }
};
CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(1, (0, mongoose_1.InjectModel)(entry_schema_1.Entry.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map