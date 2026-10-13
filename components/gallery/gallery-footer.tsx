"use client";

export function GalleryFooter() {
  const year = new Date().getFullYear();

  return (
    <div className="flex items-center justify-center px-4 py-1.5 bg-card border-t border-border text-[10px] text-muted-foreground shrink-0">
      <span>
        {"Copyright \u00A9"} {year} Gallery Player. Developed by{" "}
        <span className="font-semibold text-foreground/80">AMTECH</span>
      </span>
    </div>
  );
}
