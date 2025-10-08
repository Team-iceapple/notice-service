import { BaseDetailDto } from '@src/notice/common/base/base-notice.dto';

export class SojoongDetailDto extends BaseDetailDto {}

export interface SwNoticeItem {
    boardSn: number;
    title: string;
    regDateFormat: string;
    fileExistance: 'fileExist' | 'fileNonExist';
    important: 0 | 1;
    viewCnt: number;
    regStaffNm: string;
}
