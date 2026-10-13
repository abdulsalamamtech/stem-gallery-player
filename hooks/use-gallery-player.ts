"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  GalleryData,
  Folder,
  MediaFile,
  PlaybackSpeed,
  RepeatMode,
} from "@/lib/gallery-types";

const SLIDE_DURATION = 4000;

export function useGalleryPlayer() {
  const [data, setData] = useState<GalleryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [folderIndex, setFolderIndex] = useState(0);
  const [fileIndex, setFileIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");
  const [shuffle, setShuffle] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch gallery data
  useEffect(() => {
    let cancelled = false;
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((json: GalleryData) => {
        if (!cancelled) {
          setData(json);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(err.message);
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const folders: Folder[] = data?.folders ?? [];
  const currentFolder = folders[folderIndex] ?? null;
  const currentFile: MediaFile | null = currentFolder?.files[fileIndex] ?? null;
  const isVideo = currentFile?.type === "video";
  const totalFiles = folders.reduce((acc, f) => acc + f.count, 0);
  const globalIndex =
    folders.slice(0, folderIndex).reduce((acc, f) => acc + f.count, 0) +
    fileIndex;

  // Search
  const searchResults = useCallback(
    (query: string) => {
      if (!query.trim()) return [];
      const q = query.toLowerCase();
      const results: { folderIdx: number; fileIdx: number; file: MediaFile; folderName: string }[] = [];
      folders.forEach((folder, fIdx) => {
        if (folder.name.toLowerCase().includes(q)) {
          results.push({ folderIdx: fIdx, fileIdx: 0, file: folder.files[0], folderName: folder.name });
        }
        folder.files.forEach((file, fileIdx) => {
          if (file.name.toLowerCase().includes(q)) {
            results.push({ folderIdx: fIdx, fileIdx, file, folderName: folder.name });
          }
        });
      });
      return results;
    },
    [folders]
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const getRandomFileIndices = useCallback(() => {
    if (folders.length === 0) return { folder: 0, file: 0 };
    const randFolder = Math.floor(Math.random() * folders.length);
    const randFile = Math.floor(
      Math.random() * (folders[randFolder]?.files.length || 1)
    );
    return { folder: randFolder, file: randFile };
  }, [folders]);

  const goToNext = useCallback(() => {
    if (folders.length === 0) return;
    if (shuffle) {
      const { folder, file } = getRandomFileIndices();
      setFolderIndex(folder);
      setFileIndex(file);
      return;
    }
    const folder = folders[folderIndex];
    if (!folder) return;
    if (fileIndex < folder.files.length - 1) {
      setFileIndex((prev) => prev + 1);
    } else if (folderIndex < folders.length - 1) {
      setFolderIndex((prev) => prev + 1);
      setFileIndex(0);
    } else {
      if (repeatMode === "all") {
        setFolderIndex(0);
        setFileIndex(0);
      } else if (repeatMode === "folder") {
        setFileIndex(0);
      } else {
        setIsPlaying(false);
      }
    }
  }, [folders, folderIndex, fileIndex, repeatMode, shuffle, getRandomFileIndices]);

  const goToPrev = useCallback(() => {
    if (folders.length === 0) return;
    if (fileIndex > 0) {
      setFileIndex((prev) => prev - 1);
    } else if (folderIndex > 0) {
      const prevFolder = folders[folderIndex - 1];
      setFolderIndex((prev) => prev - 1);
      setFileIndex(prevFolder ? prevFolder.files.length - 1 : 0);
    } else if (repeatMode === "all") {
      const lastFolderIdx = folders.length - 1;
      setFolderIndex(lastFolderIdx);
      setFileIndex(folders[lastFolderIdx].files.length - 1);
    }
  }, [folders, folderIndex, fileIndex, repeatMode]);

  const goToNextFolder = useCallback(() => {
    if (folders.length === 0) return;
    if (folderIndex < folders.length - 1) {
      setFolderIndex((prev) => prev + 1);
      setFileIndex(0);
    } else if (repeatMode === "all") {
      setFolderIndex(0);
      setFileIndex(0);
    }
  }, [folders, folderIndex, repeatMode]);

  const goToPrevFolder = useCallback(() => {
    if (folders.length === 0) return;
    if (folderIndex > 0) {
      setFolderIndex((prev) => prev - 1);
      setFileIndex(0);
    } else if (repeatMode === "all") {
      setFolderIndex(folders.length - 1);
      setFileIndex(0);
    }
  }, [folders, folderIndex, repeatMode]);

  const selectFolder = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < folders.length) {
        setFolderIndex(idx);
        setFileIndex(0);
      }
    },
    [folders.length]
  );

  const selectFile = useCallback(
    (fIdx: number, fileIdx: number) => {
      if (fIdx >= 0 && fIdx < folders.length) {
        setFolderIndex(fIdx);
        setFileIndex(fileIdx);
      }
    },
    [folders.length]
  );

  const togglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);

  const cycleSpeed = useCallback(() => {
    setSpeed((prev) => {
      const speeds: PlaybackSpeed[] = [1, 2, 3, 5];
      const idx = speeds.indexOf(prev);
      return speeds[(idx + 1) % speeds.length];
    });
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      const modes: RepeatMode[] = ["none", "folder", "all"];
      const idx = modes.indexOf(prev);
      return modes[(idx + 1) % modes.length];
    });
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((prev) => !prev), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const downloadCurrent = useCallback(() => {
    if (!currentFile) return;
    const link = document.createElement("a");
    link.href = `/api/download?file=${encodeURIComponent(currentFile.path)}`;
    link.download = currentFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentFile]);

  const seekToGlobal = useCallback(
    (globalIdx: number) => {
      let remaining = globalIdx;
      for (let i = 0; i < folders.length; i++) {
        if (remaining < folders[i].files.length) {
          setFolderIndex(i);
          setFileIndex(remaining);
          return;
        }
        remaining -= folders[i].files.length;
      }
    },
    [folders]
  );

  // Auto-advance timer for images
  useEffect(() => {
    clearTimer();
    if (!isPlaying || isVideo || folders.length === 0) return;
    const duration = SLIDE_DURATION / speed;
    timerRef.current = setTimeout(() => goToNext(), duration);
    return clearTimer;
  }, [isPlaying, isVideo, speed, folderIndex, fileIndex, folders.length, goToNext, clearTimer]);

  // Handle video end
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;
    const handleEnded = () => {
      if (isPlaying) goToNext();
    };
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [isVideo, isPlaying, goToNext]);

  // Set video playback rate
  useEffect(() => {
    if (videoRef.current && isVideo) {
      videoRef.current.playbackRate = speed;
    }
  }, [speed, isVideo, currentFile]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          if (e.shiftKey) goToNextFolder();
          else goToNext();
          break;
        case "ArrowLeft":
          if (e.shiftKey) goToPrevFolder();
          else goToPrev();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "d":
          downloadCurrent();
          break;
        case "s":
          toggleShuffle();
          break;
        case "r":
          cycleRepeat();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, goToNext, goToPrev, goToNextFolder, goToPrevFolder, toggleFullscreen, downloadCurrent, toggleShuffle, cycleRepeat]);

  // Fullscreen change listener
  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return {
    folders,
    currentFolder,
    currentFile,
    isVideo,
    isLoading,
    error: fetchError || data?.error,
    totalFiles,
    globalIndex,
    folderIndex,
    fileIndex,
    isPlaying,
    speed,
    repeatMode,
    shuffle,
    isSidebarOpen,
    isFullscreen,
    searchQuery,
    setSearchQuery,
    searchResults,
    videoRef,
    goToNext,
    goToPrev,
    goToNextFolder,
    goToPrevFolder,
    selectFolder,
    selectFile,
    togglePlay,
    cycleSpeed,
    cycleRepeat,
    toggleShuffle,
    toggleSidebar,
    toggleFullscreen,
    downloadCurrent,
    seekToGlobal,
  };
}
