import { SwNoticeItem } from './sojoong.detail.dto';

export class SojoongListDto {
    id: string;
    title: string;
    created_at: string;
    updated_at: string | null;
    has_attachment: boolean;
    is_pin: boolean;
    url: string;

    static from(item: SwNoticeItem, apiPath: string): SojoongListDto {
        const dto = new SojoongListDto();
        dto.id = item.boardSn.toString();
        // dto.num = null; // num을 사용한다면
        dto.title = item.title;
        dto.created_at = `${item.regDateFormat}T00:00:00+09:00`;
        dto.updated_at = null;
        dto.has_attachment = item.fileExistance === 'fileExist';
        dto.is_pin = item.important === 1;
        dto.url = `/${apiPath}/${item.boardSn}`;
        return dto;
    }
}