import { parseFeed } from '@saulnunez/syndication';

export async function fetchAndParseFeed(url: string) {
    const results = await fetch(url);
    const xml = await results.text();
    const parsed = parseFeed(xml);
    return parsed;
}