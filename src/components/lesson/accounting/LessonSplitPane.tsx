"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { GripVertical, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";

interface LessonSplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  initialLeftPercent?: number;
  minLeftPercent?: number;
  maxLeftPercent?: number;
  isLeftCollapsed?: boolean;
  onExpandLeft?: () => void;
  className?: string;
}

const DEFAULT_LEFT_PERCENT = 30;
const DEFAULT_MIN_LEFT_PERCENT = 22;
const DEFAULT_MAX_LEFT_PERCENT = 55;

export function LessonSplitPane({
  left,
  right,
  initialLeftPercent = DEFAULT_LEFT_PERCENT,
  minLeftPercent = DEFAULT_MIN_LEFT_PERCENT,
  maxLeftPercent = DEFAULT_MAX_LEFT_PERCENT,
  isLeftCollapsed = false,
  onExpandLeft,
  className,
}: LessonSplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPercent, setLeftPercent] = useState(initialLeftPercent);
  const [isDragging, setIsDragging] = useState(false);

  const clampPercent = useCallback(
    (value: number) =>
      Math.min(maxLeftPercent, Math.max(minLeftPercent, value)),
    [maxLeftPercent, minLeftPercent]
  );

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      if (rect.width <= 0) return;

      const nextPercent = ((clientX - rect.left) / rect.width) * 100;
      setLeftPercent(clampPercent(nextPercent));
    },
    [clampPercent]
  );

  const handleResizeStart = useCallback(
    (clientX: number) => {
      setIsDragging(true);
      updateFromClientX(clientX);

      const handlePointerMove = (event: PointerEvent) => {
        updateFromClientX(event.clientX);
      };

      const handlePointerUp = () => {
        setIsDragging(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [updateFromClientX]
  );

  useEffect(() => {
    if (!isDragging) return;

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  const splitStyle = {
    "--split-left": `${leftPercent}%`,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      style={splitStyle}
      className={cn(
        "flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden lg:flex-row lg:gap-0",
        isDragging && "select-none",
        className
      )}
    >
      {!isLeftCollapsed ? (
        <div className="min-h-0 w-full overflow-hidden lg:w-[var(--split-left)] lg:shrink-0">
          {left}
        </div>
      ) : null}

      {!isLeftCollapsed ? (
        <button
          type="button"
          aria-label="Ajustar tamaño de los paneles"
          aria-orientation="vertical"
          aria-valuenow={Math.round(leftPercent)}
          aria-valuemin={minLeftPercent}
          aria-valuemax={maxLeftPercent}
          className={cn(
            "group relative hidden shrink-0 items-center justify-center lg:flex",
            "mx-3 h-full w-5 cursor-col-resize touch-none",
            "before:absolute before:inset-y-0 before:-left-2 before:-right-2 before:content-['']"
          )}
          onPointerDown={(event) => {
            event.preventDefault();
            handleResizeStart(event.clientX);
          }}
        >
          <span
            className={cn(
              "relative z-10 flex h-10 w-5 items-center justify-center rounded-md border border-border bg-background shadow-sm transition-colors",
              "group-hover:border-primary/35 group-hover:bg-muted/50",
              isDragging && "border-primary/45 bg-muted/60"
            )}
            aria-hidden="true"
          >
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
        </button>
      ) : null}

      {isLeftCollapsed && onExpandLeft ? (
        <button
          type="button"
          aria-label="Mostrar ejercicio de causación"
          onClick={onExpandLeft}
          className={cn(
            "group mr-2 flex shrink-0 items-center justify-center self-stretch",
            "w-8 rounded-md border border-border bg-background shadow-sm transition-colors",
            "hover:border-primary/35 hover:bg-muted/50",
            "lg:mr-3"
          )}
        >
          <PanelLeftOpen className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
        </button>
      ) : null}

      <div className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto">
        {right}
      </div>
    </div>
  );
}
