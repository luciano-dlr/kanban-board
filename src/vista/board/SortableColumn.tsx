/**
 * SortableColumn - Vista Component
 * 
 * Sortable column wrapper using @dnd-kit.
 */
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column, Task } from '@/domain/entities/types';
import { ColumnHeader } from '../column/ColumnHeader';
import { SortableTask } from './SortableTask';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SortableColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: () => void;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function SortableColumn({
  column,
  tasks,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onEditTask,
  onDeleteTask,
}: SortableColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex-shrink-0 w-[300px] 
        bg-white/40 dark:bg-black/40
        backdrop-blur-xl
        rounded-xl border border-white/20 dark:border-white/10
        shadow-lg shadow-black/5
        flex flex-col max-h-full
        transition-all duration-200
        ${isDragging ? 'opacity-60 scale-[1.02] shadow-2xl ring-2 ring-primary/30' : 'hover:shadow-xl hover:border-white/30'}
      `}
    >
      {/* Column Header - Draggable */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <ColumnHeader
          name={column.name}
          taskCount={tasks.length}
          onEdit={onEditColumn}
          onDelete={onDeleteColumn}
        />
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add Task Button */}
      <div className="p-2 border-t border-white/20">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-200"
          onClick={onAddTask}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
