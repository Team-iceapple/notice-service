import {NoticeDetailDto} from '../dto/notice.detail.dto';
import {NoticeListDto} from '../dto/notice.list.dto';
import {NoticeSimpleDto} from '../dto/notice.simple.dto';

export abstract class NoticeRepository {
    abstract findAllSimple(): Promise<NoticeListDto[]>;

    abstract findPinnedSimple(): Promise<NoticeSimpleDto[]>;

    abstract findOneDetail(id: string): Promise<NoticeDetailDto | null>;
}
