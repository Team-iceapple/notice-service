import { Cache } from 'cache-manager';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import {INoticeRepository} from "@src/notice/common/interfaces/notice.repository.interface";
import {BaseNoticeListDto, CACHE_TTL_MS} from "@src/notice/common/types/notice.types";


@Injectable()
export abstract class BaseNoticeService<
    TList extends BaseNoticeListDto,
    TDetail,
    TSimple,
> {
    protected constructor(
        protected readonly repository: INoticeRepository<
            TList,
            TDetail,
            TSimple
        >,
        @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
    ) {}

    protected abstract getCachePrefix(): string;
    protected abstract getNotFoundMessage(id: string): string;

    protected async getAllWithPagination(
        limit = 30,
        pinnedLimit = 3,
    ): Promise<TList[]> {
        const cacheKey = `${this.getCachePrefix()}_all_${limit}_${pinnedLimit}`;

        const cached = await this.cacheManager.get<TList[]>(cacheKey);
        if (cached) {
            return cached;
        }

        const pinnedNotices = new Map<string, TList>();
        const regularNotices = new Map<string, TList>();
        const regularLimit = limit - pinnedLimit;
        let currentPage = 1;

        while (true) {
            const noticesFromPage = await this.fetchPage(currentPage, 30);

            if (noticesFromPage.length === 0) {
                break;
            }

            for (const notice of noticesFromPage) {
                if (notice.is_pin) {
                    if (
                        pinnedNotices.size < pinnedLimit &&
                        !pinnedNotices.has(notice.id)
                    ) {
                        pinnedNotices.set(notice.id, notice);
                    }
                } else {
                    if (
                        regularNotices.size < regularLimit &&
                        !regularNotices.has(notice.id)
                    ) {
                        regularNotices.set(notice.id, notice);
                    }
                }
            }

            if (
                pinnedNotices.size >= pinnedLimit &&
                regularNotices.size >= regularLimit
            ) {
                break;
            }

            currentPage++;
        }

        const pinnedArray = Array.from(pinnedNotices.values()).sort((a, b) => {
            return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
        });

        const regularArray = Array.from(regularNotices.values());

        const result = [...pinnedArray, ...regularArray];
        await this.cacheManager.set(cacheKey, result, CACHE_TTL_MS);

        return result;
    }

    async getPinned(): Promise<TSimple[]> {
        return this.repository.findPinnedSimple();
    }

    async getDetail(id: string): Promise<TDetail> {
        const detail = await this.repository.findOneDetail(id);
        if (!detail) {
            throw new NotFoundException(this.getNotFoundMessage(id));
        }
        return detail;
    }

    protected abstract fetchPage(page: number, limit: number): Promise<TList[]>;
}
