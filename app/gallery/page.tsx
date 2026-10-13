"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderOpen,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { ShareMenu } from "@/components/gallery/share-menu";
import { GalleryHeader } from "@/components/gallery/gallery-header";
import { GalleryFooter } from "@/components/gallery/gallery-footer";
import type { GalleryData, Folder } from "@/lib/gallery-types";

export default function GalleryGridPage() {
  const [data, setData] = useState<GalleryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((json: GalleryData) => {
        setData(json);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const folders = data?.folders ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GalleryHeader />

      {/* Subheader */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-border bg-card/50">
        <FolderOpen className="size-4 text-primary" />
        <h2 className="text-sm font-medium text-foreground">All Folders</h2>
        <span className="text-xs text-muted-foreground">
          {folders.length} folders
        </span>
      </div>

      {/* Folder grid */}
      <main className="flex-1 px-6 py-6">
        {folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FolderOpen className="size-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No folders found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {"Add media folders to public/directory/"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <FolderCard key={folder.name} folder={folder} />
            ))}
          </div>
        )}
      </main>

      <GalleryFooter />
    </div>
  );
}

/* ── Folder Card with stacked preview ──────────────────── */
function FolderCard({ folder }: { folder: Folder }) {
  const preview = folder.files.slice(0, 3);
  const imageCount = folder.files.filter((f) => f.type === "image").length;
  const videoCount = folder.files.filter((f) => f.type === "video").length;

  return (
    <div className="group relative">
      <Link href={`/gallery/${encodeURIComponent(folder.name)}`}>
        <div className="relative bg-card border border-border rounded-xl overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
          {/* Stacked image preview */}
          <div className="relative aspect-square bg-secondary overflow-hidden">
            {/* Stack layers (behind) */}
            {preview.length > 2 && (
              <div className="absolute inset-0 m-3 rounded-lg bg-muted border border-border rotate-3 scale-95 translate-x-1 -translate-y-1" />
            )}
            {preview.length > 1 && (
              <div className="absolute inset-0 m-2 rounded-lg bg-muted/80 border border-border -rotate-2 scale-[0.97] translate-x-0.5 -translate-y-0.5" />
            )}

            {/* Front image */}
            {preview[0] ? (
              <div className="absolute inset-0 m-1 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview[0].path}
                  alt={preview[0].name}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <FolderOpen className="size-10 text-muted-foreground/30" />
              </div>
            )}

            {/* Badge */}
            <div className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm text-foreground text-[11px] font-semibold px-2 py-0.5 rounded-full border border-border">
              {folder.count}
            </div>
          </div>

          {/* Info */}
          <div className="px-3 py-2.5">
            <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {folder.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
              {imageCount > 0 && (
                <span className="flex items-center gap-0.5">
                  <ImageIcon className="size-2.5" /> {imageCount}
                </span>
              )}
              {videoCount > 0 && (
                <span className="flex items-center gap-0.5">
                  <Video className="size-2.5" /> {videoCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Share button */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ShareMenu
          url={`/gallery/${encodeURIComponent(folder.name)}`}
          title={`Gallery: ${folder.name}`}
          size="sm"
        />
      </div>
    </div>
  );
}
