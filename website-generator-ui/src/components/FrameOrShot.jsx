import { useEffect, useState } from "react";
import { canEmbed, getScreenshotUrl } from "../api/analyzer";

export default function FrameOrShot({
  url,
  className = "",
  height = "80vh",
  viewport = { width: 1200, height: 800 },
}) {
  const [state, setState] = useState({
    checking: true,
    embeddable: null,
    reasons: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await canEmbed(url);
        if (!cancelled)
          setState({
            checking: false,
            embeddable: !!result.embeddable,
            reasons: result.reasons,
          });
      } catch (e) {
        if (!cancelled)
          setState({
            checking: false,
            embeddable: false,
            reasons: { error: e.message },
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (state.checking) {
    return (
      <div
        className={`flex items-center justify-center border rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 ${className}`}
        style={{ height }}
      >
        Checking embed permissions…
      </div>
    );
  }

  if (state.embeddable) {
    return (
      <div
        className={`relative border rounded-lg overflow-hidden bg-white ${className}`}
        style={{ height }}
      >
        <iframe
          src={url}
          title="Live Preview"
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="absolute top-2 right-2 px-3 py-1.5 rounded-md bg-black/70 text-white text-sm"
        >
          Open site
        </a>
      </div>
    );
  }

  const shotUrl = getScreenshotUrl(url, {
    fullPage: true,
    width: viewport.width,
    height: viewport.height,
    dpr: 1.25,
    maxScrolls: 40,
    delay: 300, // extra 300ms after all scrolls complete
    // waitSelector: ".site-hero" // only if you know a key element should be visible
  });

  return (
    <div
      className={`relative border rounded-lg overflow-hidden bg-neutral-900 ${className}`}
      style={{ height }}
    >
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-md bg-black/70 text-white text-sm"
        >
          Open site
        </a>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1.5 rounded-md bg-black/50 text-white text-sm"
        >
          Retry live preview
        </button>
      </div>

      <div className="w-full h-full overflow-auto">
        <img
          src={shotUrl}
          alt="Website screenshot"
          className="w-full h-auto"
          loading="lazy"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur p-2 text-xs text-white/80">
        The site blocks embedding in an iframe. Showing a screenshot instead.
      </div>
    </div>
  );
}
