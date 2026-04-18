export interface Feed {
    urlFeed: string
    lastSyncedAt: string,
    name: string
    iconLocation: string,
    lastUpdateTime: string,
    id: string,
    itunes?: {
        explicit: boolean
    }
}

export interface FeedItem {
    id: string,
    title: string,
    link: string,
    pubDate: string,
    isRead: boolean,
    content: {
        type: 'text' | 'html',
        value: string
    }
}