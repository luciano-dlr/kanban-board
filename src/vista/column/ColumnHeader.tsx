/**
 * ColumnHeader - Vista Component
 * 
 * Displays column name with edit/delete actions.
 * Pure UI component - all logic is handled via props.
 */
'use client';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ColumnHeaderProps {
  name: string;
  taskCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function ColumnHeader({
  name,
  taskCount,
  onEdit,
  onDelete,
}: ColumnHeaderProps) {
  const handleDelete = () => {
    if (taskCount > 0) {
      const confirmed = window.confirm(
        `This column contains ${taskCount} task${taskCount > 1 ? 's' : ''}. ` +
          'Deleting it will also delete all tasks. Are you sure?'
      );
      if (confirmed) {
        onDelete();
      }
    } else {
      onDelete();
    }
  };

  return (
    <div className="
      flex items-center justify-between px-3 py-3 
      bg-white/30 dark:bg-black/30
      rounded-t-xl border-b border-white/20
      backdrop-blur-sm
    ">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-sm text-foreground/90">{name}</h3>
        <span className="
          text-xs text-muted-foreground 
          bg-primary/10 dark:bg-primary/20 
          px-2 py-0.5 rounded-full
          font-medium
        ">
          {taskCount}
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 hover:bg-white/50 dark:hover:bg-black/50 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Column options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete column
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
