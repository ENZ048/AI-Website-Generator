import { Suspense, lazy, useMemo } from "react";
import Loader from "../components/Loader";

const loaders = {
  "digital-marketing/maxreach": () => import("./digital-marketing/maxreach/Renderer.jsx"),
  // add more templates here later…
};

export default function TemplateHost({ templateId, content }) {
  const LazyRenderer = useMemo(() => {
    const fn = loaders[templateId];
    return fn ? lazy(fn) : null;
  }, [templateId]);

  if (!LazyRenderer) {
    return (
      <div className="p-6 text-sm text-slate-600">
        Unknown template: <span className="font-mono">{templateId}</span>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loader label="Loading clone…" />}>
      <LazyRenderer content={content} />
    </Suspense>
  );
}
