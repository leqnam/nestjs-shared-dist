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
exports.AbstractEntity = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const utils_service_1 = require("../services/utils.service");
const helper_1 = require("../helper");
class AbstractEntity {
    toDto(options) {
        if (!this.dtoClass) {
            return this;
        }
        return utils_service_1.UtilsService.toDto(this.dtoClass, this, options);
    }
}
exports.AbstractEntity = AbstractEntity;
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'createDate',
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: true,
        comment: 'Ngày giờ khởi tạo',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], AbstractEntity.prototype, "createDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'effectDate',
        type: 'timestamp with time zone',
        nullable: true,
        comment: 'Ngày bắt đầu có hiệu lực',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], AbstractEntity.prototype, "effectDate", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({
        name: 'inactiveDate',
        type: 'timestamp with time zone',
        nullable: true,
        comment: 'Ngày hết hiệu lực',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_transformer_1.Transform)(date => (0, helper_1.transformEndOfDate)(date.value)),
    __metadata("design:type", Date)
], AbstractEntity.prototype, "inactiveDate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'dateLastMaint',
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: true,
        comment: 'Ngày giờ cập nhật',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], AbstractEntity.prototype, "dateLastMaint", void 0);
__decorate([
    (0, typeorm_1.VersionColumn)({
        name: 'version',
        type: 'bigint',
        nullable: true,
        comment: "Special column that is automatically set to the entity's version (incremental number) each time you call save from entity manager or repository.",
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], AbstractEntity.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        name: 'addedBy',
        nullable: true,
        comment: 'Được thêm bởi',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AbstractEntity.prototype, "addedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        name: 'editedBy',
        nullable: true,
        comment: 'Được chỉnh sửa bởi',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AbstractEntity.prototype, "editedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'approvedBy', nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AbstractEntity.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', name: 'note', nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AbstractEntity.prototype, "note", void 0);
