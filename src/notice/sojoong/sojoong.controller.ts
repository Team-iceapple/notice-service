import {Controller, Get, Param} from '@nestjs/common';
import {SojoongService} from './sojoong.service';
import {SojoongListDto} from './dto/sojoong.list.dto';
import {SojoongDetailDto} from './dto/sojoong.detail.dto';
import {SojoongSimpleDto} from './dto/sojoong.simple.dto';

@Controller('api/sojoong')
export class SojoongController {
    constructor(private readonly service: SojoongService) {
    }

    @Get()
    async getAll(): Promise<{ notices: SojoongListDto[] }> {

        const list = await this.service.getAllSojoong();
        return {notices: list};
    }

    @Get('pin')
    async getPinned(): Promise<{ notices: SojoongSimpleDto[] }> {
        const list = await this.service.getPinnedSojoong();
        return {notices: list};
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<SojoongDetailDto> {
        return this.service.getSojoongDetail(id);
    }
}