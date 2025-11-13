import { db } from './database';
import { WorkoutEntry, WorkoutExercise } from '../models';

/**
 * Workout Service
 * Manages workout entries and exercises
 */
export class WorkoutService {
  /**
   * Add a new workout entry
   */
  static async addWorkout(workout: Omit<WorkoutEntry, 'id' | 'createdAt'>): Promise<WorkoutEntry> {
    try {
      const newWorkout: WorkoutEntry = {
        ...workout,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };

      await db.workoutEntries.add(newWorkout);
      return newWorkout;
    } catch (error) {
      console.error('Failed to add workout:', error);
      throw new Error('Failed to save workout');
    }
  }

  /**
   * Add workout with exercises in a single transaction
   */
  static async addWorkoutWithExercises(
    workout: Omit<WorkoutEntry, 'id' | 'createdAt'>,
    exercises: Omit<WorkoutExercise, 'id' | 'workoutEntryId'>[]
  ): Promise<{ workout: WorkoutEntry; exercises: WorkoutExercise[] }> {
    try {
      const workoutId = crypto.randomUUID();
      const newWorkout: WorkoutEntry = {
        ...workout,
        id: workoutId,
        createdAt: new Date(),
      };

      const newExercises: WorkoutExercise[] = exercises.map((ex, index) => ({
        ...ex,
        id: crypto.randomUUID(),
        workoutEntryId: workoutId,
        orderIndex: ex.orderIndex ?? index,
      }));

      await db.transaction('rw', [db.workoutEntries, db.workoutExercises], async () => {
        await db.workoutEntries.add(newWorkout);
        await db.workoutExercises.bulkAdd(newExercises);
      });

      return { workout: newWorkout, exercises: newExercises };
    } catch (error) {
      console.error('Failed to add workout with exercises:', error);
      throw new Error('Failed to save workout');
    }
  }

  /**
   * Get workout by ID
   */
  static async getWorkout(id: string): Promise<WorkoutEntry | undefined> {
    try {
      return await db.workoutEntries.get(id);
    } catch (error) {
      console.error('Failed to get workout:', error);
      throw new Error('Failed to load workout');
    }
  }

  /**
   * Get workouts for a specific date
   */
  static async getWorkoutsForDate(date: string): Promise<WorkoutEntry[]> {
    try {
      return await db.workoutEntries.where('workoutDate').equals(date).sortBy('createdAt');
    } catch (error) {
      console.error('Failed to get workouts for date:', error);
      throw new Error('Failed to load workouts');
    }
  }

  /**
   * Get workouts in date range
   */
  static async getWorkoutsInRange(startDate: string, endDate: string): Promise<WorkoutEntry[]> {
    try {
      return await db.workoutEntries
        .where('workoutDate')
        .between(startDate, endDate, true, true)
        .sortBy('createdAt');
    } catch (error) {
      console.error('Failed to get workouts in range:', error);
      throw new Error('Failed to load workouts');
    }
  }

  /**
   * Update workout entry
   */
  static async updateWorkout(
    id: string,
    updates: Partial<Omit<WorkoutEntry, 'id' | 'createdAt'>>
  ): Promise<WorkoutEntry> {
    try {
      const existingWorkout = await db.workoutEntries.get(id);
      if (!existingWorkout) {
        throw new Error('Workout not found');
      }

      const updatedWorkout: WorkoutEntry = {
        ...existingWorkout,
        ...updates,
      };

      await db.workoutEntries.put(updatedWorkout);
      return updatedWorkout;
    } catch (error) {
      console.error('Failed to update workout:', error);
      throw new Error('Failed to update workout');
    }
  }

  /**
   * Delete workout entry and all associated exercises
   */
  static async deleteWorkout(id: string): Promise<void> {
    try {
      await db.transaction('rw', [db.workoutEntries, db.workoutExercises], async () => {
        await db.workoutEntries.delete(id);
        await db.workoutExercises.where('workoutEntryId').equals(id).delete();
      });
    } catch (error) {
      console.error('Failed to delete workout:', error);
      throw new Error('Failed to delete workout');
    }
  }

  /**
   * Get exercises for a workout
   */
  static async getExercisesForWorkout(workoutId: string): Promise<WorkoutExercise[]> {
    try {
      return await db.workoutExercises
        .where('workoutEntryId')
        .equals(workoutId)
        .sortBy('orderIndex');
    } catch (error) {
      console.error('Failed to get exercises:', error);
      throw new Error('Failed to load exercises');
    }
  }

  /**
   * Add exercise to workout
   */
  static async addExercise(exercise: Omit<WorkoutExercise, 'id'>): Promise<WorkoutExercise> {
    try {
      const newExercise: WorkoutExercise = {
        ...exercise,
        id: crypto.randomUUID(),
      };

      await db.workoutExercises.add(newExercise);
      return newExercise;
    } catch (error) {
      console.error('Failed to add exercise:', error);
      throw new Error('Failed to save exercise');
    }
  }

  /**
   * Update exercise
   */
  static async updateExercise(
    id: string,
    updates: Partial<Omit<WorkoutExercise, 'id' | 'workoutEntryId'>>
  ): Promise<WorkoutExercise> {
    try {
      const existingExercise = await db.workoutExercises.get(id);
      if (!existingExercise) {
        throw new Error('Exercise not found');
      }

      const updatedExercise: WorkoutExercise = {
        ...existingExercise,
        ...updates,
      };

      await db.workoutExercises.put(updatedExercise);
      return updatedExercise;
    } catch (error) {
      console.error('Failed to update exercise:', error);
      throw new Error('Failed to update exercise');
    }
  }

  /**
   * Delete exercise
   */
  static async deleteExercise(id: string): Promise<void> {
    try {
      await db.workoutExercises.delete(id);
    } catch (error) {
      console.error('Failed to delete exercise:', error);
      throw new Error('Failed to delete exercise');
    }
  }

  /**
   * Get total workout count
   */
  static async getTotalCount(): Promise<number> {
    try {
      return await db.workoutEntries.count();
    } catch (error) {
      console.error('Failed to get workout count:', error);
      return 0;
    }
  }
}
