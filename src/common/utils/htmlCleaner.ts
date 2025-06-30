import {load} from 'cheerio';

export function cleanHtmlPreserveTags(html: string): string {
    const $ = load(html);
    $('[style]').removeAttr('style');
    $('[class]').removeAttr('class');
    return $.html();
}

