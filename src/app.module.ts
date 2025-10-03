import {Module} from '@nestjs/common';
import {CacheModule} from '@nestjs/cache-manager';
import {MobileModule} from './notice/mobile/mobile.module';
import {SojoongModule} from './notice/sojoong/sojoong.module';

@Module({
    imports: [
        CacheModule.register({
            ttl: 300000,
            isGlobal: true,
        }),
        MobileModule,
        SojoongModule,
    ],
})
export class AppModule {
}
