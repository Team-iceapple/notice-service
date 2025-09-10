import {load} from 'cheerio';

export function cleanHtmlPreserveTags(html: string): string {
    const $ = load(html);
    
    $('[style], [class], [id]').removeAttr('style').removeAttr('class').removeAttr('id');
    
    const allowedTags = ['p', 'br', 'ul', 'ol', 'li', 'b', 'strong', 'i', 'u', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td'];
    
    $('*').each((_, el) => {
        if (el.type === 'tag' && !allowedTags.includes(el.tagName.toLowerCase())) {
            $(el).replaceWith($(el).contents());
        }
    });
    
    let cleanedHtml = $.html() ?? '';
    cleanedHtml = cleanedHtml
        .replace(/&nbsp;/g, ' ')
        .replace(/\s\s+/g, ' ')
        .trim();
    
    return cleanedHtml;
}

