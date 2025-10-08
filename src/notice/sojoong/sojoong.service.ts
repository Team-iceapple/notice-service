import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import {SojoongRepository} from "@src/notice/sojoong/repositories/sojoong.repository";
import { BaseNoticeService } from '@src/notice/common/base/base-notice.service';
import {SojoongSimpleDto} from "@src/notice/sojoong/dto/sojoong.simple.dto";
import {SojoongDetailDto} from "@src/notice/sojoong/dto/sojoong.detail.dto";
import {SojoongListDto} from "@src/notice/sojoong/dto/sojoong.list.dto";

@Injectable()
export class SojoongService extends BaseNoticeService<
    SojoongListDto,
    SojoongDetailDto,
    SojoongSimpleDto
> {
    constructor(
        repository: SojoongRepository,
        @Inject(CACHE_MANAGER) cacheManager: Cache,
    ) {
        super(repository, cacheManager);
    }

    protected getCachePrefix(): string {
        return 'sojoong';
    }

    protected getNotFoundMessage(id: string): string {
        return `존재하지 않는 공지사항 ID입니다. (id=${id})`;
    }

    protected async fetchPage(
        page: number,
        limit: number,
    ): Promise<SojoongListDto[]> {
        return this.repository.findAllSimple(page, limit);
    }

    async getAllSojoong(
        limit = 30,
        pinnedLimit = 3,
    ): Promise<SojoongListDto[]> {
        return this.getAllWithPagination(limit, pinnedLimit);
    }

    async getPinnedSojoong(): Promise<SojoongSimpleDto[]> {
        return this.getPinned();
    }

    async getSojoongDetail(id: string): Promise<SojoongDetailDto> {
        return this.getDetail(id);
    }
}
