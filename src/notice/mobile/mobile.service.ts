import {Injectable, NotFoundException, Inject} from '@nestjs/common';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import {Cache} from 'cache-manager';

import {MobileRepository} from './repositories/mobile.repository';
import {MobileListDto} from './dto/mobile.list.dto';
import {MobileDetailDto} from './dto/mobile.detail.dto';
import {MobileSimpleDto} from './dto/mobile.simple.dto';

@Injectable()
export class MobileService {
    constructor(
        private readonly repo: MobileRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
    }

    async getAllMobile(limit = 30, pinnedLimit = 3): Promise<MobileListDto[]> {
        const cacheKey = `mobile_all_${limit}_${pinnedLimit}`;

        // 캐시 확인
        const cached = await this.cacheManager.get<MobileListDto[]>(cacheKey);
        if (cached) {
            return cached;
        }

        // 캐시 없으면 크롤링
        const pinnedNotices = new Map<string, MobileListDto>();
        const regularNotices = new Map<string, MobileListDto>();
        const regularLimit = limit - pinnedLimit;
        let currentPage = 1;

        while (true) {
            const noticesFromPage = await this.repo.findAllSimple(currentPage);

            if (noticesFromPage.length === 0) {
                break;
            }

            for (const notice of noticesFromPage) {
                if (notice.is_pin) {
                    if (pinnedNotices.size < pinnedLimit && !pinnedNotices.has(notice.id)) {
                        pinnedNotices.set(notice.id, notice);
                    }
                } else {
                    if (regularNotices.size < regularLimit && !regularNotices.has(notice.id)) {
                        regularNotices.set(notice.id, notice);
                    }
                }
            }

            if (pinnedNotices.size >= pinnedLimit && regularNotices.size >= regularLimit) {
                break;
            }

            currentPage++;
        }

        const pinnedArray = Array.from(pinnedNotices.values()).sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        const regularArray = Array.from(regularNotices.values()).sort((a, b) => {
            return (b.num ?? 0) - (a.num ?? 0);
        });

        const result = [...pinnedArray, ...regularArray];

        // 캐시 저장 (5분)
        await this.cacheManager.set(cacheKey, result, 300000);

        return result;
    }

    async getPinnedMobile(): Promise<MobileSimpleDto[]> {
        return this.repo.findPinnedSimple();
    }

    async getMobileDetail(id: string): Promise<MobileDetailDto> {
        const detail = await this.repo.findOneDetail(id);
        if (!detail) {
            throw new NotFoundException(
                `존재하지 않는 공지사항 ID입니다. (id=${id})`,
            );
        }
        return detail;
    }
}
