export class MobileListDto {
    id: string;
    num: number | null;
    title: string;
    created_at: string;
    updated_at: string | null;
    has_attachment: boolean;
    is_pin: boolean;
    url: string;
}