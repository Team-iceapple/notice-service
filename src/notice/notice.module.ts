import {Module} from '@nestjs/common';

import {NoticeRepository} from './repositories/notice.repository';
import {NoticeController} from './notice.controller';
import {NoticeService} from './notice.service';
import {CrawlerNoticeRepository} from './repositories/crawler.notice.repository';

@Module({
    controllers: [NoticeController],
    providers: [
        NoticeService,
        {provide: NoticeRepository, useClass: CrawlerNoticeRepository},
    ],
    exports: [NoticeService],
})
export class NoticesModule {
}
