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

      {/* Controls row: mobile stacks the title above controls so filenames stay readable. */}
      <div className="flex flex-col px-3 pb-2.5 pt-1 md:flex-row md:items-center md:justify-between md:px-4">
        {/* Now-playing info */}
        <div className="flex min-w-0 w-full items-center justify-between gap-3 pb-1.5 md:w-auto md:flex-1 md:pb-0">
          <div className="flex min-w-0 items-center gap-1.5 text-primary">
            <FolderOpen className="size-4 shrink-0" />
            <span className="truncate text-xs font-medium md:max-w-28">
              {folderName || "---"}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 text-foreground/60 md:flex-none md:justify-start">
            <ImageIcon className="size-3 shrink-0" />
            <span className="truncate text-right text-xs md:max-w-40 md:text-left">
              {fileName || "---"}
            </span>
          </div>
        </div>

        {/* Center: transport controls */}
        <div className="flex w-full items-center justify-center gap-1 md:w-auto">
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
                className="mx-1 size-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/85"
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

        {/* Utility controls */}
        <div className="flex w-full items-center justify-center gap-0.5 overflow-x-auto pt-1 md:w-auto md:flex-1 md:justify-end md:pt-0">
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

          <div className="ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-border/60 bg-background/60 px-2 py-1 text-[10px] text-muted-foreground tabular-nums md:ml-2">
            <span aria-label="Current folder and total folders">Folder {folderIndex + 1}/{totalFolders}</span>
            <span className="text-border">•</span>
            <span aria-label="Current file and files in folder">File {fileIndex + 1}/{folderFileCount}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
