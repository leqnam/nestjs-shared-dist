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
exports.AbstractSearchDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AbstractSearchDto {
    get page() {
        return this._page;
    }
    set page(value) {
        this._page = Math.max(Number(value) || 1, 1);
    }
    get take() {
        return this._take;
    }
    set take(value) {
        this._take = Math.min(Math.max(Number(value) || 10, 1), 100);
    }
    constructor() {
        this._take = 10;
        this._page = 1;
    }
}
exports.AbstractSearchDto = AbstractSearchDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AbstractSearchDto.prototype, "q", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'page must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'page must be at least 1' }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], AbstractSearchDto.prototype, "page", null);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'take must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'take must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'take must not be greater than 100' }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], AbstractSearchDto.prototype, "take", null);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], AbstractSearchDto.prototype, "orderBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AbstractSearchDto.prototype, "orderByField", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC', 'asc', 'desc'], {
        message: 'orderByDirection must be ASC or DESC',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toUpperCase()),
    __metadata("design:type", String)
], AbstractSearchDto.prototype, "orderByDirection", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    __metadata("design:type", Boolean)
], AbstractSearchDto.prototype, "exact", void 0);
