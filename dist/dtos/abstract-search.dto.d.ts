import { FindOptionsOrder } from 'typeorm';
export declare class AbstractSearchDto<TEntity> {
    private _take;
    private _page;
    q?: string;
    get page(): number;
    set page(value: number);
    get take(): number;
    set take(value: number);
    orderBy?: FindOptionsOrder<TEntity>;
    orderByField?: string;
    orderByDirection?: 'ASC' | 'DESC';
    exact?: boolean;
    constructor();
}
