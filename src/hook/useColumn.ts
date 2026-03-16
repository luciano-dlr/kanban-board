/**
 * useColumn Hook - Business Logic for Column Operations
 * 
 * Encapsulates column CRUD operations from the Zustand store.
 * Provides a clean interface for the UI layer.
 */
import { useCallback, useMemo } from 'react';
import { useKanbanStore } from '@/store/kanbanStore';
import { Column } from '@/domain/entities/types';

export interface UseColumnReturn {
  getBoardColumns: (boardId: string) => Column[];
  getColumnNames: (columnIds: string[]) => string[];
  createColumn: (boardId: string, name: string) => Column;
  updateColumn: (boardId: string, columnId: string, name: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  reorderColumns: (boardId: string, columnIds: string[]) => void;
}

export function useColumn(): UseColumnReturn {
  const store = useKanbanStore();

  const getBoardColumns = useCallback(
    (boardId: string) => {
      return store.getBoardColumns(boardId);
    },
    [store]
  );

  const getColumnNames = useCallback(
    (columnIds: string[]) => {
      return columnIds
        .map((id) => store.columns[id]?.name)
        .filter((name): name is string => name !== undefined);
    },
    [store]
  );

  const createColumn = useCallback(
    (boardId: string, name: string) => {
      return store.createColumn(boardId, name);
    },
    [store]
  );

  const updateColumn = useCallback(
    (boardId: string, columnId: string, name: string) => {
      store.updateColumn(boardId, columnId, name);
    },
    [store]
  );

  const deleteColumn = useCallback(
    (boardId: string, columnId: string) => {
      store.deleteColumn(boardId, columnId);
    },
    [store]
  );

  const reorderColumns = useCallback(
    (boardId: string, columnIds: string[]) => {
      store.reorderColumns(boardId, columnIds);
    },
    [store]
  );

  return {
    getBoardColumns,
    getColumnNames,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
  };
}
