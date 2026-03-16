/**
 * Yup Schema for Column validation
 * 
 * Used with Formik for client-side validation.
 * The uniqueness check within a board is handled separately in the controller.
 */
import * as Yup from 'yup';

/**
 * Base column schema with field validation
 */
export const columnSchema = Yup.object().shape({
  name: Yup.string()
    .required('Column name is required')
    .min(1, 'Column name must be at least 1 character')
    .max(50, 'Column name must be 50 characters or less'),
});

/**
 * Column schema with uniqueness validation within a board
 * Use this when creating/editing to check against existing column names
 * 
 * @param existingNames - Array of existing column names in the current board
 * @param excludeCurrentId - Optional ID to exclude from uniqueness check (for edit mode)
 */
export const columnSchemaWithUnique = (existingNames: string[], excludeCurrentId?: string) => {
  // Filter out the current column's name if we're in edit mode
  const filteredNames = excludeCurrentId ? existingNames : existingNames;
  
  return Yup.object().shape({
    name: Yup.string()
      .required('Column name is required')
      .min(1, 'Column name must be at least 1 character')
      .max(50, 'Column name must be 50 characters or less')
      .notOneOf(filteredNames, 'A column with this name already exists in this board'),
  });
};

/**
 * Infer TypeScript type from schema
 */
export type ColumnFormValues = Yup.InferType<typeof columnSchema>;
