export class SojoongDetailDto {
    id: string;
    title: string;
    created_at: string;
    is_pin: boolean;
    content: string;
    has_attachment: boolean;
    url: string;
}

export interface SwNoticeItem {
    boardSn: number;
    title: string;
    regDateFormat: string;
    fileExistance: 'fileExist' | 'fileNonExist';
    important: 0 | 1;
    viewCnt: number;
    regStaffNm: string;
}
