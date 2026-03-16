/**
 * useBoard Hook - Business Logic for Board Operations
 * 
 * Encapsulates board CRUD operations from the Zustand store.
 * Provides a clean interface for the UI layer.
 */
import { useCallback } from 'react';
import { useKanbanStore } from '@/store/kanbanStore';
import { Board } from '@/domain/entities/types';

export interface UseBoardReturn {
  boards: Board[];
  activeBoard: Board | undefined;
  createBoard: (name: string) => Board;
  updateBoard: (id: string, name: string) => void;
  deleteBoard: (id: string) => void;
  setActiveBoard: (id: string | null) => void;
  getBoardNames: (excludeId?: string) => string[];
}

export function useBoard(): UseBoardReturn {
  const store = useKanbanStore();

  const boards = store.boards;
  const activeBoard = store.getActiveBoard();

  const createBoard = useCallback(
    (name: string) => {
      return store.createBoard(name);
    },
    [store]
  );

  const updateBoard = useCallback(
    (id: string, name: string) => {
      store.updateBoard(id, name);
    },
    [store]
  );

  const deleteBoard = useCallback(
    (id: string) => {
      store.deleteBoard(id);
    },
    [store]
  );

  const setActiveBoard = useCallback(
    (id: string | null) => {
      store.setActiveBoard(id);
    },
    [store]
  );

  const getBoardNames = useCallback(
    (excludeId?: string) => {
      return boards
        .filter((b) => b.id !== excludeId)
        .map((b) => b.name);
    },
    [boards]
  );

  return {
    boards,
    activeBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    setActiveBoard,
    getBoardNames,
  };
}
