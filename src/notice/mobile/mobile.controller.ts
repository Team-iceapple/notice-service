import { Controller, Get, Param } from '@nestjs/common';

import { MobileService } from '@src/notice/mobile/mobile.service';
import { MobileListDto } from '@src/notice/mobile/dto/mobile.list.dto';
import { MobileDetailDto } from '@src/notice/mobile/dto/mobile.detail.dto';
import { MobileSimpleDto } from '@src/notice/mobile/dto/mobile.simple.dto';

@Controller('mobile')
export class MobileController {
    constructor(private readonly service: MobileService) {}

    @Get()
    async getAll(): Promise<{ mobiles: MobileListDto[] }> {
        const list = await this.service.getAllMobile();
        return { mobiles: list };
    }

    @Get('pin')
    async getPinned(): Promise<{ mobiles: MobileSimpleDto[] }> {
        const list = await this.service.getPinnedMobile();
        return { mobiles: list };
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<MobileDetailDto> {
        return this.service.getMobileDetail(id);
    }
}
