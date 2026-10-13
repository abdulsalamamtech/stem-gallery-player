"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Shuffle,
  Repeat,
  Repeat1,
  Timer,
  Maximize,
  Minimize,
  PanelLeft,
  FolderOpen,
  Image as ImageIcon,
} from "lucide-react";
import type { PlaybackSpeed, RepeatMode } from "@/lib/gallery-types";

interface GalleryControlsProps {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  repeatMode: RepeatMode;
  shuffle: boolean;
  isFullscreen: boolean;
  isSidebarOpen: boolean;
  globalIndex: number;
  totalFiles: number;
  folderName: string;
  fileName: string;
  folderIndex: number;
  totalFolders: number;
  fileIndex: number;
  folderFileCount: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onNextFolder: () => void;
  onPrevFolder: () => void;
  onCycleSpeed: () => void;
  onCycleRepeat: () => void;
  onToggleShuffle: () => void;
  onToggleFullscreen: () => void;
  onToggleSidebar: () => void;
  onDownload: () => void;
  onSeek: (globalIdx: number) => void;
}

function ControlBtn({
  children,
  label,
  onClick,
  isActive,
  className,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClick}
          className={cn(
            "text-foreground/60 hover:text-foreground hover:bg-secondary transition-colors",
            isActive && "text-primary hover:text-primary",
            className
          )}
          aria-label={label}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

function getRepeatIcon(mode: RepeatMode) {
  if (mode === "folder") return <Repeat1 className="size-4" />;
  return <Repeat className="size-4" />;
}

function getRepeatLabel(mode: RepeatMode) {
  if (mode === "folder") return "Repeat: Folder";
  if (mode === "all") return "Repeat: All";
  return "Repeat: Off";
}

export function GalleryControls({
  isPlaying,
  speed,
  repeatMode,
  shuffle,
  isFullscreen,
  isSidebarOpen,
  globalIndex,
  totalFiles,
  folderName,
  fileName,
  folderIndex,
  totalFolders,
  fileIndex,
  folderFileCount,
  onTogglePlay,
  onNext,
  onPrev,
  onNextFolder,
  onPrevFolder,
  onCycleSpeed,
  onCycleRepeat,
  onToggleShuffle,
  onToggleFullscreen,
  onToggleSidebar,
  onDownload,
  onSeek,
}: GalleryControlsProps) {
  return (
    <footer
      className="bg-card border-t border-border shrink-0"
      role="toolbar"
      aria-label="Media controls"
    >
      {/* Progress bar */}
      <div className="px-4 pt-2">
        <Slider
          value={[globalIndex]}
          min={0}
          max={Math.max(totalFiles - 1, 0)}
          step={1}
          onValueChange={(values) => onSeek(values[0] ?? 0)}
          className="w-full"
          aria-label="Seek through all media"
        />
        <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground tabular-nums">
          <span>
            {globalIndex + 1} / {totalFiles}
          </span>
          <span>{speed}x speed</span>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between px-4 pb-2.5 pt-1">
        {/* Left: now-playing info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-primary">
            <FolderOpen className="size-4 shrink-0" />
            <span className="text-xs font-medium truncate max-w-28">
              {folderName || "---"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground/60">
            <ImageIcon className="size-3 shrink-0" />
            <span className="text-xs truncate max-w-40">
              {fileName || "---"}
            </span>
          </div>
        </div>

        {/* Center: transport controls */}
        <div className="flex items-center gap-1">
          <ControlBtn label="Previous folder (Shift+Left)" onClick={onPrevFolder}>
            <ChevronsLeft className="size-4" />
          </ControlBtn>
          <ControlBtn label="Previous (Left arrow)" onClick={onPrev}>
            <SkipBack className="size-4" />
          </ControlBtn>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="icon"
                onClick={onTogglePlay}
                className="mx-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/85"
                aria-label={isPlaying ? "Pause (Space)" : "Play (Space)"}
              >
                {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {isPlaying ? "Pause (Space)" : "Play (Space)"}
            </TooltipContent>
          </Tooltip>
          <ControlBtn label="Next (Right arrow)" onClick={onNext}>
            <SkipForward className="size-4" />
          </ControlBtn>
          <ControlBtn label="Next folder (Shift+Right)" onClick={onNextFolder}>
            <ChevronsRight className="size-4" />
          </ControlBtn>
        </div>

        {/* Right: utility controls */}
        <div className="flex items-center gap-0.5 flex-1 justify-end">
          <ControlBtn label={`Speed: ${speed}x`} onClick={onCycleSpeed} isActive={speed > 1}>
            <Timer className="size-4" />
          </ControlBtn>
          <ControlBtn label={getRepeatLabel(repeatMode)} onClick={onCycleRepeat} isActive={repeatMode !== "none"}>
            {getRepeatIcon(repeatMode)}
          </ControlBtn>
          <ControlBtn label="Shuffle (S)" onClick={onToggleShuffle} isActive={shuffle}>
            <Shuffle className="size-4" />
          </ControlBtn>
          <ControlBtn label="Download (D)" onClick={onDownload}>
            <Download className="size-4" />
          </ControlBtn>
          <ControlBtn label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"} onClick={onToggleSidebar}>
            <PanelLeft className={cn("size-4", !isSidebarOpen && "rotate-180")} />
          </ControlBtn>
          <ControlBtn label={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"} onClick={onToggleFullscreen}>
            {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
          </ControlBtn>

          <div className="ml-2 flex items-center gap-2 text-[10px] text-muted-foreground tabular-nums">
            <span>
              {folderIndex + 1}/{totalFolders}
            </span>
            <span className="text-border">|</span>
            <span>
              {fileIndex + 1}/{folderFileCount}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
