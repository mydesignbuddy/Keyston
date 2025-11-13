import { GoogleAuth, User, Authentication } from '@southdevs/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

/**
 * Google Drive Service
 * Handles Google authentication and Drive operations for encrypted backup
 * Privacy-first: Only user-controlled, encrypted backups to user's own Drive
 */
export class GoogleDriveService {
  private static readonly SCOPES = [
    'https://www.googleapis.com/auth/drive.file', // Access only app-created files
    'https://www.googleapis.com/auth/drive.appdata', // Access app data folder
  ];

  private static currentUser: User | null = null;

  /**
   * Check if Google Auth is available
   */
  static isAvailable(): boolean {
    return Capacitor.isPluginAvailable('GoogleAuth');
  }

  /**
   * Initialize Google Auth
   * Must be called before any other operations
   * @param clientId - Google OAuth client ID for web
   */
  static async initialize(clientId: string): Promise<void> {
    try {
      // Initialize only on web platform
      // Native platforms (iOS/Android) use native configuration
      if (Capacitor.getPlatform() === 'web') {
        await GoogleAuth.initialize({
          clientId,
          scopes: this.SCOPES,
          grantOfflineAccess: true,
        });
      }
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
      throw new Error('Failed to initialize Google authentication');
    }
  }

  /**
   * Sign in with Google
   * @returns Promise<User> - Authenticated user
   */
  static async signIn(): Promise<User> {
    try {
      const user = await GoogleAuth.signIn({
        scopes: this.SCOPES,
      });
      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }

  /**
   * Sign out from Google
   */
  static async signOut(): Promise<void> {
    try {
      await GoogleAuth.signOut();
      this.currentUser = null;
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw new Error('Failed to sign out from Google');
    }
  }

  /**
   * Refresh authentication token
   * @returns Promise<Authentication> - Refreshed authentication details
   */
  static async refresh(): Promise<Authentication> {
    try {
      const authentication = await GoogleAuth.refresh();
      // Update current user's authentication
      if (this.currentUser) {
        this.currentUser.authentication = authentication;
      }
      return authentication;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw new Error('Failed to refresh authentication');
    }
  }

  /**
   * Get current authenticated user
   * @returns User | null
   */
  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  static isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Get access token for API calls
   * @returns Promise<string> - Access token
   */
  static async getAccessToken(): Promise<string> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      // Refresh token if needed
      const authentication = await this.refresh();

      if (!authentication?.accessToken) {
        throw new Error('No access token available');
      }

      return authentication.accessToken;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error('Failed to get access token');
    }
  }

  /**
   * Upload a file to Google Drive
   * @param fileName - Name of the file
   * @param content - File content (JSON string or encrypted data)
   * @param mimeType - MIME type of the file
   * @returns Promise<string> - File ID in Google Drive
   */
  static async uploadFile(
    fileName: string,
    content: string,
    mimeType = 'application/json'
  ): Promise<string> {
    try {
      const accessToken = await this.getAccessToken();

      // Create file metadata
      const metadata = {
        name: fileName,
        mimeType,
      };

      // Create multipart request body
      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${mimeType}\r\n\r\n` +
        content +
        closeDelimiter;

      // Upload to Google Drive
      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw new Error('Failed to upload file to Google Drive');
    }
  }

  /**
   * Download a file from Google Drive
   * @param fileId - Google Drive file ID
   * @returns Promise<string> - File content
   */
  static async downloadFile(fileId: string): Promise<string> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Failed to download file:', error);
      throw new Error('Failed to download file from Google Drive');
    }
  }

  /**
   * Delete a file from Google Drive
   * @param fileId - Google Drive file ID
   * @returns Promise<void>
   */
  static async deleteFile(fileId: string): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw new Error('Failed to delete file from Google Drive');
    }
  }

  /**
   * List files in the app's Drive folder
   * @returns Promise<Array<{id: string, name: string, modifiedTime: string}>>
   */
  static async listFiles(): Promise<Array<{ id: string; name: string; modifiedTime: string }>> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,modifiedTime)',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`List failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.files || [];
    } catch (error) {
      console.error('Failed to list files:', error);
      throw new Error('Failed to list files from Google Drive');
    }
  }

  /**
   * Find a file by name
   * @param fileName - Name of the file to find
   * @returns Promise<string | null> - File ID or null if not found
   */
  static async findFileByName(fileName: string): Promise<string | null> {
    try {
      const files = await this.listFiles();
      const file = files.find((f) => f.name === fileName);
      return file?.id || null;
    } catch (error) {
      console.error('Failed to find file:', error);
      return null;
    }
  }

  /**
   * Update an existing file or create a new one
   * @param fileName - Name of the file
   * @param content - File content
   * @param existingFileId - Optional existing file ID to update
   * @returns Promise<string> - File ID
   */
  static async saveFile(
    fileName: string,
    content: string,
    existingFileId?: string
  ): Promise<string> {
    try {
      // If file ID provided, delete old version and create new
      // (Google Drive API v3 doesn't support content update easily)
      if (existingFileId) {
        await this.deleteFile(existingFileId);
      }

      return await this.uploadFile(fileName, content);
    } catch (error) {
      console.error('Failed to save file:', error);
      throw new Error('Failed to save file to Google Drive');
    }
  }
}
