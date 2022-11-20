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
exports.EntryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("../schemas/category.schema");
const entry_schema_1 = require("../schemas/entry.schema");
let EntryService = class EntryService {
    constructor(entryModel, categModel) {
        this.entryModel = entryModel;
        this.categModel = categModel;
    }
    async getEntries(user, categoryId) {
        let entries = [];
        if (categoryId) {
            const category = await this.categModel.findById(categoryId);
            if (!category) {
                throw new common_1.NotFoundException(`Category ${categoryId} was not found`);
            }
            entries = await this.entryModel.find({
                owner: user._id,
                category: categoryId,
            });
        }
        else {
            entries = await this.entryModel.find({
                owner: user._id,
            });
        }
        return entries;
    }
    async getEntry(ownerId, id) {
        const foundEntry = await this.entryModel.findOne({
            owner: ownerId,
            _id: id,
        });
        if (!foundEntry) {
            throw new common_1.NotFoundException(`Entry ${id} was not found`);
        }
        return foundEntry;
    }
    async createEntry(body, ownerId, categoryId) {
        const category = await this.categModel.findOne({
            owner: ownerId,
            _id: categoryId,
        });
        if (!category)
            throw new common_1.NotFoundException(`Category ${categoryId} to which you want to attach new entry, was not found`);
        try {
            const entry = new this.entryModel(Object.assign(Object.assign({}, body), { owner: ownerId, category: categoryId }));
            category.items.push(entry._id);
            await category.save();
            return await entry.save();
        }
        catch (e) {
            throw new common_1.BadRequestException(e, e.message);
        }
    }
    async editEntry(ownerId, id, entryObj) {
        if (entryObj.category) {
            const categ = await this.categModel.findOne({
                _id: entryObj.category,
                owner: ownerId,
            });
            if (!categ) {
                throw new common_1.NotFoundException(`Category ${entryObj.category} to which you want to attach new entry, was not found`);
            }
        }
        try {
            const updated = await this.entryModel.findOneAndUpdate({
                _id: id,
                owner: ownerId,
            }, entryObj, { returnDocument: 'after', runValidators: true });
            return updated;
        }
        catch (e) {
            throw new common_1.BadRequestException(e, e.message);
        }
    }
    async deleteEntry(ownerId, id) {
        const deleted = await this.entryModel.findOneAndDelete({
            _id: id,
            owner: ownerId,
        });
        if (!deleted) {
            throw new common_1.NotFoundException(`Entry ${id} was not found`);
        }
        await this.categModel.findByIdAndUpdate(deleted.category, {
            $pull: { items: deleted._id },
        });
    }
};
EntryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(entry_schema_1.Entry.name)),
    __param(1, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], EntryService);
exports.EntryService = EntryService;
//# sourceMappingURL=entry.service.js.map