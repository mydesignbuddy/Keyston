import { WorkoutType, ExerciseCategory } from './WorkoutEntry';

/**
 * Workout preset - a saved workout template
 */
export interface WorkoutPreset {
  id: string; // UUID
  presetName: string;
  description?: string;
  workoutType: WorkoutType;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Exercise within a preset
 */
export interface PresetExercise {
  id: string; // UUID
  presetId: string; // Reference to WorkoutPresets
  exerciseName: string;
  category: ExerciseCategory;
  defaultSets?: number;
  defaultReps?: number;
  defaultWeightKg?: number;
  orderIndex: number; // Order within the preset
}
