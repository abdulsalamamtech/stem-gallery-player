"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const MUSIC_URL = "/music/ambient.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.3;
    audio.muted = true;
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => setIsReady(true));
    audio.addEventListener("error", () => setIsReady(false));

    audio.play().catch(() => {
      // Autoplay blocked - will unmute on user interaction
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      audio.play().catch(() => {});
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  }, [isMuted]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleMute}
          className="text-muted-foreground hover:text-foreground"
          aria-label={isMuted ? "Unmute background music" : "Mute background music"}
        >
          {isMuted ? (
            <VolumeX className="size-4" />
          ) : (
            <Volume2 className="size-4" />
          )}
          {!isReady && (
            <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-destructive" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isMuted ? "Unmute music (M)" : "Mute music (M)"}
      </TooltipContent>
    </Tooltip>
  );
}
