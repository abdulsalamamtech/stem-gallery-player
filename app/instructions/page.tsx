import Link from "next/link";

export const metadata = {
  title: "Instructions - Gallery Player",
  description: "Learn how to navigate and use the Gallery Player application",
};

const shortcuts = [
  { key: "Space", action: "Play / Pause slideshow" },
  { key: "Right Arrow", action: "Next image or video" },
  { key: "Left Arrow", action: "Previous image or video" },
  { key: "Shift + Right Arrow", action: "Skip to next folder" },
  { key: "Shift + Left Arrow", action: "Skip to previous folder" },
  { key: "F", action: "Toggle fullscreen mode" },
  { key: "D", action: "Download current file" },
  { key: "S", action: "Toggle shuffle mode" },
  { key: "R", action: "Cycle repeat mode (Off / Folder / All)" },
  { key: "M", action: "Mute / Unmute background music" },
];

const features = [
  {
    title: "Sidebar Navigation",
    desc: "Browse folders on the left sidebar. Click a folder to expand it and see individual files. Click any file to jump directly to it.",
  },
  {
    title: "Auto-Play Slideshow",
    desc: "The gallery automatically advances through images at 4-second intervals. Videos play to completion before advancing. Use the play/pause button or press Space to control playback.",
  },
  {
    title: "Speed Control",
    desc: "Click the timer icon to cycle through playback speeds: 1x, 2x, 3x, and 5x. Higher speeds shorten the time each image is displayed.",
  },
  {
    title: "Repeat Modes",
    desc: "Cycle through three repeat modes: Off (stops at end), Folder (loops current folder), and All (loops through every folder continuously).",
  },
  {
    title: "Shuffle",
    desc: "Enable shuffle to randomly jump between files across all folders instead of sequential playback.",
  },
  {
    title: "Progress Slider",
    desc: "Drag the progress slider at the top of the controls to jump to any file across all folders. The counter shows your position out of total files.",
  },
  {
    title: "Download",
    desc: "Click the download icon or press D to download the currently displayed image or video.",
  },
  {
    title: "Share",
    desc: "Use the share button on any folder, file in the sidebar, or on the current image in the stage area. Share via WhatsApp, LinkedIn, Facebook, X, or copy a direct link.",
  },
  {
    title: "Background Music",
    desc: "Place an MP3 file named 'ambient.mp3' in the public/music/ folder. Click the speaker icon in the header to unmute/mute the background music.",
  },
  {
    title: "Search",
    desc: "Click the search icon in the header to search for files and folders by name. Results update as you type. Click a result to navigate directly to that file.",
  },
  {
    title: "Fullscreen",
    desc: "Click the fullscreen icon or press F to enter immersive fullscreen mode. Press F or Escape to exit.",
  },
];

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.jpg" alt="Gallery Player" className="size-8 rounded-md" />
            <span className="text-sm font-semibold">Gallery Player</span>
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <h1 className="text-sm font-medium text-foreground">Instructions</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* How to add content */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Getting Started</h2>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-sm text-foreground/80 leading-relaxed">
              Place your media folders inside the{" "}
              <code className="bg-secondary px-1.5 py-0.5 rounded text-xs text-primary font-mono">
                public/directory/
              </code>{" "}
              folder. Each subfolder becomes a navigable section in the sidebar. The gallery
              supports images (JPG, PNG, GIF, WebP, SVG, BMP) and videos (MP4, MOV, WebM, AVI, MKV).
              Folders and files are sorted alphabetically.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Features</h2>
          <div className="flex flex-col gap-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-lg p-4"
              >
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Keyboard Shortcuts
          </h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Key
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {shortcuts.map((sc, i) => (
                  <tr
                    key={sc.key}
                    className={i % 2 === 0 ? "" : "bg-secondary/20"}
                  >
                    <td className="px-4 py-2.5">
                      <kbd className="bg-secondary text-foreground px-2 py-0.5 rounded text-xs font-mono">
                        {sc.key}
                      </kbd>
                    </td>
                    <td className="px-4 py-2.5 text-foreground/80">
                      {sc.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/85 transition-colors"
          >
            Back to Gallery
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 py-3 text-center text-xs text-muted-foreground">
          Copyright {"\u00A9"} {new Date().getFullYear()} Gallery Player. Developed by{" "}
          <span className="font-semibold text-foreground/80">AMTECH</span>
        </div>
      </footer>
    </div>
  );
}
