/**
 * Google Drive sync metadata
 * Stored as a single record with id='sync'
 */
export interface GoogleDriveSync {
  id: string; // Always 'sync'
  lastSyncAt?: Date;
  lastSyncFileId?: string; // Google Drive file ID
  autoSyncEnabled: boolean;
  syncSettings: SyncSettings;
}

/**
 * Sync configuration settings
 */
export interface SyncSettings {
  syncInterval?: 'manual' | 'daily' | 'weekly';
  encryptionEnabled?: boolean;
  includeWorkouts?: boolean;
  includeFoodDiary?: boolean;
  includeFavorites?: boolean;
  lastBackupSize?: number; // bytes
}

/**
 * Default sync settings
 */
export const DEFAULT_GOOGLE_DRIVE_SYNC: GoogleDriveSync = {
  id: 'sync',
  autoSyncEnabled: false,
  syncSettings: {
    syncInterval: 'manual',
    encryptionEnabled: true,
    includeWorkouts: true,
    includeFoodDiary: true,
    includeFavorites: true,
  },
};
