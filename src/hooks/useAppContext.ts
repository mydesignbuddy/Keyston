/**
 * Custom Hooks
 *
 * This file exports all custom hooks from the context for convenient importing.
 * Hooks can be imported individually or as a group.
 *
 * @example
 * ```typescript
 * import { useApp, useCurrentDate, useDailyGoals } from './hooks/useAppContext';
 *
 * function MyComponent() {
 *   const [currentDate, setCurrentDate] = useCurrentDate();
 *   const [goals, updateGoals] = useDailyGoals();
 *   // ...
 * }
 * ```
 */

export { useApp, useCurrentDate, useDailyGoals, useTheme, useLoading } from '../context/AppContext';
