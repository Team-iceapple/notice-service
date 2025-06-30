import {Injectable, NotFoundException} from '@nestjs/common';

import {MobileRepository} from './repositories/mobile.repository';
import {MobileListDto} from './dto/mobile.list.dto';
import {MobileDetailDto} from './dto/mobile.detail.dto';
import {MobileSimpleDto} from './dto/mobile.simple.dto';

@Injectable()
export class MobileService {
  constructor(private readonly repo: MobileRepository) {}

  async getAllMobile(): Promise<MobileListDto[]> {
    return this.repo.findAllSimple();
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
