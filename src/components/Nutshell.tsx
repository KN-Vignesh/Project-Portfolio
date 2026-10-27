import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X, ArrowUpRight, Minimize2 } from 'lucide-react';
import {
  NUTSHELL_REGISTRY,
  NUTSHELL_ENTRIES_LIST,
  NutshellEntry,
} from '../data/nutshellData';

interface NutshellContextValue {
  activeByBlock: Record<string, string>;
  nestedByBlock: Record<string, string>;
  toggleBlockSlug: (blockId: string, slug: string) => void;
  toggleNestedSlug: (blockId: string, slug: string) => void;
  closeBlock: (blockId: string) => void;
  closeAll: () => void;
  openCount: number;
  onSelectProject?: (projectId: string) => void;
}

const NutshellContext = createContext<NutshellContextValue>({
  activeByBlock: {},
  nestedByBlock: {},
  toggleBlockSlug: () => {},
  toggleNestedSlug: () => {},
  closeBlock: () => {},
  closeAll: () => {},
  openCount: 0,
});

export const useNutshell = () => useContext(NutshellContext);

interface NutshellProviderProps {
  children: React.ReactNode;
  onSelectProject?: (projectId: string) => void;
}

export const NutshellProvider: React.FC<NutshellProviderProps> = ({
  children,
  onSelectProject,
}) => {
  const [activeByBlock, setActiveByBlock] = useState<Record<string, string>>(
    {}
  );
  const [nestedByBlock, setNestedByBlock] = useState<Record<string, string>>(
    {}
  );

  const toggleBlockSlug = useCallback((blockId: string, slug: string) => {
    setActiveByBlock((prev) => {
      const next = { ...prev };
      if (next[blockId] === slug) {
        delete next[blockId];
      } else {
        next[blockId] = slug;
      }
      return next;
    });
    setNestedByBlock((prev) => {
      if (!prev[blockId]) return prev;
      const next = { ...prev };
      delete next[blockId];
      return next;
    });
  }, []);

  const toggleNestedSlug = useCallback((blockId: string, slug: string) => {
    setNestedByBlock((prev) => {
      const next = { ...prev };
      if (next[blockId] === slug) {
        delete next[blockId];
      } else {
        next[blockId] = slug;
      }
      return next;
    });
  }, []);

  const closeBlock = useCallback((blockId: string) => {
    setActiveByBlock((prev) => {
      if (!prev[blockId]) return prev;
      const next = { ...prev };
      delete next[blockId];
      return next;
    });
    setNestedByBlock((prev) => {
      if (!prev[blockId]) return prev;
      const next = { ...prev };
      delete next[blockId];
      return next;
    });
  }, []);

  const closeAll = useCallback(() => {
    setActiveByBlock({});
    setNestedByBlock({});
  }, []);

  const openCount = Object.keys(activeByBlock).length;

  useEffect(() => {
    if (openCount === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openCount, closeAll]);

  const value = useMemo(
    () => ({
      activeByBlock,
      nestedByBlock,
      toggleBlockSlug,
      toggleNestedSlug,
      closeBlock,
      closeAll,
      openCount,
      onSelectProject,
    }),
    [
      activeByBlock,
      nestedByBlock,
      toggleBlockSlug,
      toggleNestedSlug,
      closeBlock,
      closeAll,
      openCount,
      onSelectProject,
    ]
  );

  return (
    <NutshellContext.Provider value={value}>
      {children}
      <GlobalNutshellReset />
    </NutshellContext.Provider>
  );
};

interface ParsedToken {
  type: 'text' | 'trigger';
  content: string;
  slug?: string;
}

const EXPLICIT_TOKEN_REGEX = /:([a-z0-9-]+)\[([^\]]+)\]/g;

/**
 * Parses explicit `:slug[Label]` syntax or automatically links up to `maxTriggers`
 * registered technical terms in dynamic text while keeping density minimal.
 */
export function parseNutshellTokens(
  text: string,
  maxTriggers = 3,
  enableAutoMatch = true,
  allowTriggers = true
): ParsedToken[] {
  if (!text) return [];

  // If triggers are disabled (e.g. at depth >= 2), strip explicit syntax to plain labels
  if (!allowTriggers) {
    return [
      {
        type: 'text',
        content: text.replace(EXPLICIT_TOKEN_REGEX, '$2'),
      },
    ];
  }

  // 1. Check if text contains explicit `:slug[Label]` markup
  if (text.includes(':[') || EXPLICIT_TOKEN_REGEX.test(text)) {
    EXPLICIT_TOKEN_REGEX.lastIndex = 0;
    const tokens: ParsedToken[] = [];
    let lastIndex = 0;
    let triggerCount = 0;
    let match: RegExpExecArray | null;

    while ((match = EXPLICIT_TOKEN_REGEX.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          type: 'text',
          content: text.slice(lastIndex, match.index),
        });
      }
      const slug = match[1];
      const label = match[2];
      if (NUTSHELL_REGISTRY[slug] && triggerCount < maxTriggers) {
        tokens.push({
          type: 'trigger',
          slug,
          content: label,
        });
        triggerCount++;
      } else {
        tokens.push({
          type: 'text',
          content: label,
        });
      }
      lastIndex = EXPLICIT_TOKEN_REGEX.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }
    return tokens;
  }

  // 2. Automatic smart matching for plain strings (e.g., projects.json descriptions)
  if (!enableAutoMatch || maxTriggers <= 0) {
    return [{ type: 'text', content: text }];
  }

  interface CandidateMatch {
    start: number;
    end: number;
    slug: string;
    matchedText: string;
  }

  const candidates: CandidateMatch[] = [];
  const usedSlugs = new Set<string>();

  for (const entry of NUTSHELL_ENTRIES_LIST) {
    if ( !entry.aliases || entry.aliases.length === 0) continue;
    // Sort aliases longest-first so specific phrases match before short acronyms
    const sortedAliases = [...entry.aliases].sort(
      (a, b) => b.length - a.length
    );
    for (const alias of sortedAliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-zA-Z0-9_])(${escaped})(?=$|[^a-zA-Z0-9_])`);
      const found = regex.exec(text);
      if (found) {
        const prefixLen = found[1].length;
        const start = found.index + prefixLen;
        const matchedText = found[2];
        const end = start + matchedText.length;
        candidates.push({
          start,
          end,
          slug: entry.id,
          matchedText,
        });
        break;
      }
    }
  }

  if (candidates.length === 0) {
    return [{ type: 'text', content: text }];
  }

  // Sort by appearance order in the paragraph and remove overlaps
  candidates.sort((a, b) => a.start - b.start);
  const accepted: CandidateMatch[] = [];
  let cursor = 0;

  for (const cand of candidates) {
    if (accepted.length >= maxTriggers) break;
    if (cand.start >= cursor && !usedSlugs.has(cand.slug)) {
      accepted.push(cand);
      usedSlugs.add(cand.slug);
      cursor = cand.end;
    }
  }

  if (accepted.length === 0) {
    return [{ type: 'text', content: text }];
  }

  const result: ParsedToken[] = [];
  let pos = 0;
  for (const item of accepted) {
    if (item.start > pos) {
      result.push({
        type: 'text',
        content: text.slice(pos, item.start),
      });
    }
    result.push({
      type: 'trigger',
      slug: item.slug,
      content: item.matchedText,
    });
    pos = item.end;
  }
  if (pos < text.length) {
    result.push({
      type: 'text',
      content: text.slice(pos),
    });
  }

  return result;
}

interface NutshellTextProps {
  text: string;
  blockId: string;
  className?: string;
  as?: 'p' | 'div' | 'span';
  maxTriggers?: number;
  autoLink?: boolean;
}

export const NutshellText: React.FC<NutshellTextProps> = ({
  text,
  blockId,
  className = '',
  as: Tag = 'div',
  maxTriggers = 2,
  autoLink = true,
}) => {
  const {
    activeByBlock,
    nestedByBlock,
    toggleBlockSlug,
    toggleNestedSlug,
    closeBlock,
    onSelectProject,
  } = useNutshell();
  const prefersReducedMotion = useReducedMotion();

  const tokens = useMemo(
    () => parseNutshellTokens(text, maxTriggers, autoLink, true),
    [text, maxTriggers, autoLink]
  );

  const activeSlug = activeByBlock[blockId];
  const activeEntry: NutshellEntry | undefined = activeSlug
    ? NUTSHELL_REGISTRY[activeSlug]
    : undefined;

  const activeNestedSlug = nestedByBlock[blockId];
  const activeNestedEntry: NutshellEntry | undefined = activeNestedSlug
    ? NUTSHELL_REGISTRY[activeNestedSlug]
    : undefined;

  const drawerTokens = useMemo(() => {
    if (!activeEntry) return [];
    return parseNutshellTokens(activeEntry.summary, 2, false, true);
  }, [activeEntry]);

  return (
    <div className="space-y-2.5">
      <Tag className={className}>
        {tokens.map((token, idx) => {
          if (token.type === 'text' || !token.slug) {
            return <React.Fragment key={idx}>{token.content}</React.Fragment>;
          }
          const isOpen = activeSlug === token.slug;
          const drawerId = `nutshell-drawer-${blockId}`;
          return (
            <button
              key={`${token.slug}-${idx}`}
              type="button"
              aria-expanded={isOpen}
              aria-controls={drawerId}
              onClick={(e) => {
                e.stopPropagation();
                toggleBlockSlug(blockId, token.slug!);
              }}
              title={
                isOpen
                  ? 'Collapse technical explanation'
                  : `Expand in a nutshell: ${NUTSHELL_REGISTRY[token.slug]?.term || token.content}`
              }
              className={`group/ns inline items-baseline font-inherit text-left transition-colors duration-150 cursor-pointer rounded-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-[#7CFF6B] ${
                isOpen
                  ? 'text-[#7CFF6B] border-b border-solid border-[#7CFF6B]'
                  : 'text-[#F2F2F2] border-b border-dotted border-white/25 hover:border-[#7CFF6B]/80 hover:text-[#7CFF6B]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`font-mono text-[0.85em] mr-0.5 select-none transition-colors ${
                  isOpen
                    ? 'text-[#7CFF6B]'
                    : 'text-[#8B8F98] group-hover/ns:text-[#7CFF6B]'
                }`}
              >
                :
              </span>
              <span>{token.content}</span>
            </button>
          );
        })}
      </Tag>

      {/* Single-Active Block-Level Stretch Drawer */}
      <AnimatePresence mode="wait" initial={false}>
        {activeEntry && (
          <motion.aside
            key={activeEntry.id}
            id={`nutshell-drawer-${blockId}`}
            role="region"
            aria-label={`In a Nutshell: ${activeEntry.term}`}
            onClick={(e) => e.stopPropagation()}
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, height: 0, y: -4 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, height: 'auto', y: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, height: 0, y: -4 }
            }
            transition={{
              duration: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden"
          >
            <div className="rounded-xl bg-[#0C0E12] border border-white/[0.08] p-4 sm:p-5 space-y-3 text-left shadow-lg">
              {/* Quiet Unboxed Top Metadata Header */}
              <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-white/[0.06] font-mono text-[11px]">
                <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                  <span className="text-[#8B8F98]">{activeEntry.category}</span>
                  <span aria-hidden="true" className="text-white/20">
                    ·
                  </span>
                  <span className="text-[#F2F2F2] font-semibold truncate">
                    {activeEntry.term}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => closeBlock(blockId)}
                  aria-label={`Close ${activeEntry.term} explanation`}
                  className="text-[#8B8F98] hover:text-[#F2F2F2] p-1 rounded-md hover:bg-white/[0.04] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Concise Summary with 1-Level Nested Stretch-Text Support */}
              <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
                {drawerTokens.map((t, tIdx) => {
                  if (t.type === 'text' || !t.slug) {
                    return <React.Fragment key={tIdx}>{t.content}</React.Fragment>;
                  }
                  const isNestedOpen = activeNestedSlug === t.slug;
                  return (
                    <button
                      key={`${t.slug}-${tIdx}`}
                      type="button"
                      aria-expanded={isNestedOpen}
                      onClick={() => toggleNestedSlug(blockId, t.slug!)}
                      className={`group/ns2 inline items-baseline font-inherit text-left transition-colors cursor-pointer ${
                        isNestedOpen
                          ? 'text-[#7CFF6B] border-b border-solid border-[#7CFF6B]'
                          : 'text-[#F2F2F2] border-b border-dotted border-white/25 hover:border-[#7CFF6B]/80 hover:text-[#7CFF6B]'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-[0.85em] mr-0.5 text-[#7CFF6B]"
                      >
                        :
                      </span>
                      <span>{t.content}</span>
                    </button>
                  );
                })}
              </p>

              {/* Optional 1-Level Nested Sub-Explanation (Depth 2 Cap) */}
              <AnimatePresence mode="wait" initial={false}>
                {activeNestedEntry && (
                  <motion.div
                    key={activeNestedEntry.id}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, height: 0 }
                    }
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 1, height: 'auto' }
                    }
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, height: 0 }
                    }
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pl-3.5 border-l border-[#7CFF6B]/35 py-1.5 space-y-1.5 bg-[#08090B]/60 rounded-r-lg pr-3">
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#8B8F98]">
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                          <span className="text-[#8B8F98]">
                            {activeNestedEntry.category}
                          </span>
                          <span aria-hidden="true" className="text-white/20">
                            ·
                          </span>
                          <span className="text-[#F2F2F2] font-semibold truncate">
                            {activeNestedEntry.term}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            toggleNestedSlug(blockId, activeNestedEntry.id)
                          }
                          className="text-[#8B8F98] hover:text-[#F2F2F2] cursor-pointer"
                        >
                          [collapse]
                        </button>
                      </div>
                      <p className="text-xs text-[#D1D5DB] leading-relaxed">
                        {
                          parseNutshellTokens(
                            activeNestedEntry.summary,
                            0,
                            false,
                            false
                          )[0]?.content
                        }
                      </p>
                      {activeNestedEntry.formulaOrCode && (
                        <div className="font-mono text-[11px] text-[#7CFF6B] bg-[#08090B] border border-white/[0.06] rounded px-2.5 py-1 overflow-x-auto">
                          <code>{activeNestedEntry.formulaOrCode}</code>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Optional 1-Line Formula or Code Specification */}
              {activeEntry.formulaOrCode && (
                <div className="font-mono text-[11px] text-[#D1D5DB] bg-[#08090B] border border-white/[0.06] rounded-lg px-3 py-2 overflow-x-auto">
                  <code className="text-[#7CFF6B]">
                    {activeEntry.formulaOrCode}
                  </code>
                </div>
              )}

              {/* Footer: Unboxed Verification Metrics + Case Study Link */}
              {(activeEntry.metrics?.length ||
                activeEntry.relatedProjectId) && (
                <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[#8B8F98]">
                    {activeEntry.metrics?.map((m, mIdx) => (
                      <React.Fragment key={m}>
                        <span className="text-[#D1D5DB] tabular-nums">{m}</span>
                        {mIdx < (activeEntry.metrics?.length || 0) - 1 && (
                          <span aria-hidden="true" className="text-white/20">
                            ·
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {activeEntry.relatedProjectId && onSelectProject && (
                    <a
                      href={`/projects/${activeEntry.relatedProjectId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectProject(activeEntry.relatedProjectId!);
                      }}
                      className="text-[#7CFF6B] hover:underline inline-flex items-center gap-1 font-semibold shrink-0 cursor-pointer"
                    >
                      <span>Inspect Case Study</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export const GlobalNutshellReset: React.FC = () => {
  const { openCount, closeAll } = useNutshell();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {openCount >= 2 && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.16 }}
          className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40"
        >
          <button
            type="button"
            onClick={closeAll}
            className="swift-spring-btn px-3.5 py-2 rounded-xl bg-[#101216]/95 backdrop-blur-md border border-white/[0.12] hover:border-[#7CFF6B]/60 text-xs font-mono text-[#D1D5DB] hover:text-[#7CFF6B] shadow-xl flex items-center gap-2 cursor-pointer"
            title="Collapse all expanded Nutshell explanations (Esc)"
          >
            <Minimize2 className="w-3.5 h-3.5 text-[#7CFF6B]" />
            <span>Collapse All ({openCount})</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
