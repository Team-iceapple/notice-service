import { Module } from '@nestjs/common';

import { CrawlerMobileRepository } from '@src/notice/mobile/repositories/crawler.mobile.repository';
import { MobileRepository } from '@src/notice/mobile/repositories/mobile.repository';
import { MobileController } from '@src/notice/mobile/mobile.controller';
import { MobileService } from '@src/notice/mobile/mobile.service';

@Module({
    controllers: [MobileController],
    providers: [
        MobileService,
        { provide: MobileRepository, useClass: CrawlerMobileRepository },
    ],
    exports: [MobileService],
})
export class MobileModule {}
