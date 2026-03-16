/**
 * Yup Schema for Task validation
 * 
 * Used with Formik for client-side validation.
 */
import * as Yup from 'yup';
import { TaskPriority } from '@/domain/entities/types';

/**
 * Available priority options
 */
export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

/**
 * Base task schema with field validation
 */
export const taskSchema = Yup.object().shape({
  title: Yup.string()
    .required('Task title is required')
    .min(1, 'Title must be at least 1 character')
    .max(200, 'Title must be 200 characters or less'),
  description: Yup.string()
    .max(1000, 'Description must be 1000 characters or less')
    .default(''),
  priority: Yup.string()
    .oneOf(['Low', 'Medium', 'High'] as const, 'Invalid priority')
    .required('Priority is required')
    .default('Medium'),
});

/**
 * Initial values for task forms
 */
export const taskInitialValues = {
  title: '',
  description: '',
  priority: 'Medium' as TaskPriority,
};

/**
 * Infer TypeScript type from schema
 */
export type TaskFormValues = Yup.InferType<typeof taskSchema>;
