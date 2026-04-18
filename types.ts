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