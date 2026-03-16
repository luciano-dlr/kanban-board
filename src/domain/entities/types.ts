/**
 * Domain Entities for TaskFlow Pro Kanban Board
 * 
 * Following hexagonal architecture, these types represent the core domain
 * and are independent of any framework or persistence mechanism.
 */

// ==================== Board ====================

export interface Board {
  id: string;           // UUID v4
  name: string;         // 1-100 characters
  columnIds: string[];  // Ordered column IDs
  createdAt: string;   // ISO 8601 timestamp
  updatedAt: string;   // ISO 8601 timestamp
}

// ==================== Column ====================

export interface Column {
  id: string;           // UUID v4
  boardId: string;      // Reference to parent board
  name: string;         // 1-50 characters
  taskIds: string[];   // Ordered task IDs
  createdAt: string;   // ISO 8601 timestamp
  updatedAt: string;   // ISO 8601 timestamp
}

// ==================== Task ====================

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;            // UUID v4
  columnId: string;      // Reference to parent column
  title: string;         // 1-200 characters
  description: string;  // 0-1000 characters
  priority: TaskPriority;
  createdAt: string;     // ISO 8601 timestamp
  updatedAt: string;    // ISO 8601 timestamp
}

// ==================== Input Types ====================

export interface TaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
}

export interface ColumnInput {
  name: string;
}

export interface BoardInput {
  name: string;
}

// ==================== Store Types ====================

export interface KanbanState {
  // State
  boards: Board[];
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
  activeBoardId: string | null;
  
  // Board Actions
  createBoard: (name: string) => Board;
  updateBoard: (id: string, name: string) => void;
  deleteBoard: (id: string) => void;
  setActiveBoard: (id: string | null) => void;
  
  // Column Actions
  createColumn: (boardId: string, name: string) => Column;
  updateColumn: (boardId: string, columnId: string, name: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  reorderColumns: (boardId: string, columnIds: string[]) => void;
  
  // Task Actions
  createTask: (boardId: string, columnId: string, task: TaskInput) => Task;
  updateTask: (boardId: string, columnId: string, taskId: string, updates: Partial<TaskInput>) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  moveTask: (boardId: string, fromColumnId: string, toColumnId: string, taskId: string, newIndex: number) => void;
  reorderTasks: (boardId: string, columnId: string, taskIds: string[]) => void;
  
  // Getters
  getBoard: (id: string) => Board | undefined;
  getColumn: (id: string) => Column | undefined;
  getTask: (id: string) => Task | undefined;
  getActiveBoard: () => Board | undefined;
  getBoardColumns: (boardId: string) => Column[];
  getColumnTasks: (columnId: string) => Task[];
}
