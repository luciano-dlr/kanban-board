/**
 * TaskFormController - Form Controller for Task CRUD
 * 
 * Handles form state, validation, and submission for creating/editing tasks.
 * Uses Formik with Yup validation schema.
 */
'use client';

import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { taskSchema, taskInitialValues, PRIORITY_OPTIONS } from '@/domain/schemas/taskSchema';
import { TaskPriority } from '@/domain/entities/types';

interface TaskFormValues {
  title: string;
  description: string;
  priority: TaskPriority;
}

interface TaskFormControllerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaskFormValues) => void;
  mode: 'create' | 'edit';
  initialValues?: TaskFormValues;
}

export function TaskFormController({
  open,
  onOpenChange,
  onSubmit,
  mode,
  initialValues = taskInitialValues,
}: TaskFormControllerProps) {
  const formik = useFormik<TaskFormValues>({
    initialValues,
    validationSchema: taskSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      formik.resetForm();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="
        sm:max-w-[500px]
        bg-white/95 dark:bg-black/95
        backdrop-blur-xl
        border-2 border-violet-200 dark:border-violet-800
        shadow-2xl shadow-violet-500/20
        rounded-xl
      ">
        <DialogHeader className="border-b border-violet-100 dark:border-violet-900 pb-4">
          <DialogTitle className="text-xl font-bold text-violet-900 dark:text-violet-100">
            {mode === 'create' ? '✨ Create Task' : '✏️ Edit Task'}
          </DialogTitle>
          <DialogDescription className="text-violet-600 dark:text-violet-400">
            {mode === 'create'
              ? 'Add a new task to this column.'
              : 'Update the task details.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-violet-900 dark:text-violet-200 font-medium">
                Title *
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter task title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="
                  bg-violet-50 dark:bg-violet-950/50
                  border-violet-200 dark:border-violet-800
                  text-violet-900 dark:text-violet-100
                  placeholder:text-violet-400 dark:placeholder:text-violet-600
                  focus:ring-2 focus:ring-violet-500 focus:border-violet-500
                  transition-all duration-200
                  rounded-lg
                  ${formik.touched.title && formik.errors.title
                    ? 'border-red-500 focus:ring-red-500'
                    : ''}
                "
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-sm text-red-500 font-medium">{formik.errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-violet-900 dark:text-violet-200 font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter task description (optional)"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
                className="
                  bg-violet-50 dark:bg-violet-950/50
                  border-violet-200 dark:border-violet-800
                  text-violet-900 dark:text-violet-100
                  placeholder:text-violet-400 dark:placeholder:text-violet-600
                  focus:ring-2 focus:ring-violet-500 focus:border-violet-500
                  transition-all duration-200
                  rounded-lg
                  resize-none
                  ${formik.touched.description && formik.errors.description
                    ? 'border-red-500 focus:ring-red-500'
                    : ''}
                "
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-red-500 font-medium">
                  {formik.errors.description}
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="grid gap-2">
              <Label htmlFor="priority" className="text-violet-900 dark:text-violet-200 font-medium">
                Priority *
              </Label>
              <Select
                value={formik.values.priority}
                onValueChange={(value: TaskPriority) =>
                  formik.setFieldValue('priority', value)
                }
              >
                <SelectTrigger
                  className="
                    bg-violet-50 dark:bg-violet-950/50
                    border-violet-200 dark:border-violet-800
                    text-violet-900 dark:text-violet-100
                    focus:ring-2 focus:ring-violet-500 focus:border-violet-500
                    transition-all duration-200
                    rounded-lg
                    ${formik.touched.priority && formik.errors.priority
                      ? 'border-red-500 focus:ring-red-500'
                      : ''}
                  "
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-violet-950 border-violet-200 dark:border-violet-800">
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="focus:bg-violet-100 dark:focus:bg-violet-900 focus:text-violet-900 dark:focus:text-violet-100"
                    >
                      <span className="flex items-center gap-2">
                        {option.value === 'High' && '🔴'}
                        {option.value === 'Medium' && '🟡'}
                        {option.value === 'Low' && '🟢'}
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.priority && formik.errors.priority && (
                <p className="text-sm text-red-500 font-medium">
                  {formik.errors.priority}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="
                border-violet-300 dark:border-violet-700
                text-violet-700 dark:text-violet-300
                hover:bg-violet-100 dark:hover:bg-violet-900
                hover:text-violet-900 dark:hover:text-violet-100
                transition-all duration-200
                rounded-lg
              "
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="
                bg-violet-600 hover:bg-violet-700
                dark:bg-violet-600 dark:hover:bg-violet-500
                text-white font-semibold
                shadow-lg shadow-violet-500/30
                hover:shadow-violet-500/50
                transition-all duration-200
                rounded-lg
              "
            >
              {mode === 'create' ? '✨ Create' : '💾 Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
