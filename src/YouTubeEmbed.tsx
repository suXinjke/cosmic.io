import React, { useEffect, useRef, useState } from 'react'
import YouTube, { YouTubeProps } from 'react-youtube'

function LoadingDots() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const handle = setInterval(() => {
            setCount((x) => (x === 3 ? 0 : x + 1))
        }, 150)
        return () => clearInterval(handle)
    }, [])

    return (
        <>
            {Array.from({ length: 3 }, (_, i) => (
                <span key={i} style={{ visibility: i < count ? 'visible' : 'hidden' }}>
                    .
                </span>
            ))}
        </>
    )
}

function Message({ children }: React.PropsWithChildren) {
    return (
        <div className="youtube-embed-message">
            <h2>{children}</h2>
        </div>
    )
}

interface YoutubeEmbedProps {
    videoIds: VideoID[]
    ignoredVideos: IgnoredVideos
    onEnd: () => void
    onFaultyVideo: (id: string) => void
    onPlay: NonNullable<YouTubeProps['onPlay']>
    onPause: NonNullable<YouTubeProps['onPause']>
}

function YouTubeEmbed({
    videoIds,
    ignoredVideos,
    onEnd,
    onFaultyVideo,
    onPause,
    onPlay,
}: YoutubeEmbedProps) {
    const frames = useRef<Record<string, any>>({})
    const activeVideoId = videoIds[0]

    useEffect(
        function autoPlayVideos() {
            if (!activeVideoId) {
                return
            }

            const player = frames.current[activeVideoId]

            // HACK: during video changes, sometimes iframe may not exist
            // and it indirectly leads to crash, so check for it's existence
            if (player && player.getIframe()) {
                player.playVideo()
            }

            return () => {
                delete frames.current[activeVideoId]
            }
        },
        [activeVideoId],
    )

    return (
        <div className="videos">
            {!activeVideoId && (
                <Message>
                    {' '}
                    Waiting for videos
                    <LoadingDots />
                </Message>
            )}
            {activeVideoId &&
                videoIds.map((videoId, idx) => {
                    const isHidden = idx !== 0

                    return (
                        <YouTube
                            key={videoId || idx}
                            className={'youtube-embed ' + (isHidden ? 'hidden' : '')}
                            videoId={videoId}
                            onEnd={onEnd}
                            opts={{
                                width: '100%',
                                height: '100%',
                            }}
                            onReady={(e) => {
                                const player = e.target
                                const state = player.getPlayerState()

                                if (state === -1) {
                                    onFaultyVideo(videoId)
                                    return
                                }

                                frames.current[videoId] = player
                                player.playVideo()
                            }}
                            onPause={onPause}
                            onPlay={(e) => {
                                const { author } = e.target.getVideoData()
                                if (ignoredVideos[author]) {
                                    onFaultyVideo(videoId)
                                } else {
                                    onPlay(e)
                                }
                            }}
                            onStateChange={(e) => {
                                const bufferedSomeData = e.data === 3
                                if (bufferedSomeData && isHidden) {
                                    e.target.seekTo(1)
                                    e.target.pauseVideo()
                                }
                            }}
                        />
                    )
                })}
        </div>
    )
}

export default YouTubeEmbed
