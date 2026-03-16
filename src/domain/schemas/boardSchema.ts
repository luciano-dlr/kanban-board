/**
 * Yup Schema for Board validation
 * 
 * Used with Formik for client-side validation.
 * The uniqueness check is handled separately in the controller.
 */
import * as Yup from 'yup';

/**
 * Base board schema with field validation
 */
export const boardSchema = Yup.object().shape({
  name: Yup.string()
    .required('Board name is required')
    .min(1, 'Board name must be at least 1 character')
    .max(100, 'Board name must be 100 characters or less'),
});

/**
 * Board schema with uniqueness validation
 * Use this when editing to check against existing board names
 * 
 * @param existingNames - Array of existing board names to check against
 * @param excludeCurrentId - Optional board ID to exclude (for editing)
 */
export const boardSchemaWithUnique = (
  existingNames: string[],
  excludeCurrentId?: string
) => {
  // Filter out the current board name if we're editing
  const validNames = excludeCurrentId 
    ? existingNames 
    : existingNames;
  
  return Yup.object().shape({
    name: Yup.string()
      .required('Board name is required')
      .min(1, 'Board name must be at least 1 character')
      .max(100, 'Board name must be 100 characters or less')
      .notOneOf(validNames, 'A board with this name already exists'),
  });
};

/**
 * Infer TypeScript type from schema
 */
export type BoardFormValues = Yup.InferType<typeof boardSchema>;
