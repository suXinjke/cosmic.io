type UTCDate = string

interface VideoPayload {
    video: {
        id: string
        query: string
        uploaded: UTCDate
        fetched: UTCDate
        duration: number
        viewCount: number
    }
    time: number
    offset: number
}

type VideoID = string

interface ViewHistoryEntry {
    id: string
    name: string
    author: string
}

type IgnoredVideos = Record<string, UTCDate>
