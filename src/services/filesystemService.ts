import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

/**
 * Filesystem Service
 * Handles file operations for local storage
 * Privacy-first: All data stays on device
 */
export class FilesystemService {
  /**
   * Check if the Filesystem plugin is available
   */
  static isAvailable(): boolean {
    return Capacitor.isPluginAvailable('Filesystem');
  }

  /**
   * Request filesystem permissions (primarily for Android)
   * @returns Promise<boolean> - true if permissions granted
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const result = await Filesystem.requestPermissions();
      return result.publicStorage === 'granted';
    } catch (error) {
      console.error('Failed to request filesystem permissions:', error);
      // On iOS and web, permissions are automatically granted
      return true;
    }
  }

  /**
   * Check filesystem permissions status
   * @returns Promise<boolean> - true if permissions granted
   */
  static async checkPermissions(): Promise<boolean> {
    try {
      const result = await Filesystem.checkPermissions();
      return result.publicStorage === 'granted';
    } catch (error) {
      console.error('Failed to check filesystem permissions:', error);
      // On iOS and web, permissions are automatically granted
      return true;
    }
  }

  /**
   * Write a file to the filesystem
   * @param path - File path
   * @param data - Data to write
   * @param directory - Target directory (defaults to Data)
   * @param encoding - File encoding (defaults to UTF8)
   * @returns Promise<void>
   */
  static async writeFile(
    path: string,
    data: string,
    directory: Directory = Directory.Data,
    encoding: Encoding = Encoding.UTF8
  ): Promise<void> {
    try {
      await Filesystem.writeFile({
        path,
        data,
        directory,
        encoding,
      });
    } catch (error) {
      console.error('Failed to write file:', error);
      throw new Error(`Failed to write file: ${path}`);
    }
  }

  /**
   * Read a file from the filesystem
   * @param path - File path
   * @param directory - Target directory (defaults to Data)
   * @param encoding - File encoding (defaults to UTF8)
   * @returns Promise<string> - File contents
   */
  static async readFile(
    path: string,
    directory: Directory = Directory.Data,
    encoding: Encoding = Encoding.UTF8
  ): Promise<string> {
    try {
      const result = await Filesystem.readFile({
        path,
        directory,
        encoding,
      });
      return result.data as string;
    } catch (error) {
      console.error('Failed to read file:', error);
      throw new Error(`Failed to read file: ${path}`);
    }
  }

  /**
   * Delete a file from the filesystem
   * @param path - File path
   * @param directory - Target directory (defaults to Data)
   * @returns Promise<void>
   */
  static async deleteFile(path: string, directory: Directory = Directory.Data): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path,
        directory,
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw new Error(`Failed to delete file: ${path}`);
    }
  }

  /**
   * Check if a file exists
   * @param path - File path
   * @param directory - Target directory (defaults to Data)
   * @returns Promise<boolean> - true if file exists
   */
  static async fileExists(path: string, directory: Directory = Directory.Data): Promise<boolean> {
    try {
      await Filesystem.stat({
        path,
        directory,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Create a directory
   * @param path - Directory path
   * @param directory - Parent directory (defaults to Data)
   * @returns Promise<void>
   */
  static async createDirectory(path: string, directory: Directory = Directory.Data): Promise<void> {
    try {
      await Filesystem.mkdir({
        path,
        directory,
        recursive: true,
      });
    } catch (error) {
      console.error('Failed to create directory:', error);
      throw new Error(`Failed to create directory: ${path}`);
    }
  }

  /**
   * List files in a directory
   * @param path - Directory path
   * @param directory - Target directory (defaults to Data)
   * @returns Promise<string[]> - Array of file names
   */
  static async listFiles(path: string, directory: Directory = Directory.Data): Promise<string[]> {
    try {
      const result = await Filesystem.readdir({
        path,
        directory,
      });
      return result.files.map((file) => file.name);
    } catch (error) {
      console.error('Failed to list files:', error);
      throw new Error(`Failed to list files in: ${path}`);
    }
  }

  /**
   * Get file URI for native access
   * @param path - File path
   * @param directory - Target directory (defaults to Data)
   * @returns Promise<string> - File URI
   */
  static async getUri(path: string, directory: Directory = Directory.Data): Promise<string> {
    try {
      const result = await Filesystem.getUri({
        path,
        directory,
      });
      return result.uri;
    } catch (error) {
      console.error('Failed to get URI:', error);
      throw new Error(`Failed to get URI for: ${path}`);
    }
  }

  /**
   * Write JSON data to a file
   * Convenience method for saving JSON data
   * @param path - File path
   * @param data - Data object to save
   * @param directory - Target directory (defaults to Data)
   * @returns Promise<void>
   */
  static async writeJSON(
    path: string,
    data: unknown,
    directory: Directory = Directory.Data
  ): Promise<void> {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      await this.writeFile(path, jsonString, directory, Encoding.UTF8);
    } catch (error) {
      console.error('Failed to write JSON:', error);
      throw new Error(`Failed to write JSON to: ${path}`);
    }
  }

  /**
   * Read JSON data from a file
   * Convenience method for reading JSON data
   * @param path - File path
   * @param directory - Target directory (defaults to Data)
   * @returns Promise<T> - Parsed JSON data
   */
  static async readJSON<T>(path: string, directory: Directory = Directory.Data): Promise<T> {
    try {
      const jsonString = await this.readFile(path, directory, Encoding.UTF8);
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error('Failed to read JSON:', error);
      throw new Error(`Failed to read JSON from: ${path}`);
    }
  }
}
