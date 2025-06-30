import {Module} from '@nestjs/common';
import {MobileModule} from './notice/mobile/mobile.module';
import {SojoongModule} from './notice/sojoong/sojoong.module';

@Module({
    imports: [MobileModule, SojoongModule],
})
export class AppModule {
}
