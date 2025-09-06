import {Controller, Get, Param} from '@nestjs/common';
import {MobileService} from './mobile.service';
import {MobileListDto} from './dto/mobile.list.dto';
import {MobileDetailDto} from './dto/mobile.detail.dto';
import {MobileSimpleDto} from './dto/mobile.simple.dto';

@Controller('mobile')
export class MobileController {
    constructor(private readonly service: MobileService) {
    }

    @Get()
    async getAll(): Promise<{ mobiles: MobileListDto[] }> {
        const list = await this.service.getAllMobile();
        return {mobiles: list};
    }

    @Get('pin')
    async getPinned(): Promise<{ mobiles: MobileSimpleDto[] }> {
        const list = await this.service.getPinnedMobile();
        return {mobiles: list};
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<MobileDetailDto> {
        return this.service.getMobileDetail(id);
    }
}
