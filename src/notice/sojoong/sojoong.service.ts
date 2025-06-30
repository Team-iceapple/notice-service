import {Injectable, NotFoundException} from '@nestjs/common';
import {SojoongRepository} from './repositories/sojoong.repository';
import {SojoongListDto} from './dto/sojoong.list.dto';
import {SojoongDetailDto} from './dto/sojoong.detail.dto';
import {SojoongSimpleDto} from './dto/sojoong.simple.dto';

@Injectable()
export class SojoongService {
    constructor(private readonly repo: SojoongRepository) {
    }

    async getAllSojoong(): Promise<SojoongListDto[]> {
        return this.repo.findAllSimple();
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