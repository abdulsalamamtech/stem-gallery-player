import fs from "fs";
import path from "path";

const folders = {
  "Architecture": ["modern-building", "skyline-night", "bridge-sunset", "cathedral-interior", "glass-tower"],
  "Landscapes": ["mountain-sunrise", "ocean-waves", "desert-dunes", "forest-path", "lake-reflection"],
  "Nature": ["wildflower-meadow", "autumn-leaves", "waterfall-cascade", "bird-in-flight", "coral-reef"],
  "Portraits": ["studio-portrait", "street-candid", "golden-hour-face", "silhouette-sunset", "child-laughter"],
  "Street Photography": ["rainy-street", "neon-signs", "market-bustle", "bicycle-alley", "shadow-play"],
  "Travel": ["paris-eiffel", "tokyo-crossing", "venice-canal", "santorini-blue", "new-york-taxi"],
};

const colors = [
  ["#0f172a", "#1e293b", "#334155", "#64748b"],
  ["#14532d", "#166534", "#15803d", "#22c55e"],
  ["#7c2d12", "#9a3412", "#c2410c", "#f97316"],
  ["#1e3a5f", "#2563eb", "#3b82f6", "#60a5fa"],
  ["#831843", "#be185d", "#ec4899", "#f472b6"],
  ["#451a03", "#78350f", "#b45309", "#f59e0b"],
];

function createSvgImage(name, colorSet, width = 1920, height = 1080) {
  const [c1, c2, c3, c4] = colorSet;
  const displayName = name.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${c1}"/>
      <stop offset="100%" style="stop-color:${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${c3};stop-opacity:0.4"/>
      <stop offset="100%" style="stop-color:${c3};stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <circle cx="${width/2}" cy="${height/2}" r="300" fill="url(#glow)"/>
  <circle cx="${width * 0.3}" cy="${height * 0.7}" r="80" fill="${c3}" opacity="0.3"/>
  <circle cx="${width * 0.7}" cy="${height * 0.3}" r="120" fill="${c4}" opacity="0.2"/>
  <text x="${width/2}" y="${height/2 - 20}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="64" font-weight="700" fill="white" opacity="0.9">${displayName}</text>
  <text x="${width/2}" y="${height/2 + 40}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" fill="${c4}" opacity="0.7">Gallery Demo Image</text>
</svg>`;
}

const baseDir = path.join(process.cwd(), "public", "directory");

if (fs.existsSync(baseDir)) {
  fs.rmSync(baseDir, { recursive: true });
}

let folderIndex = 0;
for (const [folderName, images] of Object.entries(folders)) {
  const folderPath = path.join(baseDir, folderName);
  fs.mkdirSync(folderPath, { recursive: true });
  
  const colorSet = colors[folderIndex % colors.length];
  
  images.forEach((imageName) => {
    const shuffled = [...colorSet].sort(() => Math.random() - 0.5);
    const svgContent = createSvgImage(imageName, shuffled);
    const filePath = path.join(folderPath, `${imageName}.svg`);
    fs.writeFileSync(filePath, svgContent);
  });
  
  folderIndex++;
}

console.log("Demo content created successfully!");
console.log(`Created ${Object.keys(folders).length} folders with ${Object.values(folders).flat().length} images total.`);
