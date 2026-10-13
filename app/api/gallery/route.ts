import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MEDIA_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".svg",
  ".mp4",
  ".mov",
  ".webm",
  ".avi",
  ".mkv",
]);

function isMedia(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return MEDIA_EXTENSIONS.has(ext);
}

function isVideo(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return [".mp4", ".mov", ".webm", ".avi", ".mkv"].includes(ext);
}

export async function GET() {
  const directoryPath = path.join(process.cwd(), "public", "directory");

  if (!fs.existsSync(directoryPath)) {
    return NextResponse.json({ folders: [], error: "No directory folder found. Add your media folders inside public/directory/" }, { status: 200 });
  }

  try {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
    const folders = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

    const galleryData = folders.map((folderName) => {
      const folderPath = path.join(directoryPath, folderName);
      const files = fs
        .readdirSync(folderPath)
        .filter((file) => {
          const filePath = path.join(folderPath, file);
          return fs.statSync(filePath).isFile() && isMedia(file);
        })
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
        .map((file) => ({
          name: file,
          path: `/directory/${folderName}/${file}`,
          type: isVideo(file) ? ("video" as const) : ("image" as const),
        }));

      return {
        name: folderName,
        files,
        count: files.length,
      };
    }).filter(folder => folder.count > 0);

    return NextResponse.json({ folders: galleryData });
  } catch (error) {
    console.error("Error scanning directory:", error);
    return NextResponse.json(
      { folders: [], error: "Failed to scan directory" },
      { status: 500 }
    );
  }
}
