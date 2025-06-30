import {MobileDetailDto} from '../dto/mobile.detail.dto';
import {MobileListDto} from '../dto/mobile.list.dto';
import {MobileSimpleDto} from '../dto/mobile.simple.dto';

export abstract class MobileRepository {
    abstract findAllSimple(): Promise<MobileListDto[]>;

    abstract findPinnedSimple(): Promise<MobileSimpleDto[]>;

    abstract findOneDetail(id: string): Promise<MobileDetailDto | null>;
}
