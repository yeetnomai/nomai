'use client';

import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

export default function BackgroundMusic() {
    const [isPlaying, setIsPlaying] = useState(false);
    // Prevent hydration mismatch by only rendering on client
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null;

    return (
        <div className="fixed-bottom p-3 d-flex justify-content-end pointer-events-none">
            <div className="d-none">
                <ReactPlayer
                    url="https://youtu.be/OjNpRbNdR7E"
                    playing={isPlaying}
                    loop={true}
                    volume={0.5}
                    width="0"
                    height="0"
                />
            </div>
            <div
                className="bg-dark text-white p-2 rounded-circle shadow pointer-events-auto d-flex align-items-center justify-content-center"
                style={{ cursor: 'pointer', width: '50px', height: '50px' }}
                onClick={() => setIsPlaying(!isPlaying)}
            >
                {isPlaying ? (
                    <span>❚❚</span>
                ) : (
                    <span>▶</span>
                )}
            </div>
        </div>
    );
}
