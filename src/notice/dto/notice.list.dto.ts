export class NoticeListDto {
    id: string;
    title: string;
    created_at: string;
    updated_at: string | null;
    has_attachment: boolean;
    is_pin: boolean;
    url: string;
}
