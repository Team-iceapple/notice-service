import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { MobileRepository } from '@src/notice/mobile/repositories/mobile.repository';
import { BaseNoticeService } from '@src/notice/common/base/base-notice.service';
import { MobileListDto } from '@src/notice/mobile/dto/mobile.list.dto';
import { MobileDetailDto } from '@src/notice/mobile/dto/mobile.detail.dto';
import { MobileSimpleDto } from '@src/notice/mobile/dto/mobile.simple.dto';

@Injectable()
export class MobileService extends BaseNoticeService<
    MobileListDto,
    MobileDetailDto,
    MobileSimpleDto
> {
    constructor(
        repository: MobileRepository,
        @Inject(CACHE_MANAGER) cacheManager: Cache,
    ) {
        super(repository, cacheManager);
    }

    protected getCachePrefix(): string {
        return 'mobile';
    }

    protected getNotFoundMessage(id: string): string {
        return `존재하지 않는 공지사항 ID입니다. (id=${id})`;
    }

    protected async fetchPage(
        page: number,
        limit: number,
    ): Promise<MobileListDto[]> {
        return this.repository.findAllSimple(page, limit);
    }

    async getAllMobile(limit = 30, pinnedLimit = 3): Promise<MobileListDto[]> {
        return this.getAllWithPagination(limit, pinnedLimit);
    }

    async getPinnedMobile(): Promise<MobileSimpleDto[]> {
        return this.getPinned();
    }

    async getMobileDetail(id: string): Promise<MobileDetailDto> {
        return this.getDetail(id);
    }
}
