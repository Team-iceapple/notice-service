import {Injectable} from '@nestjs/common';
import {load} from 'cheerio';
import {MobileRepository} from './mobile.repository';
import {MobileListDto} from '../dto/mobile.list.dto';
import {MobileDetailDto} from '../dto/mobile.detail.dto';
import {fetchMobileDetailPage, fetchMobilePage} from '@/common/utils/crawler';
import {MobileSimpleDto} from '../dto/mobile.simple.dto';

@Injectable()
export class CrawlerMobileRepository implements MobileRepository {
    async findAllSimple(): Promise<MobileListDto[]> {
        type PartialRow = {
            id: string;
            num: number | null;
            title: string;
            isPin: boolean;
            createdAt: string;
            hasAttachment: boolean;
        };

        const rows: PartialRow[] = [];
        const html = await fetchMobilePage(1); // 1페이지만 가져옵니다.

        if (!html) {
            return [];
        }

        const $ = load(html);

        $('table.board_list tbody tr').each((_, tr) => {
            const $tr = $(tr);
            const isPin = $tr.hasClass('mobile');

            const $a = $tr.find('.subject a');
            const onClick = $a.attr('onclick') || '';
            const match = onClick.match(/'([A-Za-z0-9]+)'/);
            if (!match || !match[1]) return;
            const id = match[1];

            const titleText = $a.text().trim();
            if (!titleText) return;

            const numText = $tr.find('td').first().text().trim();
            const num = isPin ? null : (Number.parseInt(numText, 10) || null);

            const dateText = $tr.find('.regDate').text().trim();
            const createdAt = dateText ? `${dateText}T00:00:00+09:00` : '';

            const hasAttachment = $tr.find('.atchFileId a').length > 0;

            rows.push({ id, num, title: titleText, isPin, createdAt, hasAttachment });
        });

        return rows.map((row) => ({
            id: row.id,
            num: row.num,
            title: row.title,
            created_at: row.createdAt,
            updated_at: null,
            has_attachment: row.hasAttachment,
            is_pin: row.isPin,
            url: `/api/mobile/${row.id}`,
        }));
    }

    async findPinnedSimple(): Promise<MobileSimpleDto[]> {
        const all = await this.findAllSimple();
        return all
            .filter((item) => item.is_pin)
            .map((item) => ({
                id: item.id,
                title: item.title,
            }));
    }

    async findOneDetail(id: string): Promise<MobileDetailDto | null> {
        const all = await this.findAllSimple();
        const found = all.find((item) => item.id === id);
        if (!found) return null;

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

        const contentDom = $('div.ui.bbs--view--content').clone();

        contentDom.find('[style], [class], [id]').each((_, el) => {
            $(el).removeAttr('style').removeAttr('class').removeAttr('id');
        });

        const allowedTags = ['p', 'br', 'ul', 'ol', 'li', 'b', 'strong', 'i', 'u', 'a', 'img'];
        contentDom.find('*').each((_, el) => {
            const tag = el.tagName.toLowerCase();
            if (!allowedTags.includes(tag)) {
                $(el).replaceWith($(el).contents());
            }
        });
        let contentHtml = contentDom.html() ?? '';
        contentHtml = contentHtml
            .replace(/&nbsp;/g, ' ')
            .replace(/ +/g, ' ')
            .replace(/\s*<br\s*\/?>\s*/g, '<br>')
            .replace(/^\s+|\s+$/g, '');

        contentHtml = contentHtml.replace(/\n+/g, '');

        const hasAttachment = $('div.ui.bbs--view--file a').length > 0;

        return {
            id,
            title,
            created_at: found.created_at,
            is_pin: found.is_pin,
            content: contentHtml,
            has_attachment: hasAttachment,
            url: `https://www.hanbat.ac.kr/bbs/BBSMSTR_000000001001/view.do?nttId=${id}`,
        };
    }
}