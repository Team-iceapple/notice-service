import {Injectable} from '@nestjs/common';
import {load} from 'cheerio';
import {MobileRepository} from './mobile.repository';
import {MobileListDto} from '../dto/mobile.list.dto';
import {MobileDetailDto} from '../dto/mobile.detail.dto';
import {fetchMobileDetailPage, fetchMobilePage} from '@/common/utils/crawler';
import {MobileSimpleDto} from '../dto/mobile.simple.dto';

@Injectable()
export class CrawlerMobileRepository implements MobileRepository {
    async findAllSimple(page: number): Promise<MobileListDto[]> {
        type PartialRow = {
            id: string;
            num: number | null;
            title: string;
            isPin: boolean;
            createdAt: string;
            hasAttachment: boolean;
        };

        const rows: PartialRow[] = [];
        const html = await fetchMobilePage(page);
        if (!html) {
            return [];
        }

        const $ = load(html);
        const $trs = $('table.board_list tbody tr');

        $trs.each((_, tr) => {
            const $tr = $(tr);

            const $a = $tr.find('.subject a');
            const onClick = $a.attr('onclick') || '';
            const match = onClick.match(/'([A-Za-z0-9]+)'/);
            if (!match || !match[1]) return;
            const id = match[1];

            const titleText = $a.text().trim();
            if (!titleText) return;

            const numText = $tr.find('td').first().text().trim();
            const num = Number.parseInt(numText, 10);
            const isPin = Number.isNaN(num);

            const dateText = $tr.find('.regDate').text().trim();
            const createdAt = dateText ? `${dateText}T00:00:00+09:00` : '';

            const hasAttachment = $tr.find('.atchFileId a').length > 0;

            rows.push({
                id,
                num: isPin ? null : num,
                title: titleText,
                isPin,
                createdAt,
                hasAttachment
            });
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
        const all = await this.findAllSimple(1);
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

        const contentDom = $('div.ui.bbs--view--content');
        contentDom.find('[style], [class], [id]').removeAttr('style').removeAttr('class').removeAttr('id');
        const allowedTags = ['p', 'br', 'ul', 'ol', 'li', 'b', 'strong', 'i', 'u', 'a', 'img'];
        contentDom.find('*').each((_, el) => {
            if (el.type === 'tag' && !allowedTags.includes(el.tagName.toLowerCase())) {
                $(el).replaceWith($(el).contents());
            }
        });
        let contentHtml = contentDom.html() ?? '';
        contentHtml = contentHtml
            .replace(/&nbsp;/g, ' ')
            .replace(/\s\s+/g, ' ')
            .trim();

        const hasAttachment = $('div.ui.bbs--view--file a').length > 0;

        return {
            id,
            title,
            created_at: createdAt,
            is_pin: is_pin,
            content: contentHtml,
            has_attachment: hasAttachment,
            url: `https://www.hanbat.ac.kr/bbs/BBSMSTR_000000001001/view.do?nttId=${id}`,
        };
    }
}