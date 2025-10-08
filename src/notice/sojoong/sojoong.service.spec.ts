import { Test, TestingModule } from '@nestjs/testing';

import {SojoongService} from "@src/notice/sojoong/sojoong.service";

describe('SojoongService', () => {
    let service: SojoongService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SojoongService],
        }).compile();

        service = module.get<SojoongService>(SojoongService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
