import {Module} from '@nestjs/common';
import {SojoongService} from './sojoong.service';
import {SojoongController} from './sojoong.controller';
import {SojoongRepository} from './repositories/sojoong.repository';
import {CrawlerSojoongRepository} from './repositories/crawler.sojoong.repository';

@Module({
    controllers: [SojoongController],
    providers: [
        SojoongService,
        {provide: SojoongRepository, useClass: CrawlerSojoongRepository},
    ],
    exports: [SojoongService],
})
export class SojoongModule {
}