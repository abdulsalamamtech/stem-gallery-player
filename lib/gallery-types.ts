export interface MediaFile {
  name: string;
  path: string;
  type: "image" | "video";
}

export interface Folder {
  name: string;
  files: MediaFile[];
  count: number;
}

export interface GalleryData {
  folders: Folder[];
  error?: string;
}

export type PlaybackSpeed = 1 | 2 | 3 | 5;
export type RepeatMode = "none" | "folder" | "all";
