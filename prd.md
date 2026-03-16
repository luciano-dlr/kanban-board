# PRD: TaskFlow Pro - Aplicación Kanban con Next.js

## 1. Visión del Producto
Aplicación moderna de gestión visual de tareas tipo Kanban, construida con Next.js, que permite organizar proyectos mediante tableros personalizables con drag & drop, persistencia local y experiencia de usuario fluida con tema adaptable.

## 2. Stack Tecnológico
 - **Paquetes:** npm
### Frontend Core

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS
- **UI Components:** shadcn/ui (construido sobre Radix UI)

### Gestión de Estado
- **Estado Global:** Zustand con middleware de persistencia
- **Estado Local:** React useState + useReducer

### Formularios y Validación
- **Manejo:** Formik
- **Validación:** Yup (esquemas tipados)
- **Campos controlados:** React Hook Form (opcional según complejidad)

### Drag & Drop
- **Core:** @dnd-kit/core
- **Presets:** @dnd-kit/sortable, @dnd-kit/utilities

### Persistencia
- **Local Storage:** Custom hook con serialización/deserialización
- **Estructura:** Versionada para futuras migraciones

## 3. Arquitectura de Estado (Zustand)

### Store Principal
```typescript
interface TaskStore {
  // Estado
  boards: Board[];
  currentBoardId: string | null;
  theme: 'light' | 'dark';
  
  // Acciones CRUD para tableros
  createBoard: (name: string) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  
  // Acciones para columnas
  addColumn: (boardId: string, title: string) => void;
  updateColumn: (boardId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  reorderColumns: (boardId: string, activeIndex: number, overIndex: number) => void;
  
  // Acciones para tareas
  addTask: (boardId: string, columnId: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (boardId: string, columnId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  moveTask: (boardId: string, fromColumnId: string, toColumnId: string, taskId: string, newOrder: number) => void;
  reorderTasks: (boardId: string, columnId: string, activeIndex: number, overIndex: number) => void;
  
  // Utilidades
  setCurrentBoard: (boardId: string) => void;
  toggleTheme: () => void;
  resetStore: () => void;
}