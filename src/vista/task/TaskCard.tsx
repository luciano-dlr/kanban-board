/**
 * TaskCard - Vista Component
 * 
 * Displays a task with priority indicator and delete action.
 * Pure UI component - all logic is handled via props.
 * Note: Drag-and-drop (useSortable) will be added in Phase 4.
 */
'use client';

import { Trash2 } from 'lucide-react';
import { Task } from '@/domain/entities/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
  isDragging?: boolean;
}

const priorityColors = {
  Low: 'bg-emerald-500 shadow-emerald-500/30',
  Medium: 'bg-amber-500 shadow-amber-500/30',
  High: 'bg-rose-500 shadow-rose-500/30',
};

const priorityGradients = {
  Low: 'from-emerald-50 to-emerald-100/50',
  Medium: 'from-amber-50 to-amber-100/50',
  High: 'from-rose-50 to-rose-100/50',
};

const priorityBorderColors = {
  Low: 'border-emerald-200',
  Medium: 'border-amber-200',
  High: 'border-rose-200',
};

const priorityLabels = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
};

export function TaskCard({
  task,
  onClick,
  onDelete,
  isDragging = false,
}: TaskCardProps) {
  return (
    <Card
      className={`
        cursor-pointer transition-all duration-200 ease-out
        hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
        active:scale-[0.98]
        bg-gradient-to-br ${priorityGradients[task.priority]}
        border ${priorityBorderColors[task.priority]}
        ${isDragging ? 'opacity-50 ring-2 ring-primary scale-105 shadow-xl' : 'shadow-sm'}
      `}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm ${
                  priorityColors[task.priority]
                }`}
                title={`${priorityLabels[task.priority]} priority`}
              />
              <span className="text-sm font-semibold truncate text-foreground/90">
                {task.title}
              </span>
            </div>
            {task.description && (
              <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-1.5">
                {task.description}
              </p>
            )}
            <span className={`
              text-xs font-medium mt-2 inline-flex items-center px-2 py-0.5 rounded-full
              ${task.priority === 'Low' ? 'text-emerald-700 bg-emerald-100/70' : ''}
              ${task.priority === 'Medium' ? 'text-amber-700 bg-amber-100/70' : ''}
              ${task.priority === 'High' ? 'text-rose-700 bg-rose-100/70' : ''}
            `}>
              {priorityLabels[task.priority]}
            </span>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete task</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
