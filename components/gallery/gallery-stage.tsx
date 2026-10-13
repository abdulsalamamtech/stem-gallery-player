"use client";

import { cn } from "@/lib/utils";
import type { MediaFile } from "@/lib/gallery-types";
import { type RefObject, useState, useEffect } from "react";
import { ShareMenu } from "./share-menu";

interface GalleryStageProps {
  currentFile: MediaFile | null;
  folderName: string;
  isVideo: boolean;
  isPlaying: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export function GalleryStage({
  currentFile,
  folderName,
  isVideo,
  isPlaying,
  videoRef,
}: GalleryStageProps) {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  useEffect(() => {
    if (currentFile && !isVideo) {
      setIsImageLoading(true);
      setCurrentSrc(currentFile.path);
    }
  }, [currentFile, isVideo]);

  useEffect(() => {
    if (videoRef.current && isVideo) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, isVideo, videoRef, currentFile]);

  if (!currentFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">No media to display</p>
          <p className="text-muted-foreground/60 text-sm mt-2">
            Add folders with images or videos to public/directory/
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col relative bg-background overflow-hidden">
      {/* Info bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3 bg-gradient-to-b from-background/90 to-transparent pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            {folderName}
          </span>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-xs text-foreground/70 truncate max-w-64">
            {currentFile.name}
          </span>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <span
            className={cn(
              "text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-full",
              isVideo ? "bg-chart-1/15 text-chart-1" : "bg-primary/15 text-primary"
            )}
          >
            {currentFile.type}
          </span>
          <ShareMenu
            url={`/?folder=${encodeURIComponent(folderName)}&file=${encodeURIComponent(currentFile.name)}`}
            title={`${currentFile.name} - ${folderName}`}
            size="md"
          />
        </div>
      </div>

      {/* Stage area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {isVideo ? (
          <video
            ref={videoRef}
            key={currentFile.path}
            src={currentFile.path}
            className="max-w-full max-h-full rounded-lg object-contain"
            autoPlay={isPlaying}
            playsInline
            muted={false}
          />
        ) : (
          <div className="relative flex items-center justify-center max-w-full max-h-full">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={currentFile.path}
              src={currentSrc || currentFile.path}
              alt={currentFile.name}
              className={cn(
                "max-w-full max-h-[calc(100vh-220px)] rounded-lg object-contain transition-opacity duration-300",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          </div>
        )}
      </div>
    </main>
  );
}
