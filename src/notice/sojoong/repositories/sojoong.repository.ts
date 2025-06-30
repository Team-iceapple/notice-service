import {SojoongDetailDto} from '../dto/sojoong.detail.dto';
import {SojoongListDto} from '../dto/sojoong.list.dto';
import {SojoongSimpleDto} from '../dto/sojoong.simple.dto';

export abstract class SojoongRepository {
    abstract findAllSimple(): Promise<SojoongListDto[]>;

    abstract findPinnedSimple(): Promise<SojoongSimpleDto[]>;

    abstract findOneDetail(id: string): Promise<SojoongDetailDto | null>;
}
