import { Controller, Get, Param } from '@nestjs/common';
import {SojoongListDto} from "@src/notice/sojoong/dto/sojoong.list.dto";
import {SojoongService} from "@src/notice/sojoong/sojoong.service";
import {SojoongSimpleDto} from "@src/notice/sojoong/dto/sojoong.simple.dto";
import {SojoongDetailDto} from "@src/notice/sojoong/dto/sojoong.detail.dto";


@Controller('sojoong')
export class SojoongController {
    constructor(private readonly service: SojoongService) {}

    @Get()
    async getAll(): Promise<{ notices: SojoongListDto[] }> {
        const list = await this.service.getAllSojoong();
        return { notices: list };
    }

    @Get('pin')
    async getPinned(): Promise<{ notices: SojoongSimpleDto[] }> {
        const list = await this.service.getPinnedSojoong();
        return { notices: list };
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<SojoongDetailDto> {
        return this.service.getSojoongDetail(id);
    }
}
