"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Share2, Link, Check, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareMenuProps {
  url: string;
  title: string;
  className?: string;
  size?: "sm" | "md";
}

/* ── Full-screen share modal ─────────────────────────── */
function ShareModal({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fullUrl =
    typeof window !== "undefined"
      ? url.startsWith("http")
        ? url
        : `${window.location.origin}${url}`
      : url;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      bg: "bg-[#25D366]/10 hover:bg-[#25D366]/20",
      text: "text-[#25D366]",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bg: "bg-[#0077B5]/10 hover:bg-[#0077B5]/20",
      text: "text-[#0077B5]",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5 fill-current">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: "bg-[#1877F2]/10 hover:bg-[#1877F2]/20",
      text: "text-[#1877F2]",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5 fill-current">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      bg: "bg-foreground/5 hover:bg-foreground/10",
      text: "text-foreground",
      icon: (
        <svg viewBox="0 0 24 24" className="size-5 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm mx-4 animate-in fade-in-0 zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-base font-semibold text-foreground">Share</h3>
          <button
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Share title */}
        <p className="px-5 text-sm text-muted-foreground truncate">{title}</p>

        {/* Social buttons row */}
        <div className="flex items-center justify-center gap-3 px-5 py-5">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-colors",
                link.bg,
                link.text
              )}
              title={link.name}
              onClick={onClose}
            >
              {link.icon}
              <span className="text-[10px] font-medium">{link.name}</span>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-border" />

        {/* Copy link section */}
        <div className="px-5 py-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Or copy link
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 border border-border min-w-0">
              <Link className="size-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                readOnly
                value={fullUrl}
                onClick={() => inputRef.current?.select()}
                className="bg-transparent text-xs text-foreground outline-none w-full select-all truncate"
              />
            </div>
            <Button
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Share button (opens modal) ──────────────────────── */
export function ShareMenu({
  url,
  title,
  className,
  size = "sm",
}: ShareMenuProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className={cn(className)}>
        <Button
          variant="ghost"
          size={size === "sm" ? "icon-sm" : "icon"}
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Share"
        >
          <Share2 className={size === "sm" ? "size-3.5" : "size-4"} />
        </Button>
      </div>

      {showModal && (
        <ShareModal url={url} title={title} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
