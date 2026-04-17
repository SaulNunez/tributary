export interface Feed {
    urlFeed: string
    lastSyncedAt: Date,
    name: string
    iconLocation: string,
    lastUpdateTime: Date,
    id: string,
    itunes?: {
        explicit: boolean
    }
}