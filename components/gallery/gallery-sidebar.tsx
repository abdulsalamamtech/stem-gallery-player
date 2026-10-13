"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderOpen, Image as ImageIcon, Video, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareMenu } from "./share-menu";
import type { Folder } from "@/lib/gallery-types";

interface GallerySidebarProps {
  folders: Folder[];
  folderIndex: number;
  fileIndex: number;
  isOpen: boolean;
  onToggle: () => void;
  onSelectFolder: (idx: number) => void;
  onSelectFile: (folderIdx: number, fileIdx: number) => void;
}

export function GallerySidebar({
  folders,
  folderIndex,
  fileIndex,
  isOpen,
  onToggle,
  onSelectFolder,
  onSelectFile,
}: GallerySidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out relative",
        isOpen ? "w-72" : "w-0"
      )}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggle}
        className={cn(
          "absolute top-3 z-10 transition-all duration-300 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isOpen ? "right-2" : "-right-9"
        )}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <ChevronLeft
          className={cn(
            "size-4 transition-transform duration-300",
            !isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <>
          <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
            <FolderOpen className="size-5 text-sidebar-primary" />
            <h2 className="text-sm font-semibold text-sidebar-foreground tracking-wide uppercase">
              Folders
            </h2>
            <span className="ml-auto text-xs text-muted-foreground">
              {folders.length}
            </span>
          </div>

          <ScrollArea className="flex-1">
            <nav className="p-2 flex flex-col gap-1" aria-label="Media folders">
              {folders.map((folder, fIdx) => {
                const isFolderActive = fIdx === folderIndex;
                return (
                  <div key={folder.name}>
                    <div className="flex items-center">
                      <button
                        onClick={() => onSelectFolder(fIdx)}
                        className={cn(
                          "flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors",
                          isFolderActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        <FolderOpen
                          className={cn(
                            "size-4 shrink-0",
                            isFolderActive ? "text-sidebar-primary" : "text-muted-foreground"
                          )}
                        />
                        <span className="truncate flex-1">{folder.name}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {folder.count}
                        </span>
                      </button>
                      <ShareMenu
                        url={`/?folder=${encodeURIComponent(folder.name)}`}
                        title={`Gallery: ${folder.name}`}
                        size="sm"
                      />
                    </div>

                    {isFolderActive && (
                      <div className="ml-4 mt-1 mb-1 flex flex-col gap-0.5">
                        {folder.files.map((file, fFileIdx) => {
                          const isFileActive =
                            fIdx === folderIndex && fFileIdx === fileIndex;
                          return (
                            <div key={file.name} className="flex items-center">
                              <button
                                onClick={() => onSelectFile(fIdx, fFileIdx)}
                                className={cn(
                                  "flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-xs transition-colors",
                                  isFileActive
                                    ? "bg-primary/15 text-primary"
                                    : "text-muted-foreground hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
                                )}
                              >
                                {file.type === "video" ? (
                                  <Video className="size-3 shrink-0" />
                                ) : (
                                  <ImageIcon className="size-3 shrink-0" />
                                )}
                                <span className="truncate">{file.name}</span>
                              </button>
                              <ShareMenu
                                url={`/?folder=${encodeURIComponent(folder.name)}&file=${encodeURIComponent(file.name)}`}
                                title={`${file.name} - ${folder.name}`}
                                size="sm"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </ScrollArea>

          <div className="px-4 py-3 border-t border-sidebar-border">
            <p className="text-xs text-muted-foreground">
              {folders.reduce((a, f) => a + f.count, 0)} items in{" "}
              {folders.length} folders
            </p>
          </div>
        </>
      )}
    </aside>
  );
}
