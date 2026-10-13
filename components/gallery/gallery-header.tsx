"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  X,
  FolderOpen,
  Image as ImageIcon,
  BookOpen,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundMusic } from "./background-music";
import type { MediaFile } from "@/lib/gallery-types";
import Link from "next/link";

interface SearchResult {
  folderIdx: number;
  fileIdx: number;
  file: MediaFile;
  folderName: string;
}

interface GalleryHeaderProps {
  /** If omitted, search bar is hidden (used on grid pages) */
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchResults?: (query: string) => SearchResult[];
  onSelectResult?: (folderIdx: number, fileIdx: number) => void;
}

export function GalleryHeader({
  searchQuery,
  onSearchChange,
  searchResults,
  onSelectResult,
}: GalleryHeaderProps) {
  const hasSearch = onSearchChange !== undefined;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const results =
    hasSearch && searchQuery?.trim() && searchResults
      ? searchResults(searchQuery)
      : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center gap-3 px-4 py-2.5 bg-card border-b border-border shrink-0">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.jpg"
          alt="Gallery Player"
          className="size-8 rounded-md object-cover"
        />
        <span className="text-sm font-semibold text-foreground tracking-tight hidden sm:inline">
          Gallery Player
        </span>
      </Link>

      {/* Search (only shown when search props are provided) */}
      {hasSearch ? (
        <div className="flex-1 flex justify-center max-w-lg mx-auto relative">
          {isSearchOpen ? (
            <div className="w-full relative">
              <div
                className={cn(
                  "flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5 border transition-colors",
                  isFocused ? "border-primary" : "border-transparent"
                )}
              >
                <Search className="size-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery ?? ""}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Search files and folders..."
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
                  autoFocus
                />
                <button
                  onClick={() => {
                    onSearchChange?.("");
                    setIsSearchOpen(false);
                    setIsFocused(false);
                  }}
                  className="text-muted-foreground hover:text-foreground shrink-0"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Search dropdown */}
              {isFocused && searchQuery?.trim() && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
                >
                  {results.length === 0 ? (
                    <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                      No results found
                    </div>
                  ) : (
                    <div className="p-1">
                      {results.slice(0, 15).map((result, i) => (
                        <button
                          key={`${result.folderIdx}-${result.fileIdx}-${i}`}
                          onClick={() => {
                            onSelectResult?.(result.folderIdx, result.fileIdx);
                            onSearchChange?.("");
                            setIsSearchOpen(false);
                            setIsFocused(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm hover:bg-secondary transition-colors"
                        >
                          <ImageIcon className="size-3.5 text-muted-foreground shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-foreground truncate">
                              {result.file?.name ?? result.folderName}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <FolderOpen className="size-2.5" />
                              {result.folderName}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <Search className="size-4" />
              <span className="text-xs hidden sm:inline">
                Search files & folders...
              </span>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Right section */}
      <div className="flex items-center gap-1 shrink-0">
        <Link href="/gallery">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-1.5"
            aria-label="Grid view"
          >
            <LayoutGrid className="size-4" />
            <span className="text-xs hidden md:inline">Grid</span>
          </Button>
        </Link>
        <BackgroundMusic />
        <Link href="/instructions">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Instructions"
          >
            <BookOpen className="size-4" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
