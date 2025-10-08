import {SojoongListDto} from "@src/notice/sojoong/dto/sojoong.list.dto";
import {SojoongSimpleDto} from "@src/notice/sojoong/dto/sojoong.simple.dto";
import {SojoongDetailDto} from "@src/notice/sojoong/dto/sojoong.detail.dto";

export abstract class SojoongRepository {
    abstract findAllSimple(
        page: number,
        limit: number,
    ): Promise<SojoongListDto[]>;

    abstract findPinnedSimple(): Promise<SojoongSimpleDto[]>;

    abstract findOneDetail(id: string): Promise<SojoongDetailDto | null>;
}
