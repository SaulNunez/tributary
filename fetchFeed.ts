import { parseFeed } from '@saulnunez/syndication';
import { FeedItem } from './types';

export async function fetchAndParseFeed(url: string) {
    const results = await fetch(url);
    const xml = await results.text();
    const parsed = parseFeed(xml);
    return parsed;
}

export function mapFeedResponseToItems(
    response: Awaited<ReturnType<typeof fetchAndParseFeed>>,
    feedId: string
): FeedItem[] {
    if (response.feedType === 'rss') {
        return response.items.map((item) => ({
            id: item.guid || item.link,
            feedId,
            title: item.title,
            link: item.link,
            pubDate: item.pubDate || '',
            isRead: false,
            content: { type: 'html', value: item.description || '' },
        }));
    }

    if (response.feedType === 'atom') {
        return response.items.map((item) => ({
            id: item.id || item.link,
            feedId,
            title: item.title,
            link: item.link,
            pubDate: item.published || item.updated || '',
            isRead: false,
            content: item.content
                ? { type: item.content.type === 'html' ? 'html' : 'text', value: item.content.value }
                : { type: 'text', value: item.summary || '' },
        }));
    }

    return response.items.map((item) => ({
        id: item.id,
        feedId,
        title: item.title,
        link: item.link,
        pubDate: item.date_published ? new Date(item.date_published).toISOString() : '',
        isRead: false,
        content: item.content_html
            ? { type: 'html', value: item.content_html }
            : { type: 'text', value: item.content_text || item.summary || '' },
    }));
}