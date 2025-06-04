import {Injectable} from '@nestjs/common';
import {load} from 'cheerio';
import {NoticeRepository} from './notice.repository';
import {NoticeListDto} from '../dto/notice.list.dto';
import {NoticeDetailDto} from '../dto/notice.detail.dto';
import {fetchNoticeDetailPage, fetchNoticesPage} from '../utils/crawler';
import {NoticeSimpleDto} from '../dto/notice.simple.dto';

@Injectable()
export class CrawlerNoticeRepository implements NoticeRepository {
    async findAllSimple(): Promise<NoticeListDto[]> {
        type PartialRow = {
            id: string;
            title: string;
            isPin: boolean;
            createdAt: string;
            hasAttachment: boolean;
        };

        const pinnedRows: PartialRow[] = [];
        const normalRows: PartialRow[] = [];
        let page = 1;

        while (normalRows.length < 30) {
            const html = await fetchNoticesPage(page);
            if (!html) {
                break;
            }
            const $ = load(html);

            $('table.board_list tbody tr').each((_, tr) => {
                const $tr = $(tr);

                const $a = $tr.find('.subject a');
                const onClick = $a.attr('onclick') || '';
                const match = onClick.match(/'([A-Za-z0-9]+)'/);
                if (!match || !match[1]) return;
                const id = match[1];

                const titleText = $a.text().trim();
                if (!titleText) return;

                const isPin = $tr.hasClass('notice');

                const dateText = $tr.find('.regDate').text().trim();
                const createdAt = dateText ? `${dateText}T00:00:00+09:00` : '';

                const hasAttachment = $tr.find('.atchFileId a').length > 0;

                const row: PartialRow = {
                    id,
                    title: titleText,
                    isPin,
                    createdAt,
                    hasAttachment,
                };

                if (isPin && page === 1) {
                    pinnedRows.push(row);
                } else if (!isPin && normalRows.length < 30) {
                    normalRows.push(row);
                }
            });

            if ($('table.board_list tbody tr').length === 0) break;
            page += 1;
        }

        const combinedRows: PartialRow[] = [...pinnedRows, ...normalRows];

        return combinedRows.map((row) => ({
            id: row.id,
            title: row.title,
            created_at: row.createdAt,
            updated_at: null,
            has_attachment: row.hasAttachment,
            is_pin: row.isPin,
            url: `/api/notices/${row.id}`,
        }));
    }

    async findPinnedSimple(): Promise<NoticeSimpleDto[]> {
        const all = await this.findAllSimple();
        return all
            .filter((item) => item.is_pin)
            .map((item) => ({
                id: item.id,
                title: item.title,
            }));
    }

    async findOneDetail(id: string): Promise<NoticeDetailDto | null> {
        const all = await this.findAllSimple();
        const found = all.find((item) => item.id === id);
        if (!found) return null;

        const detailHtml = await fetchNoticeDetailPage(id);
        if (!detailHtml) return null;

        const $ = load(detailHtml);

        const h2 = $('h2.ui.bbs--view--tit');
        let title = '';
        h2.contents().each((_, node) => {
            if ('type' in node && node.type === 'text') {
                title += node.data ?? '';
            }
        });
        title = title.replace(/\s+/g, ' ').trim();

        const contentDom = $('div.ui.bbs--view--content').clone();

        contentDom.find('[style], [class], [id]').each((_, el) => {
            $(el).removeAttr('style').removeAttr('class').removeAttr('id');
        });

        const allowedTags = [
            'p',
            'br',
            'ul',
            'ol',
            'li',
            'b',
            'strong',
            'i',
            'u',
            'a',
            'img',
        ];
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

        const createdAt = found.created_at;

        const hasAttachment =
            $('div.ui.bbs--view--content').find('a[href$=".pdf"]').length > 0;

        return {
            id,
            title,
            created_at: createdAt,
            is_pin: found.is_pin,
            content: contentHtml,
            has_attachment: hasAttachment,
        };
    }
}
