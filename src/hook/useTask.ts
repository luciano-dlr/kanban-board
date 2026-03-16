/**
 * useTask Hook - Business Logic for Task Operations
 * 
 * Encapsulates task CRUD operations from the Zustand store.
 * Provides a clean interface for the UI layer.
 */
import { useCallback } from 'react';
import { useKanbanStore } from '@/store/kanbanStore';
import { Task, TaskInput } from '@/domain/entities/types';

export interface UseTaskReturn {
  getColumnTasks: (columnId: string) => Task[];
  createTask: (boardId: string, columnId: string, task: TaskInput) => Task;
  updateTask: (
    boardId: string,
    columnId: string,
    taskId: string,
    updates: Partial<TaskInput>
  ) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  moveTask: (
    boardId: string,
    fromColumnId: string,
    toColumnId: string,
    taskId: string,
    newIndex: number
  ) => void;
  reorderTasks: (boardId: string, columnId: string, taskIds: string[]) => void;
}

export function useTask(): UseTaskReturn {
  const store = useKanbanStore();

  const getColumnTasks = useCallback(
    (columnId: string) => {
      return store.getColumnTasks(columnId);
    },
    [store]
  );

  const createTask = useCallback(
    (boardId: string, columnId: string, task: TaskInput) => {
      return store.createTask(boardId, columnId, task);
    },
    [store]
  );

  const updateTask = useCallback(
    (
      boardId: string,
      columnId: string,
      taskId: string,
      updates: Partial<TaskInput>
    ) => {
      store.updateTask(boardId, columnId, taskId, updates);
    },
    [store]
  );

  const deleteTask = useCallback(
    (boardId: string, columnId: string, taskId: string) => {
      store.deleteTask(boardId, columnId, taskId);
    },
    [store]
  );

  const moveTask = useCallback(
    (
      boardId: string,
      fromColumnId: string,
      toColumnId: string,
      taskId: string,
      newIndex: number
    ) => {
      store.moveTask(boardId, fromColumnId, toColumnId, taskId, newIndex);
    },
    [store]
  );

  const reorderTasks = useCallback(
    (boardId: string, columnId: string, taskIds: string[]) => {
      store.reorderTasks(boardId, columnId, taskIds);
    },
    [store]
  );

  return {
    getColumnTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
  };
}
