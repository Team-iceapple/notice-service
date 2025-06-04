import {Injectable, NotFoundException} from '@nestjs/common';

import {NoticeRepository} from './repositories/notice.repository';
import {NoticeListDto} from './dto/notice.list.dto';
import {NoticeDetailDto} from './dto/notice.detail.dto';
import {NoticeSimpleDto} from './dto/notice.simple.dto';

@Injectable()
export class NoticeService {
  constructor(private readonly repo: NoticeRepository) {}

  async getAllNotices(): Promise<NoticeListDto[]> {
    return this.repo.findAllSimple();
  }

  async getPinnedNotices(): Promise<NoticeSimpleDto[]> {
    return this.repo.findPinnedSimple();
  }

  async getNoticeDetail(id: string): Promise<NoticeDetailDto> {
    const detail = await this.repo.findOneDetail(id);
    if (!detail) {
      throw new NotFoundException(
        `존재하지 않는 공지사항 ID입니다. (id=${id})`,
      );
    }
    return detail;
  }
}
