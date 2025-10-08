import {BaseNoticeDetailDto, BaseNoticeListDto, BaseNoticeSimpleDto} from "@src/notice/common/types/notice.types";

export abstract class BaseListDto implements BaseNoticeListDto {
    id: string;
    title: string;
    created_at: string;
    updated_at: string | null;
    has_attachment: boolean;
    is_pin: boolean;
    url: string;

    constructor(data?: Partial<BaseNoticeListDto>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export abstract class BaseDetailDto implements BaseNoticeDetailDto {
    id: string;
    title: string;
    created_at: string;
    is_pin: boolean;
    content: string;
    has_attachment: boolean;
    url: string;

    constructor(data?: Partial<BaseNoticeDetailDto>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export abstract class BaseSimpleDto implements BaseNoticeSimpleDto {
    id: string;
    title: string;

    constructor(data?: Partial<BaseNoticeSimpleDto>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
