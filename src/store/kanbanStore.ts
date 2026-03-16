/**
 * Zustand Store for TaskFlow Pro Kanban Board
 * 
 * Single-flat store with persistence middleware.
 * All CRUD operations for boards, columns, and tasks.
 * State is automatically persisted to localStorage.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  Board, 
  Column, 
  Task, 
  TaskInput, 
  KanbanState 
} from '@/domain/entities/types';

/**
 * Default columns created for new boards
 */
const DEFAULT_COLUMNS = ['To Do', 'In Progress', 'Done'];

/**
 * Helper to get current timestamp in ISO 8601 format
 */
const now = () => new Date().toISOString();

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      // ==================== Initial State ====================
      boards: [],
      columns: {},
      tasks: {},
      activeBoardId: null,

      // ==================== Board Actions ====================
      
      createBoard: (name: string) => {
        const id = uuidv4();
        const timestamp = now();
        
        // Create default columns for the board
        const columnIds: string[] = [];
        const newColumns: Record<string, Column> = {};
        
        DEFAULT_COLUMNS.forEach((colName) => {
          const colId = uuidv4();
          columnIds.push(colId);
          newColumns[colId] = {
            id: colId,
            boardId: id,
            name: colName,
            taskIds: [],
            createdAt: timestamp,
            updatedAt: timestamp,
          };
        });

        const newBoard: Board = {
          id,
          name,
          columnIds,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        set((state) => ({
          boards: [...state.boards, newBoard],
          columns: { ...state.columns, ...newColumns },
          activeBoardId: id,
        }));

        return newBoard;
      },

      updateBoard: (id: string, name: string) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id
              ? { ...board, name, updatedAt: now() }
              : board
          ),
        }));
      },

      deleteBoard: (id: string) => {
        const state = get();
        const board = state.boards.find((b) => b.id === id);
        if (!board) return;

        // Get all columns and tasks to delete
        const columnIdsToDelete = board.columnIds;
        const taskIdsToDelete = columnIdsToDelete.flatMap(
          (colId) => state.columns[colId]?.taskIds || []
        );

        // Build new state objects
        const newColumns = { ...state.columns };
        const newTasks = { ...state.tasks };

        columnIdsToDelete.forEach((colId) => delete newColumns[colId]);
        taskIdsToDelete.forEach((taskId) => delete newTasks[taskId]);

        set({
          boards: state.boards.filter((b) => b.id !== id),
          columns: newColumns,
          tasks: newTasks,
          activeBoardId: state.activeBoardId === id ? null : state.activeBoardId,
        });
      },

      setActiveBoard: (id: string | null) => {
        set({ activeBoardId: id });
      },

      // ==================== Column Actions ====================

      createColumn: (boardId: string, name: string) => {
        const id = uuidv4();
        const timestamp = now();

        const newColumn: Column = {
          id,
          boardId,
          name,
          taskIds: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        set((state) => ({
          columns: { ...state.columns, [id]: newColumn },
          boards: state.boards.map((board) =>
            board.id === boardId
              ? { ...board, columnIds: [...board.columnIds, id], updatedAt: timestamp }
              : board
          ),
        }));

        return newColumn;
      },

      updateColumn: (boardId: string, columnId: string, name: string) => {
        set((state) => ({
          columns: {
            ...state.columns,
            [columnId]: {
              ...state.columns[columnId],
              name,
              updatedAt: now(),
            },
          },
        }));
      },

      deleteColumn: (boardId: string, columnId: string) => {
        const state = get();
        const column = state.columns[columnId];
        if (!column) return;

        // Get tasks to delete
        const taskIdsToDelete = column.taskIds;

        // Build new state objects
        const newColumns = { ...state.columns };
        const newTasks = { ...state.tasks };
        
        delete newColumns[columnId];
        taskIdsToDelete.forEach((taskId) => delete newTasks[taskId]);

        set({
          columns: newColumns,
          tasks: newTasks,
          boards: state.boards.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  columnIds: board.columnIds.filter((id) => id !== columnId),
                  updatedAt: now(),
                }
              : board
          ),
        });
      },

      reorderColumns: (boardId: string, columnIds: string[]) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId
              ? { ...board, columnIds, updatedAt: now() }
              : board
          ),
        }));
      },

      // ==================== Task Actions ====================

      createTask: (boardId: string, columnId: string, taskInput: TaskInput) => {
        const id = uuidv4();
        const timestamp = now();

        const newTask: Task = {
          id,
          columnId,
          title: taskInput.title,
          description: taskInput.description || '',
          priority: taskInput.priority,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        set((state) => ({
          tasks: { ...state.tasks, [id]: newTask },
          columns: {
            ...state.columns,
            [columnId]: {
              ...state.columns[columnId],
              taskIds: [...state.columns[columnId].taskIds, id],
              updatedAt: timestamp,
            },
          },
        }));

        return newTask;
      },

      updateTask: (
        boardId: string,
        columnId: string,
        taskId: string,
        updates: Partial<TaskInput>
      ) => {
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              ...updates,
              updatedAt: now(),
            },
          },
        }));
      },

      deleteTask: (boardId: string, columnId: string, taskId: string) => {
        set((state) => ({
          tasks: Object.fromEntries(
            Object.entries(state.tasks).filter(([id]) => id !== taskId)
          ),
          columns: {
            ...state.columns,
            [columnId]: {
              ...state.columns[columnId],
              taskIds: state.columns[columnId].taskIds.filter(
                (id) => id !== taskId
              ),
              updatedAt: now(),
            },
          },
        }));
      },

      moveTask: (
        boardId: string,
        fromColumnId: string,
        toColumnId: string,
        taskId: string,
        newIndex: number
      ) => {
        set((state) => {
          const fromColumn = state.columns[fromColumnId];
          const toColumn = state.columns[toColumnId];
          
          if (!fromColumn || !toColumn) return state;

          // Remove from source column
          const newFromTaskIds = fromColumn.taskIds.filter(
            (id) => id !== taskId
          );

          // Add to destination column at specific index
          const newToTaskIds = [...toColumn.taskIds];
          if (fromColumnId === toColumnId) {
            // Moving within same column
            newToTaskIds.splice(newIndex, 0, taskId);
          } else {
            newToTaskIds.splice(newIndex, 0, taskId);
          }

          return {
            tasks: {
              ...state.tasks,
              [taskId]: {
                ...state.tasks[taskId],
                columnId: toColumnId,
                updatedAt: now(),
              },
            },
            columns: {
              ...state.columns,
              [fromColumnId]: {
                ...fromColumn,
                taskIds: fromColumnId === toColumnId ? newToTaskIds : newFromTaskIds,
                updatedAt: now(),
              },
              ...(fromColumnId !== toColumnId
                ? {
                    [toColumnId]: {
                      ...toColumn,
                      taskIds: newToTaskIds,
                      updatedAt: now(),
                    },
                  }
                : {}),
            },
          };
        });
      },

      reorderTasks: (
        boardId: string,
        columnId: string,
        taskIds: string[]
      ) => {
        set((state) => ({
          columns: {
            ...state.columns,
            [columnId]: {
              ...state.columns[columnId],
              taskIds,
              updatedAt: now(),
            },
          },
        }));
      },

      // ==================== Getters ====================

      getBoard: (id: string) => {
        return get().boards.find((board) => board.id === id);
      },

      getColumn: (id: string) => {
        return get().columns[id];
      },

      getTask: (id: string) => {
        return get().tasks[id];
      },

      getActiveBoard: () => {
        const state = get();
        return state.boards.find((board) => board.id === state.activeBoardId);
      },

      getBoardColumns: (boardId: string) => {
        const state = get();
        const board = state.boards.find((b) => b.id === boardId);
        if (!board) return [];
        
        return board.columnIds
          .map((colId) => state.columns[colId])
          .filter((col): col is Column => col !== undefined);
      },

      getColumnTasks: (columnId: string) => {
        const state = get();
        const column = state.columns[columnId];
        if (!column) return [];
        
        return column.taskIds
          .map((taskId) => state.tasks[taskId])
          .filter((task): task is Task => task !== undefined);
      },
    }),
    {
      name: 'kanban-board-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        boards: state.boards,
        columns: state.columns,
        tasks: state.tasks,
        activeBoardId: state.activeBoardId,
      }),
    }
  )
);
