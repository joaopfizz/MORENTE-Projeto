import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getCriteriaDescription } from '@/lib/paacCriteriaDescriptions';

/**
 * Detecta se o dispositivo tem hover natural (mouse) ou é touch.
 * Em desktop usamos HoverCard (delay nativo, sem flicker).
 * Em mobile usamos Popover (clique/tap).
 */
function useHoverCapable() {
  const [hoverable, setHoverable] = useState(true);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setHoverable(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);
  return hoverable;
}

function TooltipBody({ description }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="h-7 w-7 rounded-full bg-gold-shine flex items-center justify-center shrink-0 mt-0.5">
        <Info className="w-3.5 h-3.5 text-ink-900" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300 mb-1">
          O que avaliar
        </p>
        <p className="text-sm leading-relaxed text-white">{description}</p>
      </div>
    </div>
  );
}

const TRIGGER_CLASS =
  'h-8 w-8 inline-flex items-center justify-center rounded-full text-ink-400 hover:text-gold-600 hover:bg-paper-100 transition-colors shrink-0';

const CONTENT_CLASS =
  'w-72 sm:w-80 max-w-[calc(100vw-2rem)] p-4 bg-ink-900 text-ink-100 border-ink-800 shadow-2xl';

export default function CriteriaInfo({ criteriaKey, type = 'demanda' }) {
  const description = getCriteriaDescription(criteriaKey, type);
  const hoverable = useHoverCapable();
  const [openMobile, setOpenMobile] = useState(false);

  if (!description) return null;

  // Desktop: HoverCard com delay nativo (sem flicker)
  if (hoverable) {
    return (
      <HoverCard openDelay={120} closeDelay={120}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            aria-label="Ver descrição do critério"
            className={TRIGGER_CLASS}
            onClick={(e) => e.preventDefault()}
          >
            <Info className="w-4 h-4" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          side="top"
          sideOffset={6}
          className={CONTENT_CLASS}
        >
          <TooltipBody description={description} />
        </HoverCardContent>
      </HoverCard>
    );
  }

  // Mobile: Popover por toque
  return (
    <Popover open={openMobile} onOpenChange={setOpenMobile}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Ver descrição do critério"
          className={TRIGGER_CLASS}
        >
          <Info className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        sideOffset={6}
        className={CONTENT_CLASS}
      >
        <TooltipBody description={description} />
      </PopoverContent>
    </Popover>
  );
}
