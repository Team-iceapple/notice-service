import {Injectable, NotFoundException, Inject} from '@nestjs/common';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import {Cache} from 'cache-manager';
import {SojoongRepository} from './repositories/sojoong.repository';
import {SojoongListDto} from './dto/sojoong.list.dto';
import {SojoongDetailDto} from './dto/sojoong.detail.dto';
import {SojoongSimpleDto} from './dto/sojoong.simple.dto';

@Injectable()
export class SojoongService {
    constructor(
        private readonly repo: SojoongRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
    }

    async getAllSojoong(): Promise<SojoongListDto[]> {
        const cacheKey = 'sojoong_all';

        const cached = await this.cacheManager.get<SojoongListDto[]>(cacheKey);
        if (cached) {
            return cached;
        }

        const result = await this.repo.findAllSimple();
        await this.cacheManager.set(cacheKey, result, 300000); // 5분

        return result;
    }

    async getPinnedSojoong(): Promise<SojoongSimpleDto[]> {
        return this.repo.findPinnedSimple();
    }

    async getSojoongDetail(id: string): Promise<SojoongDetailDto> {
        const detail = await this.repo.findOneDetail(id);
        if (!detail) {
            throw new NotFoundException(`존재하지 않는 공지사항 ID입니다. (id=${id})`);
        }
        return detail;
    }
}