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
var PermissionsGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const PERMISSIONS_KEY = 'permissions';
let PermissionsGuard = PermissionsGuard_1 = class PermissionsGuard {
    constructor(reflector) {
        this.reflector = reflector;
        this.logger = new common_1.Logger(PermissionsGuard_1.name);
    }
    canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            this.logger.debug('No permissions required, allowing access');
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            this.logger.warn('No user found in request');
            throw new common_1.ForbiddenException('User context not found');
        }
        if (!user.permissions || !Array.isArray(user.permissions)) {
            this.logger.warn(`User ${user.id || 'unknown'} has no permissions array`);
            throw new common_1.ForbiddenException('User permissions not available');
        }
        const isSystemAdmin = user.roles && user.roles.includes('system-admin');
        if (isSystemAdmin) {
            this.logger.debug(`User ${user.id || 'unknown'} has system-admin role, bypassing permission checks`);
            return true;
        }
        const hasAllPermissions = requiredPermissions.every(permission => user.permissions.includes(permission)) ||
            (user.roles && user.roles.length > 0);
        if (!hasAllPermissions) {
            this.logger.warn(`User ${user.id || 'unknown'} missing required permissions. Required: ${requiredPermissions.join(', ')}, Has: ${user.permissions.join(', ')}`);
            throw new common_1.ForbiddenException(`Insufficient permissions. Required: ${requiredPermissions.join(', ')}`);
        }
        this.logger.debug(`User ${user.id || 'unknown'} has all required permissions: ${requiredPermissions.join(', ')}`);
        return true;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = PermissionsGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(core_1.Reflector.name)),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermissionsGuard);
