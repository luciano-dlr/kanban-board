/**
 * ColumnFormController - Form Controller for Column CRUD
 * 
 * Handles form state, validation, and submission for creating/editing columns.
 * Uses Formik with Yup validation schema.
 */
'use client';

import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { columnSchemaWithUnique } from '@/domain/schemas/columnSchema';

interface ColumnFormValues {
  name: string;
}

interface ColumnFormControllerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
  mode: 'create' | 'edit';
  initialValues?: ColumnFormValues;
  existingNames: string[];
  excludeCurrentId?: string;
}

export function ColumnFormController({
  open,
  onOpenChange,
  onSubmit,
  mode,
  initialValues = { name: '' },
  existingNames,
  excludeCurrentId,
}: ColumnFormControllerProps) {
  const formik = useFormik<ColumnFormValues>({
    initialValues,
    validationSchema: columnSchemaWithUnique(existingNames, excludeCurrentId),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values.name);
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
        sm:max-w-[425px]
        bg-white/95 dark:bg-black/95
        backdrop-blur-xl
        border-2 border-violet-200 dark:border-violet-800
        shadow-2xl shadow-violet-500/20
        rounded-xl
      ">
        <DialogHeader className="border-b border-violet-100 dark:border-violet-900 pb-4">
          <DialogTitle className="text-xl font-bold text-violet-900 dark:text-violet-100">
            {mode === 'create' ? '📋 Add Column' : '✏️ Edit Column'}
          </DialogTitle>
          <DialogDescription className="text-violet-600 dark:text-violet-400">
            {mode === 'create'
              ? 'Enter a name for the new column.'
              : 'Update the column name.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-violet-900 dark:text-violet-200 font-medium">
                Column Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter column name"
                value={formik.values.name}
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
                  ${formik.touched.name && formik.errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : ''}
                "
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-500 font-medium">{formik.errors.name}</p>
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
              {mode === 'create' ? '➕ Add' : '💾 Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
