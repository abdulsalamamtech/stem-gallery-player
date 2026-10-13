"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Radio, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Station {
  name: string;
  url_resolved: string;
  favicon: string;
  tags: string;
  country: string;
}

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stationsRef = useRef<Station[]>([]);
  const indexRef = useRef(-1);
  const mutedRef = useRef(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [stationName, setStationName] = useState("");

  const playNext = useCallback(async () => {
    let stations = stationsRef.current;
    if (stations.length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/radio", { cache: "no-store" });
        const payload = await response.json();
        stations = Array.isArray(payload.stations) ? payload.stations : [];
        stationsRef.current = stations;
        indexRef.current = -1;
      } catch {
        stations = [];
      } finally {
        setIsLoading(false);
      }
    }

    if (!audioRef.current || stations.length === 0 || mutedRef.current) return false;

    for (let attempt = 0; attempt < stations.length; attempt += 1) {
      indexRef.current = (indexRef.current + 1) % stations.length;
      const station = stations[indexRef.current];
      const audio = audioRef.current;
      audio.src = station.url_resolved;
      audio.load();
      setStationName(station.name);
      try {
        await audio.play();
        return true;
      } catch {
        // Try another verified HTTPS station.
      }
    }

    setStationName("No compatible station found");
    return false;
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.4;
    audio.preload = "none";
    audioRef.current = audio;
    const handleError = () => {
      if (!mutedRef.current) void playNext();
    };
    audio.addEventListener("error", handleError);
    return () => {
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [playNext]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (mutedRef.current) {
      mutedRef.current = false;
      setIsMuted(false);
      void playNext();
    } else {
      mutedRef.current = true;
      setIsMuted(true);
      audio.pause();
    }
  }, [playNext]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "m" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) toggleMute();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleMute]);

  return (
    <div className="flex items-center gap-0.5">
      {!isMuted && stationName && <span className="hidden max-w-[180px] truncate px-2 text-[11px] text-muted-foreground md:inline"><Radio className="mr-1 inline size-3 text-primary" />{stationName}</span>}
      {!isMuted && <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" onClick={() => void playNext()} aria-label="Next radio station"><SkipForward className="size-3.5" /></Button></TooltipTrigger><TooltipContent>Next station</TooltipContent></Tooltip>}
      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" onClick={toggleMute} disabled={isLoading} aria-label={isMuted ? "Play radio" : "Mute radio"}>{isLoading ? <Radio className="size-4 animate-spin" /> : isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-primary" />}</Button></TooltipTrigger><TooltipContent>{isLoading ? "Loading radio" : isMuted ? "Play radio (M)" : "Mute radio (M)"}</TooltipContent></Tooltip>
    </div>
  );
}
