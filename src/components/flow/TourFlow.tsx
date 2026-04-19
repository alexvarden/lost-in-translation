"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState } from "react";
import clsx from "clsx";
import type { Step } from "@/types";
import { MAX_STEPS, MIN_STEPS } from "@/lib/tour";
import { getLanguage } from "@/lib/languages";
import { StepCard } from "./StepCard";
import { InsertButton } from "./InsertButton";
import { Connector } from "./Connector";

interface TourFlowProps {
  tour: Step[];
  activeStepId: string | null;
  isRunning: boolean;
  onReorder: (activeId: string, overId: string) => void;
  onAddAfter: (id: string) => void;
  onAddAtEnd: () => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onSetLanguage: (id: string, code: string) => void;
}

export function TourFlow({
  tour,
  activeStepId,
  isRunning,
  onReorder,
  onAddAfter,
  onAddAtEnd,
  onRemove,
  onDuplicate,
  onSetLanguage,
}: TourFlowProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const canAdd = tour.length < MAX_STEPS && !isRunning;
  const canRemove = tour.length > MIN_STEPS && !isRunning;
  const canDuplicate = canAdd;

  function handleDragStart(e: DragStartEvent) {
    setDraggingId(e.active.id as string);
  }

  function handleDragEnd(e: DragEndEvent) {
    setDraggingId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    onReorder(active.id as string, over.id as string);
  }

  const draggingStep = draggingId ? tour.find((s) => s.id === draggingId) ?? null : null;

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="inline-flex items-stretch gap-1 py-4 px-1 min-w-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={tour.map((s) => s.id)} strategy={horizontalListSortingStrategy}>
            {tour.map((step, i) => (
              <div key={step.id} className="flex items-center">
                {i > 0 && (
                  <div className="relative flex items-center px-1 group">
                    <Connector
                      drift={step.driftFromPrev}
                      isRunning={isRunning && step.isResolving === true}
                    />
                    {/* Insert-between button hidden until hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-dark-950/80 rounded-full backdrop-blur-sm">
                        <InsertButton
                          onClick={() => onAddAfter(tour[i - 1].id)}
                          disabled={!canAdd}
                          variant="between"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <StepCard
                  step={step}
                  index={i}
                  stepNumber={i + 1}
                  totalSteps={tour.length}
                  isFirst={i === 0}
                  isActive={activeStepId === step.id}
                  canRemove={canRemove}
                  canDuplicate={canDuplicate}
                  disabled={isRunning}
                  originLanguageCode={tour[0].languageCode}
                  onLanguageChange={(code) => onSetLanguage(step.id, code)}
                  onRemove={() => onRemove(step.id)}
                  onDuplicate={() => onDuplicate(step.id)}
                />
              </div>
            ))}
          </SortableContext>
          <DragOverlay>
            {draggingStep ? (
              <div className="step-card is-dragging rounded-2xl p-4 w-[300px] min-h-[260px] flex flex-col pointer-events-none">
                <div className="text-[10px] uppercase tracking-wider text-dark-400 mb-2">
                  Moving
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass-subtle">
                  <span className="text-lg">{getLanguage(draggingStep.languageCode).flag}</span>
                  <span className="text-sm font-medium text-dark-100">
                    {getLanguage(draggingStep.languageCode).name}
                  </span>
                </div>
                {draggingStep.translation && (
                  <div
                    className={clsx(
                      "mt-3 text-[15px] text-dark-100 leading-relaxed",
                      getLanguage(draggingStep.languageCode).dir === "rtl" && "text-right"
                    )}
                    dir={getLanguage(draggingStep.languageCode).dir}
                  >
                    {draggingStep.translation}
                  </div>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* End of tour: add at end */}
        <div className="flex items-center pl-2">
          <InsertButton onClick={onAddAtEnd} disabled={!canAdd} variant="end" />
        </div>
      </div>

      {/* Step count hint */}
      <div className="mt-2 px-1 text-[11px] text-dark-500 tnum">
        {tour.length} step{tour.length !== 1 ? "s" : ""}
        {tour.length >= MAX_STEPS && " · maximum reached"}
      </div>
    </div>
  );
}
