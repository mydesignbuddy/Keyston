/**
 * Workout entry - a logged workout session
 */
export interface WorkoutEntry {
  id: string; // UUID
  presetId?: string; // Optional reference to WorkoutPresets
  workoutDate: string; // ISO date string (YYYY-MM-DD)
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  durationMinutes?: number;
  workoutType: WorkoutType;
  notes?: string;
  createdAt: Date;
}

/**
 * Workout type classification
 */
export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'sports' | 'other';

/**
 * Exercise within a workout
 */
export interface WorkoutExercise {
  id: string; // UUID
  workoutEntryId: string; // Reference to WorkoutEntries
  exerciseName: string;
  category: ExerciseCategory;
  sets?: number;
  reps?: number;
  weightKg?: number;
  durationSeconds?: number; // For cardio or timed exercises
  notes?: string;
  orderIndex: number; // Order within the workout
}

/**
 * Exercise category
 */
export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'cardio'
  | 'other';
