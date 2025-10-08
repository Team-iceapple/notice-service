import { Module } from '@nestjs/common';

import {SojoongRepository} from "@src/notice/sojoong/repositories/sojoong.repository";
import {CrawlerSojoongRepository} from "@src/notice/sojoong/repositories/crawler.sojoong.repository";
import {SojoongController} from "@src/notice/sojoong/sojoong.controller";
import {SojoongService} from "@src/notice/sojoong/sojoong.service";


@Module({
    controllers: [SojoongController],
    providers: [
        SojoongService,
        { provide: SojoongRepository, useClass: CrawlerSojoongRepository },
    ],
    exports: [SojoongService],
})
export class SojoongModule {}