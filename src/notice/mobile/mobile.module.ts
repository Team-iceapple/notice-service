import {Module} from '@nestjs/common';

import {MobileRepository} from './repositories/mobile.repository';
import {MobileController} from './mobile.controller';
import {MobileService} from './mobile.service';
import {CrawlerMobileRepository} from './repositories/crawler.mobile.repository';

@Module({
    controllers: [MobileController],
    providers: [
        MobileService,
        {provide: MobileRepository, useClass: CrawlerMobileRepository},
    ],
    exports: [MobileService],
})
export class MobileModule {
}
