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
var RolesGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const ROLES_KEY = 'roles';
let RolesGuard = RolesGuard_1 = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
        this.logger = new common_1.Logger(RolesGuard_1.name);
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles || requiredRoles.length === 0) {
            this.logger.debug('No roles required, allowing access');
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            this.logger.warn('No user found in request');
            throw new common_1.ForbiddenException('User context not found');
        }
        if (!user.roles || !Array.isArray(user.roles)) {
            this.logger.warn(`User ${user.id || 'unknown'} has no roles array`);
            throw new common_1.ForbiddenException('User roles not available');
        }
        const isSystemAdmin = user.roles.includes('system-admin');
        if (isSystemAdmin) {
            this.logger.debug(`User ${user.id || 'unknown'} has system-admin role, bypassing role checks`);
            return true;
        }
        const hasAnyRole = (user.permissions && user.permissions.length > 0) ||
            requiredRoles.some(role => user.roles.includes(role));
        if (!hasAnyRole) {
            this.logger.warn(`User ${user.id || 'unknown'} missing required roles. Required: ${requiredRoles.join(', ')}, Has: ${user.roles.join(', ')}`);
            throw new common_1.ForbiddenException(`Insufficient roles. Required: ${requiredRoles.join(', ')}`);
        }
        this.logger.debug(`User ${user.id || 'unknown'} has required role: ${requiredRoles.find(role => user.roles.includes(role))}`);
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = RolesGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(core_1.Reflector.name)),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
