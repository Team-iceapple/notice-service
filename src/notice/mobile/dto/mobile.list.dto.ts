import { BaseListDto } from '@src/notice/common/base/base-notice.dto';

export type MobileNoticeItem = {
    id: string;
    num: number | null;
    title: string;
    isPin: boolean;
    createdAt: string;
    hasAttachment: boolean;
};

export class MobileListDto extends BaseListDto {
    num: number | null;

    static from(item: MobileNoticeItem, apiPath: string): MobileListDto {
        const dto = new MobileListDto({
            id: item.id,
            title: item.title,
            created_at: item.createdAt,
            updated_at: null,
            has_attachment: item.hasAttachment,
            is_pin: item.isPin,
            url: `/${apiPath}/${item.id}`,
        });
        dto.num = item.num;
        return dto;
    }
}
