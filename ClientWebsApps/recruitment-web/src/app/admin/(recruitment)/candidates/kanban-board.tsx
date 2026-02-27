'use client';

import { useState, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CandidateItem, CandidateStatus, CandidateStatusValues, candidateStatusLabels } from '@/lib/schemas/recruitment';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface KanbanBoardProps {
    candidates: CandidateItem[];
    onStatusChange: (candidateId: string, newStatus: CandidateStatus) => void;
    onCandidateClick: (candidate: CandidateItem) => void;
}

const COLUMNS: CandidateStatus[] = [...CandidateStatusValues];

export function KanbanBoard({ candidates, onStatusChange, onCandidateClick }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    // Group candidates by status
    const columns = useMemo(() => {
        const cols: Record<CandidateStatus, CandidateItem[]> = {
            NEW: [],
            SCREENING: [],
            INTERVIEW: [],
            OFFER: [],
            HIRED: [],
            REJECTED: [],
        };
        candidates.forEach((c) => {
            if (cols[c.status]) {
                cols[c.status].push(c);
            }
        });
        return cols;
    }, [candidates]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeIdStr = active.id as string;
        const overId = over.id as string;

        // If dropping on a container (column), overId is the status
        // If dropping on an item, we need to find its status
        let newStatus: CandidateStatus | undefined;

        if ((COLUMNS as string[]).includes(overId)) {
            newStatus = overId as CandidateStatus;
        } else {
            const overCandidate = candidates.find(c => c.id === overId);
            if (overCandidate) {
                newStatus = overCandidate.status;
            }
        }

        if (newStatus) {
            const candidate = candidates.find(c => c.id === activeIdStr);
            if (candidate && candidate.status !== newStatus) {
                onStatusChange(activeIdStr, newStatus);
            }
        }
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full w-full gap-4 overflow-x-auto pb-4">
                {COLUMNS.map((colId) => (
                    <KanbanColumn
                        key={colId}
                        id={colId}
                        status={colId}
                        candidates={columns[colId]}
                        onCandidateClick={onCandidateClick}
                    />
                ))}
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeId ? (
                    <CandidateCard candidate={candidates.find((c) => c.id === activeId)!} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

function KanbanColumn({ id, status, candidates, onCandidateClick }: { id: string; status: CandidateStatus; candidates: CandidateItem[]; onCandidateClick: (candidate: CandidateItem) => void }) {
    const { setNodeRef } = useSortable({
        id: id,
        data: {
            type: 'Column',
            status: status,
        },
        disabled: true
    });

    const statusInfo = candidateStatusLabels[status];

    return (
        <div ref={setNodeRef} className="flex min-w-[280px] w-[280px] max-h-full flex-col rounded-lg bg-muted/50 border">
            <div className="p-3 font-semibold flex items-center justify-between border-b bg-muted/30">
                <div className="flex items-center gap-2">
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    <span className="text-muted-foreground text-sm">{candidates.length}</span>
                </div>
            </div>
            <div className="flex-1 p-2 overflow-y-auto min-h-[100px] scrollbar-kanban">
                <SortableContext items={candidates.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-2">
                        {candidates.map((candidate) => (
                            <SortableCandidateCard key={candidate.id} candidate={candidate} onClick={() => onCandidateClick(candidate)} />
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}

function SortableCandidateCard({ candidate, onClick }: { candidate: CandidateItem; onClick: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: candidate.id, data: { type: 'Candidate', candidate } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <CandidateCard candidate={candidate} onClick={onClick} />
        </div>
    );
}

function CandidateCard({ candidate, onClick }: { candidate: CandidateItem; onClick?: () => void }) {
    return (
        <Card onClick={onClick} className="cursor-grab hover:shadow-md transition-shadow bg-card">
            <CardContent className="p-3 space-y-2">
                <div className="flex items-start justify-between">
                    <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{candidate.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{candidate.job?.title || '—'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(candidate.appliedAt)}</span>
                </div>

                {candidate.rating && (
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-1.5 w-4 rounded-full ${i < candidate.rating! ? 'bg-yellow-400' : 'bg-muted'}`} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
