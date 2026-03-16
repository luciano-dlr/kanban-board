/**
 * KanbanBoardVista - Vista Component
 * 
 * Main Kanban board view with drag-and-drop support.
 * Uses @dnd-kit for drag and drop functionality.
 */
'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, ArrowLeft } from 'lucide-react';
import { Board, Column, Task } from '@/domain/entities/types';
import { Button } from '@/components/ui/button';
import { SortableColumn } from './SortableColumn';
import { SortableTask } from './SortableTask';
import { TaskCard } from '../task/TaskCard';
import { ColumnFormController } from '@/controllers/ColumnFormController';
import { TaskFormController } from '@/controllers/TaskFormController';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface KanbanBoardVistaProps {
  board: Board;
  columns: Column[];
  tasks: Record<string, Task>;
  onReorderColumns: (columnIds: string[]) => void;
  onReorderTasks: (columnId: string, taskIds: string[]) => void;
  onMoveTask: (fromColumnId: string, toColumnId: string, taskId: string, newIndex: number) => void;
  onCreateColumn: (name: string) => void;
  onUpdateColumn: (columnId: string, name: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onCreateTask: (columnId: string, task: { title: string; description?: string; priority: 'Low' | 'Medium' | 'High' }) => void;
  onUpdateTask: (taskId: string, updates: { title?: string; description?: string; priority?: 'Low' | 'Medium' | 'High' }) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onBack: () => void;
}

export function KanbanBoardVista({
  board,
  columns,
  tasks,
  onReorderColumns,
  onReorderTasks,
  onMoveTask,
  onCreateColumn,
  onUpdateColumn,
  onDeleteColumn,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onBack,
}: KanbanBoardVistaProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'column' | 'task' | null>(null);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumnByTaskId = (taskId: string): Column | undefined => {
    return columns.find((col) => col.taskIds.includes(taskId));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id as string;
    
    // Determine if dragging a column or task
    const isColumn = columns.some((col) => col.id === id);
    if (isColumn) {
      setActiveId(id);
      setActiveType('column');
    } else {
      setActiveId(id);
      setActiveType('task');
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeType !== 'task') return;

    const activeColumn = findColumnByTaskId(activeId);
    let overColumn: Column | undefined;

    // Check if over is a column
    overColumn = columns.find((col) => col.id === overId);
    if (!overColumn) {
      // Check if over is a task in a column
      overColumn = findColumnByTaskId(overId);
    }

    if (!activeColumn || !overColumn) return;
    if (activeColumn.id === overColumn.id) return;

    // Move task to new column (temporary, will be finalized on dragEnd)
    const overIndex = overColumn.taskIds.length;
    onMoveTask(activeColumn.id, overColumn.id, activeId, overIndex);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveType(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeType === 'column') {
      // Reorder columns - find which column we're over
      const activeColumnId = activeId;
      
      // Get all column IDs
      const columnIds = columns.map((col) => col.id);
      
      // Find the column we're over (check if over.id is a column)
      const overColumn = columns.find((col) => col.id === overId);
      
      if (!overColumn || activeColumnId === overColumn.id) {
        setActiveId(null);
        setActiveType(null);
        return;
      }

      const oldIndex = columnIds.indexOf(activeColumnId);
      const newIndex = columnIds.indexOf(overColumn.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newColumnIds = arrayMove(columnIds, oldIndex, newIndex);
        onReorderColumns(newColumnIds);
      }
    } else if (activeType === 'task') {
      const activeColumn = findColumnByTaskId(activeId);
      if (!activeColumn) {
        setActiveId(null);
        setActiveType(null);
        return;
      }

      const isOverColumn = columns.some((col) => col.id === overId);
      
      if (isOverColumn) {
        // Dropped on a column - move to end of that column
        const overColumn = columns.find((col) => col.id === overId);
        if (overColumn && activeColumn.id !== overColumn.id) {
          onMoveTask(activeColumn.id, overColumn.id, activeId, overColumn.taskIds.length);
        }
      } else {
        // Dropped on a task
        const overColumn = findColumnByTaskId(overId);
        if (!overColumn) {
          setActiveId(null);
          setActiveType(null);
          return;
        }

        const oldIndex = activeColumn.taskIds.indexOf(activeId);
        const newIndex = activeColumn.taskIds.indexOf(overId);

        if (oldIndex !== newIndex) {
          const newTaskIds = arrayMove(activeColumn.taskIds, oldIndex, newIndex);
          onReorderTasks(activeColumn.id, newTaskIds);
        } else if (activeColumn.id !== overColumn.id) {
          // Moving between columns but dropped on a task
          const targetIndex = overColumn.taskIds.indexOf(overId);
          onMoveTask(activeColumn.id, overColumn.id, activeId, targetIndex);
        }
      }
    }

    setActiveId(null);
    setActiveType(null);
  };

  const handleAddColumn = (name: string) => {
    onCreateColumn(name);
    setIsColumnDialogOpen(false);
  };

  const handleAddTask = (task: { title: string; description?: string; priority: 'Low' | 'Medium' | 'High' }) => {
    if (selectedColumnId) {
      onCreateTask(selectedColumnId, task);
      setIsTaskDialogOpen(false);
      setSelectedColumnId(null);
    }
  };

  const handleEditColumn = (name: string) => {
    if (editingColumn) {
      onUpdateColumn(editingColumn.id, name);
      setEditingColumn(null);
    }
  };

  const handleEditTask = (task: { title: string; description?: string; priority: 'Low' | 'Medium' | 'High' }) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, task);
      setEditingTask(null);
    }
  };

  const activeTask = activeType === 'task' && activeId ? tasks[activeId] : null;
  const activeColumn = activeType === 'column' && activeId ? columns.find((c) => c.id === activeId) : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="
        flex items-center gap-4 p-4 
        border-b bg-gradient-to-r from-primary/5 via-primary/10 to-transparent
        backdrop-blur-sm
      ">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="hover:bg-white/50 dark:hover:bg-black/50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold flex-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {board.name}
        </h1>
        <Button 
          onClick={() => setIsColumnDialogOpen(true)}
          className="shadow-lg shadow-primary/25 hover:shadow-xl transition-shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Column
        </Button>
        <ThemeToggle />
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={(args) => {
          // First check for column intersections (for column reordering)
          const columnCollisions = rectIntersection(args);
          if (columnCollisions.length > 0 && activeType === 'column') {
            return columnCollisions;
          }
          // Use closestCorners for tasks
          return closestCorners(args);
        }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-4 h-full min-h-[calc(100vh-180px)]">
            <SortableContext
              items={columns.map((col) => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column) => (
                <SortableColumn
                  key={column.id}
                  column={column}
                  tasks={column.taskIds.map((id) => tasks[id]).filter(Boolean)}
                  onAddTask={() => {
                    setSelectedColumnId(column.id);
                    setIsTaskDialogOpen(true);
                  }}
                  onEditColumn={() => setEditingColumn(column)}
                  onDeleteColumn={() => onDeleteColumn(column.id)}
                  onEditTask={setEditingTask}
                  onDeleteTask={(taskId) => onDeleteTask(column.id, taskId)}
                />
              ))}
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="opacity-90 scale-105 rotate-1 transition-transform duration-200">
              <TaskCard task={activeTask} isDragging />
            </div>
          )}
          {activeColumn && (
            <div className="
              bg-white/80 dark:bg-black/80
              backdrop-blur-md
              rounded-xl p-4 w-[300px] 
              shadow-2xl ring-2 ring-primary/50
              scale-105 rotate-1
              border border-white/20
            ">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{activeColumn.name}</h3>
                <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  {activeColumn.taskIds.length} tasks
                </span>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Column Form Dialog */}
      <ColumnFormController
        open={isColumnDialogOpen}
        onOpenChange={setIsColumnDialogOpen}
        onSubmit={handleAddColumn}
        mode="create"
        existingNames={columns.map((c) => c.name)}
      />

      {/* Edit Column Dialog */}
      {editingColumn && (
        <ColumnFormController
          open={!!editingColumn}
          onOpenChange={() => setEditingColumn(null)}
          onSubmit={handleEditColumn}
          mode="edit"
          initialValues={{ name: editingColumn.name }}
          existingNames={columns.map((c) => c.name)}
          excludeCurrentId={editingColumn.id}
        />
      )}

      {/* Task Form Dialog */}
      <TaskFormController
        open={isTaskDialogOpen}
        onOpenChange={(open) => {
          setIsTaskDialogOpen(open);
          if (!open) setSelectedColumnId(null);
        }}
        onSubmit={handleAddTask}
        mode="create"
      />

      {/* Edit Task Dialog */}
      {editingTask && (
        <TaskFormController
          open={!!editingTask}
          onOpenChange={() => setEditingTask(null)}
          onSubmit={handleEditTask}
          mode="edit"
          initialValues={{
            title: editingTask.title,
            description: editingTask.description,
            priority: editingTask.priority,
          }}
        />
      )}
    </div>
  );
}
