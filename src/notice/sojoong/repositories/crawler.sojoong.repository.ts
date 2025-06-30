import {Injectable} from '@nestjs/common';
import {SojoongRepository} from './sojoong.repository';
import {SojoongListDto} from '../dto/sojoong.list.dto';
import {SojoongDetailDto, SwNoticeItem} from '../dto/sojoong.detail.dto';
import {SojoongSimpleDto} from '../dto/sojoong.simple.dto';
import {fetchSwNoticeDetailPage, fetchSwNoticeList} from '@/common/utils/crawler';
import {load} from "cheerio";
import {cleanHtmlPreserveTags} from "@/common/utils/htmlCleaner";

@Injectable()
export class CrawlerSojoongRepository implements SojoongRepository {
    private readonly baseUrl = 'https://sw.hanbat.ac.kr';

    async findAllSimple(): Promise<SojoongListDto[]> {
        const rows = await fetchSwNoticeList(1, 30);

        return rows.map((item: SwNoticeItem) => SojoongListDto.from(item, 'api/sojoong'));
    }

    async findPinnedSimple(): Promise<SojoongSimpleDto[]> {
        const all = await this.findAllSimple();
        return all
            .filter((item) => item.is_pin)
            .map((item) => ({
                id: item.id,
                title: item.title,
            }));
    }

    async findOneDetail(id: string): Promise<SojoongDetailDto | null> {
        const list = await this.findAllSimple();
        const found = list.find((item) => item.id === id);
        if (!found) return null;

        const html = await fetchSwNoticeDetailPage(id);
        if (!html) return null;

        const $ = load(html);

        const contentHtml = $('.detail-content-body').html();
        const cleanedContent = contentHtml ? cleanHtmlPreserveTags(contentHtml) : '';

        return {
            id,
            title: $('.board-view h2').text().trim(),
            created_at: found.created_at,
            is_pin: found.is_pin,
            content: cleanedContent,
            url: `https://sw.hanbat.ac.kr/community/noticeDetail?boardSn=${id}`,
            has_attachment: $('.board-view .file-box a').length > 0,
        };
    }
}
