"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook for playing UI sound effects
 * @param soundPath - Path to the sound file in the public directory
 * @param volume - Volume level (0-1), defaults to 0.3
 */
export function useSound(soundPath: string, volume: number = 0.3) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element
        audioRef.current = new Audio(soundPath);
        audioRef.current.volume = volume;

        // Preload the audio
        audioRef.current.load();

        return () => {
            // Cleanup
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [soundPath, volume]);

    const play = useCallback(() => {
        if (audioRef.current) {
            // Reset to start if already playing
            audioRef.current.currentTime = 0;

            // Play the sound, catch any errors silently
            audioRef.current.play().catch((error) => {
                console.warn("Sound playback failed:", error);
            });
        }
    }, []);

    return play;
}
