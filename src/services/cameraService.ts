import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

/**
 * Camera Service
 * Handles camera operations including photo capture and barcode scanning
 * Privacy-first: All processing happens on-device
 */
export class CameraService {
  /**
   * Check if the camera is available on this platform
   */
  static isAvailable(): boolean {
    return Capacitor.isPluginAvailable('Camera');
  }

  /**
   * Request camera permissions
   * @returns Promise<boolean> - true if permissions granted
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const result = await Camera.requestPermissions();
      return result.camera === 'granted';
    } catch (error) {
      console.error('Failed to request camera permissions:', error);
      return false;
    }
  }

  /**
   * Check camera permissions status
   * @returns Promise<boolean> - true if permissions granted
   */
  static async checkPermissions(): Promise<boolean> {
    try {
      const result = await Camera.checkPermissions();
      return result.camera === 'granted';
    } catch (error) {
      console.error('Failed to check camera permissions:', error);
      return false;
    }
  }

  /**
   * Take a photo using the camera
   * @param options - Optional camera configuration
   * @returns Promise<Photo> - The captured photo
   */
  static async takePhoto(options?: {
    quality?: number;
    allowEditing?: boolean;
    resultType?: CameraResultType;
    source?: CameraSource;
  }): Promise<Photo> {
    try {
      // Request permissions if not already granted
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          throw new Error('Camera permission denied');
        }
      }

      const photo = await Camera.getPhoto({
        quality: options?.quality ?? 90,
        allowEditing: options?.allowEditing ?? false,
        resultType: options?.resultType ?? CameraResultType.Uri,
        source: options?.source ?? CameraSource.Camera,
      });

      return photo;
    } catch (error) {
      console.error('Failed to take photo:', error);
      throw new Error('Failed to capture photo');
    }
  }

  /**
   * Pick a photo from the device gallery
   * @param options - Optional camera configuration
   * @returns Promise<Photo> - The selected photo
   */
  static async pickPhoto(options?: { quality?: number; allowEditing?: boolean }): Promise<Photo> {
    try {
      const photo = await Camera.getPhoto({
        quality: options?.quality ?? 90,
        allowEditing: options?.allowEditing ?? false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      return photo;
    } catch (error) {
      console.error('Failed to pick photo:', error);
      throw new Error('Failed to select photo');
    }
  }

  /**
   * Take a photo for barcode scanning
   * Returns high-quality photo optimized for barcode detection
   * @returns Promise<Photo> - The captured photo
   */
  static async takePhotoForBarcode(): Promise<Photo> {
    return this.takePhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });
  }
}
