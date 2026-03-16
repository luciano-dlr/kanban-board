/**
 * Main Page - TaskFlow Pro Kanban Board
 * 
 * Entry point for the application.
 * Shows board list or selected board based on state.
 */
'use client';

import { useKanbanStore } from '@/store/kanbanStore';
import { BoardList } from '@/vista/board/BoardList';
import { KanbanBoardVista } from '@/vista/board/KanbanBoardVista';

export default function Home() {
  const {
    boards,
    activeBoardId,
    columns,
    tasks,
    createBoard,
    updateBoard,
    deleteBoard,
    setActiveBoard,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    getActiveBoard,
    getBoardColumns,
  } = useKanbanStore();

  const activeBoard = getActiveBoard();
  const boardColumns = activeBoardId ? getBoardColumns(activeBoardId) : [];

  // If no board is selected, show the board list
  if (!activeBoard) {
    return (
      <BoardList
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={setActiveBoard}
        onDeleteBoard={deleteBoard}
        onCreateBoard={createBoard}
        onUpdateBoard={updateBoard}
      />
    );
  }

  // Show the Kanban board
  return (
    <KanbanBoardVista
      board={activeBoard}
      columns={boardColumns}
      tasks={tasks}
      onReorderColumns={(columnIds) => {
        if (activeBoardId) reorderColumns(activeBoardId, columnIds);
      }}
      onReorderTasks={(columnId, taskIds) => {
        if (activeBoardId) reorderTasks(activeBoardId, columnId, taskIds);
      }}
      onMoveTask={(fromColumnId, toColumnId, taskId, newIndex) => {
        if (activeBoardId) moveTask(activeBoardId, fromColumnId, toColumnId, taskId, newIndex);
      }}
      onCreateColumn={(name) => {
        if (activeBoardId) createColumn(activeBoardId, name);
      }}
      onUpdateColumn={(columnId, name) => {
        if (activeBoardId) updateColumn(activeBoardId, columnId, name);
      }}
      onDeleteColumn={(columnId) => {
        if (activeBoardId) deleteColumn(activeBoardId, columnId);
      }}
      onCreateTask={(columnId, task) => {
        if (activeBoardId) createTask(activeBoardId, columnId, task);
      }}
      onUpdateTask={(taskId, updates) => {
        // Find the task's column
        const column = Object.values(columns).find((col) => col.taskIds.includes(taskId));
        if (column && activeBoardId) {
          updateTask(activeBoardId, column.id, taskId, updates);
        }
      }}
      onDeleteTask={(columnId, taskId) => {
        if (activeBoardId) deleteTask(activeBoardId, columnId, taskId);
      }}
      onBack={() => setActiveBoard(null)}
    />
  );
}
