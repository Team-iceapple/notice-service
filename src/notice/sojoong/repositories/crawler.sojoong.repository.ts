import { load } from 'cheerio';

import { Injectable } from '@nestjs/common';

import {fetchSwNoticeDetailPage, fetchSwNoticeList} from '@src/common/utils/crawler';
import { cleanHtmlPreserveTags } from '@src/common/utils/htmlCleaner';
import {SojoongRepository} from "@src/notice/sojoong/repositories/sojoong.repository";
import {SojoongListDto} from "@src/notice/sojoong/dto/sojoong.list.dto";
import {SojoongDetailDto, SwNoticeItem} from "@src/notice/sojoong/dto/sojoong.detail.dto";
import {SojoongSimpleDto} from "@src/notice/sojoong/dto/sojoong.simple.dto";

@Injectable()
export class CrawlerSojoongRepository implements SojoongRepository {
    private readonly baseUrl = 'https://sw.hanbat.ac.kr';

    async findAllSimple(
        page: number,
        limit: number,
    ): Promise<SojoongListDto[]> {
        const rows = await fetchSwNoticeList(page, limit);

        return rows.map((item: SwNoticeItem) =>
            SojoongListDto.from(item, 'api/notice/sojoong'),
        );
    }

    async findPinnedSimple(): Promise<SojoongSimpleDto[]> {
        const all = await this.findAllSimple(1, 30);
        return all
            .filter((item) => item.is_pin)
            .map((item) => ({
                id: item.id,
                title: item.title,
            }));
    }

    async findOneDetail(id: string): Promise<SojoongDetailDto | null> {
        const list = await this.findAllSimple(1, 30);
        const found = list.find((item) => item.id === id);
        if (!found) return null;

        const html = await fetchSwNoticeDetailPage(id);
        if (!html) return null;

        const $ = load(html);

        const contentHtml = $('.detail-content-body').html();
        const cleanedContent = contentHtml
            ? cleanHtmlPreserveTags(contentHtml)
            : '';

        return {
            id,
            title: $('.flex.ali-cen').text().trim(),
            created_at: found.created_at,
            is_pin: found.is_pin,
            content: cleanedContent,
            url: `https://sw.hanbat.ac.kr/community/noticeDetail?boardSn=${id}`,
            has_attachment: $('.board-view .file-box a').length > 0,
        };
    }
}
