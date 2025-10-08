export interface BaseNoticeListDto {
    id: string;
    title: string;
    created_at: string;
    updated_at: string | null;
    has_attachment: boolean;
    is_pin: boolean;
    url: string;
}

export interface BaseNoticeDetailDto {
    id: string;
    title: string;
    created_at: string;
    is_pin: boolean;
    content: string;
    has_attachment: boolean;
    url: string;
}

export interface BaseNoticeSimpleDto {
    id: string;
    title: string;
}

export const CACHE_TTL_MS = 300000;
