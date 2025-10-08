import { Injectable } from '@nestjs/common';
import { load } from 'cheerio';

import { MobileRepository } from '@src/notice/mobile/repositories/mobile.repository';
import { MobileListDto, MobileNoticeItem } from '@src/notice/mobile/dto/mobile.list.dto';
import { MobileDetailDto } from '@src/notice/mobile/dto/mobile.detail.dto';
import { fetchMobileDetailPage, fetchMobilePage } from '@src/common/utils/crawler';
import { MobileSimpleDto } from '@src/notice/mobile/dto/mobile.simple.dto';
import { cleanHtmlPreserveTags } from '@src/common/utils/htmlCleaner';

@Injectable()
export class CrawlerMobileRepository implements MobileRepository {
    async findAllSimple(page: number, limit: number): Promise<MobileListDto[]> {
        const html = await fetchMobilePage(page);
        if (!html) {
            return [];
        }

        const $ = load(html);
        const $trs = $('table.board_list tbody tr');
        const rows: MobileNoticeItem[] = [];

        $trs.each((_, tr) => {
            const $tr = $(tr);

            const $a = $tr.find('.subject a');
            const onClick = $a.attr('onclick') || '';
            const match = onClick.match(/'([A-Za-z0-9]+)'/);
            if (!match || !match[1]) return;
            const id = match[1];

            const title = $a.text().trim();
            if (!title) return;

            const numText = $tr.find('td').first().text().trim();
            const num = Number.parseInt(numText, 10);
            const isPin = Number.isNaN(num);

            const dateText = $tr.find('.regDate').text().trim();
            const createdAt = dateText ? `${dateText}T00:00:00+09:00` : '';

            const hasAttachment = $tr.find('.atchFileId a').length > 0;

            rows.push({
                id,
                num: isPin ? null : num,
                title,
                isPin,
                createdAt,
                hasAttachment,
            });
        });

        return rows.map((item) =>
            MobileListDto.from(item, 'api/notice/mobile'),
        );
    }

    async findPinnedSimple(): Promise<MobileSimpleDto[]> {
        const all = await this.findAllSimple(1, 30);
        return all
            .filter((item) => item.is_pin)
            .map((item) => ({
                id: item.id,
                title: item.title,
            }));
    }

    async findOneDetail(id: string): Promise<MobileDetailDto | null> {
        const detailHtml = await fetchMobileDetailPage(id);
        if (!detailHtml) return null;

        const $ = load(detailHtml);

        const h2 = $('h2.ui.bbs--view--tit');
        let title = '';
        h2.contents().each((_, node) => {
            if (node.type === 'text') {
                title += node.data ?? '';
            }
        });
        title = title.replace(/\s+/g, ' ').trim();

        const createdAt = `${$('dl.ui.bbs--view--info dd').first().text().trim()}T00:00:00+09:00`;
        const is_pin = false;

        const contentHtml = $('.ui.bbs--view--content').html();
        const cleanedContent = contentHtml
            ? cleanHtmlPreserveTags(contentHtml)
            : '';

        const hasAttachment = $('div.ui.bbs--view--file a').length > 0;

        return {
            id,
            title,
            created_at: createdAt,
            is_pin: is_pin,
            content: cleanedContent,
            has_attachment: hasAttachment,
            url: `https://www.hanbat.ac.kr/bbs/BBSMSTR_000000001001/view.do?nttId=${id}`,
        };
    }
}
