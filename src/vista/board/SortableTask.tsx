/**
 * SortableTask - Vista Component
 * 
 * Sortable task wrapper using @dnd-kit.
 */
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/domain/entities/types';
import { TaskCard } from '../task/TaskCard';

interface SortableTaskProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableTask({ task, onEdit, onDelete }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onClick={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}
