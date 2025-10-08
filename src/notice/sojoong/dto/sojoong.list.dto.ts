import { BaseListDto } from '@src/notice/common/base/base-notice.dto';
import {SwNoticeItem} from "@src/notice/sojoong/dto/sojoong.detail.dto";

export class SojoongListDto extends BaseListDto {
    static from(item: SwNoticeItem, apiPath: string): SojoongListDto {
        return new SojoongListDto({
            id: item.boardSn.toString(),
            title: item.title,
            created_at: `${item.regDateFormat}T00:00:00+09:00`,
            updated_at: null,
            has_attachment: item.fileExistance === 'fileExist',
            is_pin: item.important === 1,
            url: `/${apiPath}/${item.boardSn}`,
        });
    }
}
