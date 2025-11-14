# Services

This directory contains services for the Keyston application.

## Capacitor Plugin Services

### CameraService

Handles camera operations including photo capture and barcode scanning with proper permission handling.

**Key Features:**

- Check plugin availability
- Request and check camera permissions
- Take photos with customizable options
- Pick photos from gallery
- Optimized barcode scanning mode

**Usage Example:**

```typescript
import { CameraService } from './services';

// Check if camera is available
if (CameraService.isAvailable()) {
  // Request permissions
  const hasPermission = await CameraService.requestPermissions();

  if (hasPermission) {
    // Take a photo
    const photo = await CameraService.takePhoto({
      quality: 90,
      allowEditing: false,
    });

    // Take photo for barcode scanning (high quality, base64)
    const barcodePhoto = await CameraService.takePhotoForBarcode();

    // Pick from gallery
    const selectedPhoto = await CameraService.pickPhoto();
  }
}
```

---

### FilesystemService

Handles file operations for local storage with JSON convenience methods.

**Key Features:**

- Check plugin availability
- Request and check filesystem permissions
- Read/write files with different encodings
- Check file existence
- Create directories
- List files in directories
- Get file URIs
- JSON convenience methods (read/write JSON objects)

**Usage Example:**

```typescript
import { FilesystemService } from './services';
import { Directory } from '@capacitor/filesystem';

// Write a text file
await FilesystemService.writeFile('notes.txt', 'Hello World');

// Read a text file
const content = await FilesystemService.readFile('notes.txt');

// Check if file exists
const exists = await FilesystemService.fileExists('notes.txt');

// Write JSON data
const userData = { name: 'John', age: 30 };
await FilesystemService.writeJSON('user.json', userData);

// Read JSON data
const data = await FilesystemService.readJSON<typeof userData>('user.json');

// Create directory
await FilesystemService.createDirectory('backups');

// List files
const files = await FilesystemService.listFiles('backups');

// Delete file
await FilesystemService.deleteFile('old-backup.json');

// Get file URI for native access
const uri = await FilesystemService.getUri('photo.jpg');
```

---

### GoogleDriveService

Handles Google authentication and Drive operations for encrypted backup.

**Key Features:**

- Google OAuth authentication
- Upload/download files to user's Google Drive
- List files in app data folder
- Delete files
- Find files by name
- Save/update files

**Privacy-First Architecture:**

- Uses only user's own Google Drive
- Limited scope: `drive.file` and `drive.appdata`
- No server-side storage
- User controls all data

**Usage Example:**

```typescript
import { GoogleDriveService } from './services';

// Initialize (required on web platform)
await GoogleDriveService.initialize('YOUR_CLIENT_ID');

// Sign in with Google
const user = await GoogleDriveService.signIn();

// Check if authenticated
if (GoogleDriveService.isAuthenticated()) {
  // Upload a backup file
  const backupData = JSON.stringify({
    foods: [...],
    workouts: [...]
  });

  const fileId = await GoogleDriveService.uploadFile(
    'keyston-backup.json',
    backupData,
    'application/json'
  );

  // List all backup files
  const files = await GoogleDriveService.listFiles();

  // Find a specific file
  const foundFileId = await GoogleDriveService.findFileByName('keyston-backup.json');

  // Download a backup
  if (foundFileId) {
    const content = await GoogleDriveService.downloadFile(foundFileId);
    const restoredData = JSON.parse(content);
  }

  // Update existing file (or create new)
  const newFileId = await GoogleDriveService.saveFile(
    'keyston-backup.json',
    backupData,
    foundFileId // optional, deletes old and creates new
  );

  // Delete a file
  await GoogleDriveService.deleteFile(fileId);

  // Sign out
  await GoogleDriveService.signOut();
}
```

**Configuration:**

For native platforms (iOS/Android), configure Google Sign-In in your Capacitor config:

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.buddytoups.keyston',
  appName: 'Keyston',
  webDir: 'build',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: 'YOUR_SERVER_CLIENT_ID.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
```

---

## Best Practices

### Permission Handling

Always check and request permissions before using native features:

```typescript
// Camera
const hasPermission = await CameraService.checkPermissions();
if (!hasPermission) {
  const granted = await CameraService.requestPermissions();
  if (!granted) {
    // Show error to user
    return;
  }
}

// Filesystem (primarily for Android)
const hasPermission = await FilesystemService.checkPermissions();
if (!hasPermission) {
  await FilesystemService.requestPermissions();
}
```

### Error Handling

All services throw descriptive errors. Always use try-catch:

```typescript
try {
  const photo = await CameraService.takePhoto();
} catch (error) {
  console.error('Failed to take photo:', error);
  // Show user-friendly error message
}
```

### Platform Detection

Check if plugins are available before using them:

```typescript
if (CameraService.isAvailable()) {
  // Use camera features
} else {
  // Fallback or show message
}
```

### Google Drive Backup Flow

Example of a complete backup/restore flow:

```typescript
import { GoogleDriveService, FilesystemService } from './services';
import { db } from './database';

async function backupToGoogleDrive() {
  try {
    // 1. Export all data from IndexedDB
    const allData = {
      foods: await db.foods.toArray(),
      foodDiary: await db.foodDiaryEntries.toArray(),
      workouts: await db.workoutEntries.toArray(),
      settings: await db.userSettings.get('settings'),
      timestamp: new Date().toISOString(),
    };

    // 2. Stringify data
    const backupContent = JSON.stringify(allData);

    // 3. Optional: Encrypt data here
    // const encryptedContent = encrypt(backupContent, userKey);

    // 4. Sign in if needed
    if (!GoogleDriveService.isAuthenticated()) {
      await GoogleDriveService.signIn();
    }

    // 5. Find existing backup file
    const existingFileId = await GoogleDriveService.findFileByName('keyston-backup.json');

    // 6. Upload/update backup
    const fileId = await GoogleDriveService.saveFile(
      'keyston-backup.json',
      backupContent,
      existingFileId
    );

    // 7. Update sync metadata
    await db.googleDriveSync.put({
      id: 'sync',
      lastSyncAt: new Date(),
      lastSyncFileId: fileId,
      autoSyncEnabled: true,
      syncSettings: {
        /* ... */
      },
    });

    return { success: true, fileId };
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
}

async function restoreFromGoogleDrive() {
  try {
    // 1. Sign in if needed
    if (!GoogleDriveService.isAuthenticated()) {
      await GoogleDriveService.signIn();
    }

    // 2. Find backup file
    const fileId = await GoogleDriveService.findFileByName('keyston-backup.json');
    if (!fileId) {
      throw new Error('No backup found');
    }

    // 3. Download backup
    const backupContent = await GoogleDriveService.downloadFile(fileId);

    // 4. Optional: Decrypt data here
    // const decryptedContent = decrypt(backupContent, userKey);

    // 5. Parse data
    const restoredData = JSON.parse(backupContent);

    // 6. Clear existing data (optional, or merge)
    await db.clearAllData();

    // 7. Restore data to IndexedDB
    if (restoredData.foods) {
      await db.foods.bulkPut(restoredData.foods);
    }
    if (restoredData.foodDiary) {
      await db.foodDiaryEntries.bulkPut(restoredData.foodDiary);
    }
    if (restoredData.workouts) {
      await db.workoutEntries.bulkPut(restoredData.workouts);
    }
    if (restoredData.settings) {
      await db.userSettings.put(restoredData.settings);
    }

    return { success: true, timestamp: restoredData.timestamp };
  } catch (error) {
    console.error('Restore failed:', error);
    throw error;
  }
}
```

---

## Testing

All services have comprehensive unit tests. Run tests with:

```bash
npm test
```

Run specific service tests:

```bash
npm test -- cameraService
npm test -- filesystemService
npm test -- googleDriveService
```

---

## Security Considerations

### Camera Service

- Always request permissions before accessing camera
- Handle permission denials gracefully
- Be mindful of photo storage and cleanup

### Filesystem Service

- Use appropriate directories (Data, Documents, etc.)
- Sanitize file paths to prevent directory traversal
- Handle file not found errors gracefully

### Google Drive Service

- Never store API keys in code (use environment variables)
- Use minimal scopes (`drive.file` and `drive.appdata`)
- Always sign out when backup/restore is complete
- Consider encrypting data before upload
- Handle network errors and auth token expiration
