"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNullable = exports.cleanNullObject = exports.randomString = exports.getURL = exports.getRequest = exports.remove = void 0;
exports.setupSwagger = setupSwagger;
exports.extractKey = extractKey;
exports.transformEndOfDate = transformEndOfDate;
exports.isDate = isDate;
exports.getTodayFormatYYYYDDMM = getTodayFormatYYYYDDMM;
exports.hasCommonItemInArrays = hasCommonItemInArrays;
exports.convertToAscii = convertToAscii;
exports.isFutureDate = isFutureDate;
exports.isActiveByDate = isActiveByDate;
exports.buildQuery = buildQuery;
exports.paginateRepository = paginateRepository;
const fs_1 = require("fs");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("./constants");
const ILike_1 = require("typeorm/find-options/operator/ILike");
const search_result_dto_1 = require("./dtos/search-result.dto");
const page_meta_dto_1 = require("./dtos/page-meta.dto");
function setupSwagger(app) {
    const options = new swagger_1.DocumentBuilder()
        .setTitle('API')
        .setVersion('3.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('documentation', app, document);
}
function extractKey(path) {
    return (0, fs_1.readFileSync)(path)
        .toString()
        .replace(/\n|\r/g, '')
        .replace(/[-]+[\w\s]+[-]+/g, '');
}
const remove = (arr, predicate) => {
    const results = arr.filter(predicate);
    for (const result of results) {
        arr.splice(arr.indexOf(result), 1);
    }
    return results;
};
exports.remove = remove;
const getRequest = (ctx) => {
    switch (ctx.getType()) {
        case 'ws':
            return ctx.switchToWs().getClient();
        case 'http':
            return ctx.switchToHttp().getRequest();
    }
};
exports.getRequest = getRequest;
const getURL = (request) => {
    return request.protocol + '://' + request.get('host');
};
exports.getURL = getURL;
function transformEndOfDate(date) {
    if (!date || date === 'null')
        return null;
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
}
const randomString = (length = 60) => {
    let output = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        output += characters[Math.floor(Math.random() * length)];
    }
    return output;
};
exports.randomString = randomString;
function isDate(value) {
    let isDate = value instanceof Date;
    if (!isDate && typeof value === 'string' && value.length) {
        const regex = new RegExp(constants_1.REGEX_DATE_YYYY_MM_DD);
        if (regex.test(value))
            isDate = new Date(value).toDateString() !== 'undefined';
    }
    return isDate;
}
const toDate = new Date();
function getTodayFormatYYYYDDMM() {
    return `${toDate.getFullYear()}-${toDate.getMonth() < 10 ? '0' + toDate.getMonth() : toDate.getMonth()}-${toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate()}`;
}
function hasCommonItemInArrays(arr1, arr2) {
    return arr1.some(item => arr2.includes(item));
}
function convertToAscii(str) {
    const asciiArray = [];
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        let asciiValue = char.charCodeAt(0);
        if (asciiValue === 160) {
            asciiValue = 32;
        }
        asciiArray.push(asciiValue);
    }
    return asciiArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}
const cleanNullObject = (obj) => {
    Object.keys(obj).forEach(key => {
        const typedKey = key;
        if (obj[typedKey] === null || obj[typedKey] === "" || obj[typedKey] === undefined) {
            delete obj[typedKey];
        }
    });
    return obj;
};
exports.cleanNullObject = cleanNullObject;
const isNullable = (value) => {
    return value == null || value == undefined;
};
exports.isNullable = isNullable;
function isFutureDate(value) {
    const futureDate = transformEndOfDate(new Date(value));
    if (!futureDate)
        return false;
    const currentDate = new Date();
    return futureDate.getTime() > currentDate.getTime();
}
function isActiveByDate(effectDate, inactiveDate) {
    return !(0, exports.isNullable)(effectDate) &&
        effectDate < new Date() &&
        ((0, exports.isNullable)(inactiveDate) ||
            inactiveDate > new Date());
}
function buildQuery(model) {
    const queryable = {};
    const excludeProperties = ['_page', '_take', '_orderBy', '_exact', '_q', 'orderBy', 'orderByDirection', 'orderByField'];
    Object.keys(model).forEach((key) => {
        const value = model[key];
        if (excludeProperties.includes(key) ||
            value === null ||
            value === undefined ||
            value === '') {
            return;
        }
        if (typeof value === 'string') {
            queryable[key] = model.exact ? value : (0, ILike_1.ILike)(`%${value}%`);
        }
        else if (typeof value === 'number' || typeof value === 'boolean') {
            queryable[key] = value;
        }
        else if (value instanceof Date) {
            queryable[key] = value;
        }
    });
    if (model.q && Object.keys(queryable).length === 0) {
        queryable.fileName = model.exact
            ? model.q
            : (0, ILike_1.ILike)(`%${model.q}%`);
    }
    return queryable;
}
async function paginateRepository(repo, model, defaultOrder) {
    const where = buildQuery(model);
    const itemCount = await repo.countBy(where);
    let order;
    if (model.orderBy) {
        order = model.orderBy;
    }
    else if (model.orderByField && model.orderByDirection) {
        order = { [model.orderByField]: model.orderByDirection };
    }
    else if (model.orderByField) {
        order = { [model.orderByField]: 'ASC' };
    }
    else {
        order = defaultOrder ?? { dateLastMaint: 'DESC' };
    }
    const data = await repo.find({
        where: where,
        skip: (model.page - 1) * model.take,
        take: model.take,
        order: order,
    });
    return new search_result_dto_1.SearchResultDto(new page_meta_dto_1.PageMetaDto({
        pageOptionsDto: {
            take: model.take,
            page: model.page,
            skip: (model.page - 1) * model.take,
        },
        itemCount,
    }), data);
}
