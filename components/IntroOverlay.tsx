"use client";

import { useEffect, useState } from 'react';

export default function IntroOverlay({ message = "Welcome to My Website" }: { message?: string }) {
    const [show, setShow] = useState(true);
    const [fadingOut, setFadingOut] = useState(false);

    useEffect(() => {
        // Start fade out after 2.5 seconds
        const timer = setTimeout(() => {
            setFadingOut(true);
        }, 2500);

        // Remove from DOM after transition (e.g. 1s duration)
        const cleanup = setTimeout(() => {
            setShow(false);
        }, 3500);

        return () => {
            clearTimeout(timer);
            clearTimeout(cleanup);
        };
    }, []);

    if (!show) return null;

    return (
        <div
            className={`position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center ${fadingOut ? 'intro-fade-out' : ''}`}
            style={{
                zIndex: 9999,
                backgroundColor: '#0b1120', // Match tech bg base
                transition: 'opacity 1s ease, transform 1s ease',
                background: 'radial-gradient(circle at center, #1e293b 0%, #0b1120 100%)'
            }}
        >
            <div className="text-center">
                <h1
                    className="display-1 fw-bold text-white animate-fade-in"
                    style={{
                        textShadow: '0 0 20px rgba(0, 210, 255, 0.7)',
                        letterSpacing: '2px',
                        animation: 'scaleIn 3s ease-out forwards'
                    }}
                >
                    {message}
                </h1>
                <div
                    className="mt-3"
                    style={{
                        height: '2px',
                        width: '100px',
                        background: 'linear-gradient(90deg, transparent, #00d2ff, transparent)',
                        margin: '0 auto',
                        animation: 'widthExpand 2s ease-in-out forwards'
                    }}
                ></div>
            </div>

            <style jsx>{`
        .intro-fade-out {
          opacity: 0;
          pointer-events: none;
          transform: translateY(-50px);
        }
        @keyframes widthExpand {
          0% { width: 0; opacity: 0; }
          50% { width: 150px; opacity: 1; }
          100% { width: 100px; opacity: 1; }
        }
      `}</style>
        </div>
    );
}
