import { ProjectItem } from '../types';

const DEFAULT_TITLE = 'Vignesh K N — AI Software Engineer & Systems Architect';
const DEFAULT_DESCRIPTION =
  'Portfolio of Vignesh K N, AI Software Engineer with 4+ years building enterprise .NET 8 backends, Azure serverless pipelines, QLoRA fine-tuned LLMs, and deterministic AI systems.';
const BASE_ORIGIN = 'https://vignesh-k-n.is-a.dev';

function setMetaContent(selector: string, content: string): void {
  if (typeof document === 'undefined') return;
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) {
    el.setAttribute('content', content);
  }
}

function setCanonicalHref(url: string): void {
  if (typeof document === 'undefined') return;
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function applyRouteMetadata(options: {
  project?: ProjectItem | null;
  isNotFound?: boolean;
}): void {
  if (typeof document === 'undefined') return;

  if (options.isNotFound) {
    const title = '404 · Route Not Found — Vignesh K N';
    const desc =
      'The requested page or case study route could not be found. Explore Vignesh K N’s 9 verified AI engineering systems.';
    document.title = title;
    setMetaContent('meta[name="description"]', desc);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', desc);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', desc);
    setCanonicalHref(`${BASE_ORIGIN}/`);
    return;
  }

  if (options.project) {
    const p = options.project;
    const title = `${p.title} — Case Study ${p.number} · Vignesh K N`;
    const desc =
      p.description ||
      p.tagline ||
      `${p.title} engineering case study by Vignesh K N (${p.technologies?.slice(0, 4).join(', ')}).`;
    const canonical = `${BASE_ORIGIN}/projects/${p.id}`;

    document.title = title;
    setMetaContent('meta[name="description"]', desc);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', desc);
    setMetaContent('meta[property="og:url"]', canonical);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', desc);
    setCanonicalHref(canonical);
    return;
  }

  document.title = DEFAULT_TITLE;
  setMetaContent('meta[name="description"]', DEFAULT_DESCRIPTION);
  setMetaContent('meta[property="og:title"]', DEFAULT_TITLE);
  setMetaContent('meta[property="og:description"]', DEFAULT_DESCRIPTION);
  setMetaContent('meta[property="og:url"]', `${BASE_ORIGIN}/`);
  setMetaContent('meta[name="twitter:title"]', DEFAULT_TITLE);
  setMetaContent('meta[name="twitter:description"]', DEFAULT_DESCRIPTION);
  setCanonicalHref(`${BASE_ORIGIN}/`);
}
