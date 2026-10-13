"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FolderOpen,
  Image as ImageIcon,
  Video,
  Play,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareMenu } from "@/components/gallery/share-menu";
import { GalleryHeader } from "@/components/gallery/gallery-header";
import { GalleryFooter } from "@/components/gallery/gallery-footer";
import { cn } from "@/lib/utils";
import type { GalleryData, MediaFile } from "@/lib/gallery-types";

const ITEMS_PER_BATCH = 12;

export default function FolderGridPage() {
  const params = useParams();
  const folderName = decodeURIComponent(params.folder as string);

  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((json: GalleryData) => {
        const folder = json.folders?.find(
          (f) => f.name.toLowerCase() === folderName.toLowerCase()
        );
        setFiles(folder?.files ?? []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [folderName]);

  /* Intersection observer for infinite scroll */
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_BATCH, files.length));
  }, [files.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, files.length]);

  const visible = files.slice(0, visibleCount);
  const hasMore = visibleCount < files.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading folder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GalleryHeader />

      {/* Subheader with folder info */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-card/50">
        <Link href="/gallery">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <FolderOpen className="size-4 text-primary" />
        <h2 className="text-sm font-medium text-foreground">{folderName}</h2>
        <span className="text-xs text-muted-foreground">
          {files.length} items
        </span>
        <div className="ml-auto flex items-center gap-1">
          <ShareMenu
            url={`/gallery/${encodeURIComponent(folderName)}`}
            title={`Gallery: ${folderName}`}
            size="sm"
          />
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <Play className="size-3.5" />
              <span className="text-xs">Player</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Content grid */}
      <main className="flex-1 px-6 py-6">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ImageIcon className="size-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">
              No media found in this folder
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {visible.map((file, idx) => (
                <MediaCard
                  key={file.name}
                  file={file}
                  folderName={folderName}
                  index={idx}
                  onView={() => setViewerIndex(idx)}
                />
              ))}
            </div>

            {/* Sentinel for infinite scroll */}
            {hasMore && (
              <div
                ref={sentinelRef}
                className="flex items-center justify-center py-8"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Loading more...</span>
                </div>
              </div>
            )}

            {!hasMore && files.length > ITEMS_PER_BATCH && (
              <p className="text-center text-xs text-muted-foreground py-6">
                {"All"} {files.length} {"items loaded"}
              </p>
            )}
          </>
        )}
      </main>

      <GalleryFooter />

      {/* Lightbox viewer */}
      {viewerIndex !== null && (
        <ContentViewer
          files={files}
          currentIndex={viewerIndex}
          folderName={folderName}
          onClose={() => setViewerIndex(null)}
          onNavigate={setViewerIndex}
        />
      )}
    </div>
  );
}

/* ── Lightbox / Content Viewer ─────────────────────────── */
function ContentViewer({
  files,
  currentIndex,
  folderName,
  onClose,
  onNavigate,
}: {
  files: MediaFile[];
  currentIndex: number;
  folderName: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const file = files[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < files.length - 1;

  /* Keyboard navigation */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(currentIndex + 1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, hasPrev, hasNext, onClose, onNavigate]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `/api/download?file=${encodeURIComponent(file.path)}`;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col animate-in fade-in-0 duration-200">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Close viewer"
          >
            <X className="size-5" />
          </Button>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate">
              {file.name}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {currentIndex + 1} of {files.length} in {folderName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDownload}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Download"
          >
            <Download className="size-4" />
          </Button>
          <ShareMenu
            url={`/gallery/${encodeURIComponent(folderName)}?file=${encodeURIComponent(file.name)}`}
            title={`${file.name} - ${folderName}`}
            size="sm"
          />
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 relative flex items-center justify-center px-4 pb-4 min-h-0">
        {/* Previous button */}
        {hasPrev && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-3 z-10 size-10 rounded-full bg-card/80 border border-border backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-card transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        {/* Media */}
        <div className="max-w-full max-h-full flex items-center justify-center">
          {file.type === "video" ? (
            <video
              key={file.path}
              src={file.path}
              controls
              autoPlay
              className="max-w-full max-h-[calc(100vh-120px)] rounded-lg object-contain"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={file.path}
              src={file.path}
              alt={file.name}
              className="max-w-full max-h-[calc(100vh-120px)] rounded-lg object-contain animate-in fade-in-0 duration-300"
            />
          )}
        </div>

        {/* Next button */}
        {hasNext && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-3 z-10 size-10 rounded-full bg-card/80 border border-border backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-card transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>

      {/* Bottom thumbnail strip */}
      <div className="shrink-0 px-4 pb-3">
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-2 scrollbar-thin">
          {files.map((f, idx) => (
            <button
              key={f.name}
              onClick={() => onNavigate(idx)}
              className={cn(
                "shrink-0 size-12 rounded-md overflow-hidden border-2 transition-all",
                idx === currentIndex
                  ? "border-primary ring-1 ring-primary/50 scale-110"
                  : "border-transparent opacity-50 hover:opacity-80"
              )}
              aria-label={`View ${f.name}`}
            >
              {f.type === "video" ? (
                <div className="size-full bg-secondary flex items-center justify-center">
                  <Video className="size-4 text-muted-foreground" />
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={f.path}
                  alt={f.name}
                  className="size-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Media card ────────────────────────────────────────── */
function MediaCard({
  file,
  folderName,
  index,
  onView,
}: {
  file: MediaFile;
  folderName: string;
  index: number;
  onView: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = `/api/download?file=${encodeURIComponent(file.path)}`;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="group relative bg-card border border-border rounded-lg overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 cursor-pointer animate-in fade-in-0 slide-in-from-bottom-2"
      style={{
        animationDelay: `${Math.min(index * 50, 500)}ms`,
        animationFillMode: "both",
      }}
      onClick={onView}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onView();
      }}
      aria-label={`View ${file.name}`}
    >
      {/* Media preview */}
      <div className="relative aspect-square bg-secondary overflow-hidden">
        {file.type === "video" ? (
          <div className="size-full flex items-center justify-center relative">
            <video
              src={file.path}
              className="size-full object-cover"
              preload="metadata"
              muted
            />
            <div className="absolute inset-0 flex items-center justify-center bg-background/20">
              <div className="size-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <Play className="size-5 text-foreground ml-0.5" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={file.path}
              alt={file.name}
              loading="lazy"
              className={cn(
                "size-full object-cover transition-all duration-300 group-hover:scale-105",
                loaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setLoaded(true)}
            />
          </>
        )}

        {/* Type badge */}
        <div className="absolute top-1.5 left-1.5 z-10">
          {file.type === "video" ? (
            <Video className="size-3.5 text-chart-1 drop-shadow" />
          ) : (
            <ImageIcon className="size-3.5 text-primary drop-shadow" />
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDownload}
            className="text-foreground/80 hover:text-foreground hover:bg-background/30"
            aria-label="Download"
          >
            <Download className="size-3.5" />
          </Button>
          <div onClick={(e) => e.stopPropagation()}>
            <ShareMenu
              url={`/gallery/${encodeURIComponent(folderName)}?file=${encodeURIComponent(file.name)}`}
              title={`${file.name} - ${folderName}`}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* File name */}
      <div className="px-2 py-1.5">
        <p
          className="text-[11px] text-foreground/70 truncate"
          title={file.name}
        >
          {file.name}
        </p>
      </div>
    </div>
  );
}
