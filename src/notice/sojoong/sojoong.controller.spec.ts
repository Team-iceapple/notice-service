import {Test, TestingModule} from '@nestjs/testing';

import {SojoongController} from './sojoong.controller';
import {SojoongService} from './sojoong.service';

describe('SojoongController', () => {
    let controller: SojoongController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SojoongController],
            providers: [SojoongService],
        }).compile();

        controller = module.get<SojoongController>(SojoongController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
