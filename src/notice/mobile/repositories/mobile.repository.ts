import {MobileListDto} from "@src/notice/mobile/dto/mobile.list.dto";
import {MobileSimpleDto} from "@src/notice/mobile/dto/mobile.simple.dto";
import {MobileDetailDto} from "@src/notice/mobile/dto/mobile.detail.dto";


export abstract class MobileRepository {
    abstract findAllSimple(
        page: number,
        limit: number,
    ): Promise<MobileListDto[]>;

    abstract findPinnedSimple(): Promise<MobileSimpleDto[]>;

    abstract findOneDetail(id: string): Promise<MobileDetailDto | null>;
}
