import {Injectable, NotFoundException} from '@nestjs/common';

import {MobileRepository} from './repositories/mobile.repository';
import {MobileListDto} from './dto/mobile.list.dto';
import {MobileDetailDto} from './dto/mobile.detail.dto';
import {MobileSimpleDto} from './dto/mobile.simple.dto';

@Injectable()
export class MobileService {
    constructor(private readonly repo: MobileRepository) {
    }

    async getAllMobile(limit = 30): Promise<MobileListDto[]> {
        const pinnedNotices = new Map<string, MobileListDto>();
        const regularNotices = new Map<string, MobileListDto>();
        let currentPage = 1;

        while (regularNotices.size < limit) {
            const noticesFromPage = await this.repo.findAllSimple(currentPage);

            if (noticesFromPage.length === 0) {
                break;
            }

            for (const notice of noticesFromPage) {
                if (notice.is_pin) {
                    if (!pinnedNotices.has(notice.id)) {
                        pinnedNotices.set(notice.id, notice);
                    }
                } else {
                    if (regularNotices.size < limit && !regularNotices.has(notice.id)) {
                        regularNotices.set(notice.id, notice);
                    }
                }
            }
            currentPage++;
        }

        const pinnedArray = Array.from(pinnedNotices.values()).sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        const regularArray = Array.from(regularNotices.values()).sort((a, b) => {
            return (b.num ?? 0) - (a.num ?? 0);
        });

        return [...pinnedArray, ...regularArray];
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
