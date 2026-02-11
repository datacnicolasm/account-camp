"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const COLLAPSED_HEIGHT = 140;

interface CourseDescriptionProps {
  content: string;
}

export function CourseDescription({ content }: CourseDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollHeight > COLLAPSED_HEIGHT);
  }, [content]);

  const needsExpand = isOverflowing;
  const showFade = needsExpand && !isExpanded;

  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-foreground">Descripción</h2>

      <div className="relative">
        <motion.div
          ref={containerRef}
          initial={false}
          animate={{
            height: isExpanded || !needsExpand ? "auto" : COLLAPSED_HEIGHT,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
          }
          className="overflow-hidden"
        >
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {content}
          </p>
        </motion.div>

        {showFade && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent"
            aria-hidden
          />
        )}

        {needsExpand && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-2 inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-primary no-underline hover:no-underline hover:text-primary/90 transition-colors"
          >
            {isExpanded ? "Ver menos" : "Ver más"}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </section>
  );
}
