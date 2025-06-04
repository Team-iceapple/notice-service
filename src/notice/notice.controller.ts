import {Controller, Get, Param} from '@nestjs/common';
import {NoticeService} from './notice.service';
import {NoticeListDto} from './dto/notice.list.dto';
import {NoticeDetailDto} from './dto/notice.detail.dto';
import {NoticeSimpleDto} from './dto/notice.simple.dto';

@Controller('api/notice')
export class NoticeController {
    constructor(private readonly service: NoticeService) {
    }

    @Get()
    async getAll(): Promise<{ notices: NoticeListDto[] }> {
        const list = await this.service.getAllNotices();
        return {notices: list};
    }

    @Get('pin')
    async getPinned(): Promise<{ notices: NoticeSimpleDto[] }> {
        const list = await this.service.getPinnedNotices();
        return {notices: list};
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<NoticeDetailDto> {
        return this.service.getNoticeDetail(id);
    }
}
