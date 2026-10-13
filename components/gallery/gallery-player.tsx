"use client";

import { useGalleryPlayer } from "@/hooks/use-gallery-player";
import { GalleryHeader } from "./gallery-header";
import { GallerySidebar } from "./gallery-sidebar";
import { GalleryStage } from "./gallery-stage";
import { GalleryControls } from "./gallery-controls";
import { GalleryFooter } from "./gallery-footer";

export function GalleryPlayer() {
  const player = useGalleryPlayer();

  if (player.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Scanning folders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col h-dvh bg-background overflow-hidden">
      <GalleryHeader
        searchQuery={player.searchQuery}
        onSearchChange={player.setSearchQuery}
        searchResults={player.searchResults}
        onSelectResult={player.selectFile}
      />
      <div className="flex flex-1 min-h-0">
        <GallerySidebar
          folders={player.folders}
          folderIndex={player.folderIndex}
          fileIndex={player.fileIndex}
          isOpen={player.isSidebarOpen}
          onToggle={player.toggleSidebar}
          onSelectFolder={player.selectFolder}
          onSelectFile={player.selectFile}
        />
        <GalleryStage
          currentFile={player.currentFile}
          folderName={player.currentFolder?.name ?? ""}
          isVideo={player.isVideo}
          isPlaying={player.isPlaying}
          videoRef={player.videoRef}
        />
      </div>
      <GalleryControls
        isPlaying={player.isPlaying}
        speed={player.speed}
        repeatMode={player.repeatMode}
        shuffle={player.shuffle}
        isFullscreen={player.isFullscreen}
        isSidebarOpen={player.isSidebarOpen}
        globalIndex={player.globalIndex}
        totalFiles={player.totalFiles}
        folderName={player.currentFolder?.name ?? ""}
        fileName={player.currentFile?.name ?? ""}
        folderIndex={player.folderIndex}
        totalFolders={player.folders.length}
        fileIndex={player.fileIndex}
        folderFileCount={player.currentFolder?.count ?? 0}
        onTogglePlay={player.togglePlay}
        onNext={player.goToNext}
        onPrev={player.goToPrev}
        onNextFolder={player.goToNextFolder}
        onPrevFolder={player.goToPrevFolder}
        onCycleSpeed={player.cycleSpeed}
        onCycleRepeat={player.cycleRepeat}
        onToggleShuffle={player.toggleShuffle}
        onToggleFullscreen={player.toggleFullscreen}
        onToggleSidebar={player.toggleSidebar}
        onDownload={player.downloadCurrent}
        onSeek={player.seekToGlobal}
      />
      <GalleryFooter />
    </div>
  );
}
