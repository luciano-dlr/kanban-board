/**
 * BoardList - Vista Component
 * 
 * Displays a list of all boards with create/select/delete actions.
 * Pure UI component - all logic is handled via the useBoard hook.
 */
'use client';

import { useState } from 'react';
import { Plus, Trash2, Layout } from 'lucide-react';
import { Board } from '@/domain/entities/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BoardFormController } from '@/controllers/BoardFormController';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface BoardListProps {
  boards: Board[];
  activeBoardId: string | null;
  onSelectBoard: (boardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
  onCreateBoard: (name: string) => Board;
  onUpdateBoard: (id: string, name: string) => void;
}

export function BoardList({
  boards,
  activeBoardId,
  onSelectBoard,
  onDeleteBoard,
  onCreateBoard,
  onUpdateBoard,
}: BoardListProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);

  const handleCreateSubmit = (name: string) => {
    onCreateBoard(name);
    setIsCreateDialogOpen(false);
  };

  const handleEditSubmit = (name: string) => {
    if (editingBoard) {
      onUpdateBoard(editingBoard.id, name);
      setEditingBoard(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (boardToDelete) {
      onDeleteBoard(boardToDelete.id);
      setBoardToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              TaskFlow Pro
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your projects with Kanban boards
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="shadow-lg shadow-primary/25 hover:shadow-xl transition-shadow"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Board
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-16">
          <Layout className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No boards yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first board to get started
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <Card
              key={board.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeBoardId === board.id
                  ? 'ring-2 ring-primary border-primary'
                  : ''
              }`}
              onClick={() => onSelectBoard(board.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{board.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {board.columnIds.length} columns
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">Open menu</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBoard(board);
                        }}
                      >
                        Edit name
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setBoardToDelete(board);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete board
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(board.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Board Dialog */}
      <BoardFormController
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        mode="create"
        existingNames={boards.map((b) => b.name)}
      />

      {/* Edit Board Dialog */}
      {editingBoard && (
        <BoardFormController
          open={!!editingBoard}
          onOpenChange={(open) => !open && setEditingBoard(null)}
          onSubmit={handleEditSubmit}
          mode="edit"
          initialValues={{ name: editingBoard.name }}
          existingNames={boards.map((b) => b.name)}
          excludeCurrentId={editingBoard.id}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {boardToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setBoardToDelete(null)}
        >
          <div
            className="
              bg-white/95 dark:bg-black/95
              backdrop-blur-xl
              rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl
              border-2 border-red-200 dark:border-red-900
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                  Delete Board
                </h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-foreground/80 mb-6">
              Are you sure you want to delete <strong>&quot;{boardToDelete.name}&quot;</strong>? 
              All columns and tasks will be permanently deleted.
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setBoardToDelete(null)}
                className="
                  border-violet-300 dark:border-violet-700
                  text-violet-700 dark:text-violet-300
                  hover:bg-violet-100 dark:hover:bg-violet-900
                  rounded-lg
                "
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConfirm}
                className="
                  bg-red-600 hover:bg-red-700
                  text-white font-semibold
                  shadow-lg shadow-red-500/30
                  rounded-lg
                "
              >
                🗑️ Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
