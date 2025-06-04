import { Module } from '@nestjs/common';
import { NoticesModule } from './notice/notice.module';

@Module({
    imports: [NoticesModule],
})
export class AppModule {}
