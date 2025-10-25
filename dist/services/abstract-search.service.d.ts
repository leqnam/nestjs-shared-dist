import { Repository } from 'typeorm';
import { AbstractSearchDto } from '../dtos/abstract-search.dto';
import { SearchResultDto } from '../dtos/search-result.dto';
import { AbstractEntity } from '../entities/abstract.entity';
export declare abstract class AbstractSearchService<T extends AbstractEntity, S extends AbstractSearchDto<T>> {
    protected readonly repo: Repository<T>;
    protected constructor(repo: Repository<T>);
    protected queryBuilder(model: S): import("typeorm").FindOptionsWhere<AbstractEntity<import("..").AbstractDto>>;
    paginate(model: S): Promise<SearchResultDto<T>>;
}
