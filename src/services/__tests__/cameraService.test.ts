import { CameraService } from '../cameraService';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

// Mock Capacitor modules
jest.mock('@capacitor/camera', () => ({
  Camera: {
    requestPermissions: jest.fn(),
    checkPermissions: jest.fn(),
    getPhoto: jest.fn(),
  },
  CameraResultType: {
    Uri: 'uri',
    Base64: 'base64',
  },
  CameraSource: {
    Camera: 'camera',
    Photos: 'photos',
  },
}));

jest.mock('@capacitor/core', () => ({
  Capacitor: {
    isPluginAvailable: jest.fn(),
  },
}));

describe('CameraService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isAvailable', () => {
    it('should return true when Camera plugin is available', () => {
      (Capacitor.isPluginAvailable as jest.Mock).mockReturnValue(true);

      const result = CameraService.isAvailable();

      expect(result).toBe(true);
      expect(Capacitor.isPluginAvailable).toHaveBeenCalledWith('Camera');
    });

    it('should return false when Camera plugin is not available', () => {
      (Capacitor.isPluginAvailable as jest.Mock).mockReturnValue(false);

      const result = CameraService.isAvailable();

      expect(result).toBe(false);
    });
  });

  describe('requestPermissions', () => {
    it('should return true when permissions are granted', async () => {
      (Camera.requestPermissions as jest.Mock).mockResolvedValue({
        camera: 'granted',
      });

      const result = await CameraService.requestPermissions();

      expect(result).toBe(true);
      expect(Camera.requestPermissions).toHaveBeenCalled();
    });

    it('should return false when permissions are denied', async () => {
      (Camera.requestPermissions as jest.Mock).mockResolvedValue({
        camera: 'denied',
      });

      const result = await CameraService.requestPermissions();

      expect(result).toBe(false);
    });

    it('should return false when request fails', async () => {
      (Camera.requestPermissions as jest.Mock).mockRejectedValue(
        new Error('Permission error')
      );

      const result = await CameraService.requestPermissions();

      expect(result).toBe(false);
    });
  });

  describe('checkPermissions', () => {
    it('should return true when permissions are granted', async () => {
      (Camera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: 'granted',
      });

      const result = await CameraService.checkPermissions();

      expect(result).toBe(true);
      expect(Camera.checkPermissions).toHaveBeenCalled();
    });

    it('should return false when permissions are not granted', async () => {
      (Camera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: 'denied',
      });

      const result = await CameraService.checkPermissions();

      expect(result).toBe(false);
    });

    it('should return false when check fails', async () => {
      (Camera.checkPermissions as jest.Mock).mockRejectedValue(
        new Error('Check error')
      );

      const result = await CameraService.checkPermissions();

      expect(result).toBe(false);
    });
  });

  describe('takePhoto', () => {
    const mockPhoto = {
      webPath: 'file:///path/to/photo.jpg',
      format: 'jpeg',
    };

    it('should take a photo with default options', async () => {
      (Camera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: 'granted',
      });
      (Camera.getPhoto as jest.Mock).mockResolvedValue(mockPhoto);

      const result = await CameraService.takePhoto();

      expect(result).toEqual(mockPhoto);
      expect(Camera.getPhoto).toHaveBeenCalledWith({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });
    });

    it('should take a photo with custom options', async () => {
      (Camera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: 'granted',
      });
      (Camera.getPhoto as jest.Mock).mockResolvedValue(mockPhoto);

      const result = await CameraService.takePhoto({
        quality: 100,
        allowEditing: true,
        resultType: CameraResultType.Base64,
      });

      expect(result).toEqual(mockPhoto);
      expect(Camera.getPhoto).toHaveBeenCalledWith({
        quality: 100,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
    });

    it('should request permissions if not granted', async () => {
      (Camera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: 'denied',
      });
      (Camera.requestPermissions as jest.Mock).mockResolvedValue({
        camera: 'granted',
      });
      (Camera.getPhoto as jest.Mock).mockResolvedValue(mockPhoto);

      const result = await CameraService.takePhoto();

      expect(result).toEqual(mockPhoto);
      expect(Camera.checkPermissions).toHaveBeenCalled();
      expect(Camera.requestPermissions).toHaveBeenCalled();
    });

    it('should throw error if permissions are denied', async () => {
      (Camera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: 'denied',
      });
      (Camera.requestPermissions as jest.Mock).mockResolvedValue({
        camera: 'denied',
      });

      await expect(CameraService.takePhoto()).rejects.toThrow(
        'Failed to capture photo'
      );
    });

    it('should throw error when photo capture fails', async () => {
      (Camera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: 'granted',
      });
      (Camera.getPhoto as jest.Mock).mockRejectedValue(new Error('Camera error'));

      await expect(CameraService.takePhoto()).rejects.toThrow(
        'Failed to capture photo'
      );
    });
  });

  describe('pickPhoto', () => {
    const mockPhoto = {
      webPath: 'file:///path/to/photo.jpg',
      format: 'jpeg',
    };

    it('should pick a photo from gallery with default options', async () => {
      (Camera.getPhoto as jest.Mock).mockResolvedValue(mockPhoto);

      const result = await CameraService.pickPhoto();

      expect(result).toEqual(mockPhoto);
      expect(Camera.getPhoto).toHaveBeenCalledWith({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });
    });

    it('should pick a photo with custom options', async () => {
      (Camera.getPhoto as jest.Mock).mockResolvedValue(mockPhoto);

      const result = await CameraService.pickPhoto({
        quality: 80,
        allowEditing: true,
      });

      expect(result).toEqual(mockPhoto);
      expect(Camera.getPhoto).toHaveBeenCalledWith({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });
    });

    it('should throw error when photo selection fails', async () => {
      (Camera.getPhoto as jest.Mock).mockRejectedValue(new Error('Gallery error'));

      await expect(CameraService.pickPhoto()).rejects.toThrow(
        'Failed to select photo'
      );
    });
  });

  describe('takePhotoForBarcode', () => {
    const mockPhoto = {
      base64String: 'base64encodeddata',
      format: 'jpeg',
    };

    it('should take a high-quality photo for barcode scanning', async () => {
      (Camera.checkPermissions as jest.Mock).mockResolvedValue({
        camera: 'granted',
      });
      (Camera.getPhoto as jest.Mock).mockResolvedValue(mockPhoto);

      const result = await CameraService.takePhotoForBarcode();

      expect(result).toEqual(mockPhoto);
      expect(Camera.getPhoto).toHaveBeenCalledWith({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
    });
  });
});
