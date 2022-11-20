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
exports.EntrySchema = exports.Entry = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Entry = class Entry {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, minlength: 3 }),
    __metadata("design:type", String)
], Entry.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, minlength: 3 }),
    __metadata("design:type", String)
], Entry.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, minlength: 5 }),
    __metadata("design:type", String)
], Entry.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        validate: {
            validator: (v) => /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm.test(v) || v === '',
            message: 'The format of provided url is not correct',
        },
    }),
    __metadata("design:type", String)
], Entry.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], Entry.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], Entry.prototype, "owner", void 0);
Entry = __decorate([
    (0, mongoose_1.Schema)()
], Entry);
exports.Entry = Entry;
exports.EntrySchema = mongoose_1.SchemaFactory.createForClass(Entry);
//# sourceMappingURL=entry.schema.js.map