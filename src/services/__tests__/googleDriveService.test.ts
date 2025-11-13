import { GoogleDriveService } from '../googleDriveService';
import { GoogleAuth } from '@southdevs/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

// Mock Capacitor modules
jest.mock('@southdevs/capacitor-google-auth', () => ({
  GoogleAuth: {
    initialize: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    refresh: jest.fn(),
  },
}));

jest.mock('@capacitor/core', () => ({
  Capacitor: {
    isPluginAvailable: jest.fn(),
    getPlatform: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('GoogleDriveService', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
    familyName: 'User',
    givenName: 'Test',
    imageUrl: 'https://example.com/avatar.jpg',
    authentication: {
      accessToken: 'mock-access-token',
      idToken: 'mock-id-token',
      refreshToken: 'mock-refresh-token',
    },
  };

  const mockAuthentication = {
    accessToken: 'refreshed-access-token',
    idToken: 'refreshed-id-token',
    refreshToken: 'refreshed-refresh-token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('isAvailable', () => {
    it('should return true when GoogleAuth plugin is available', () => {
      (Capacitor.isPluginAvailable as jest.Mock).mockReturnValue(true);

      const result = GoogleDriveService.isAvailable();

      expect(result).toBe(true);
      expect(Capacitor.isPluginAvailable).toHaveBeenCalledWith('GoogleAuth');
    });

    it('should return false when GoogleAuth plugin is not available', () => {
      (Capacitor.isPluginAvailable as jest.Mock).mockReturnValue(false);

      const result = GoogleDriveService.isAvailable();

      expect(result).toBe(false);
    });
  });

  describe('initialize', () => {
    it('should initialize on web platform', async () => {
      (Capacitor.getPlatform as jest.Mock).mockReturnValue('web');
      (GoogleAuth.initialize as jest.Mock).mockResolvedValue({});

      await GoogleDriveService.initialize('test-client-id');

      expect(GoogleAuth.initialize).toHaveBeenCalledWith({
        clientId: 'test-client-id',
        scopes: [
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/drive.appdata',
        ],
        grantOfflineAccess: true,
      });
    });

    it('should not initialize on native platforms', async () => {
      (Capacitor.getPlatform as jest.Mock).mockReturnValue('ios');

      await GoogleDriveService.initialize('test-client-id');

      expect(GoogleAuth.initialize).not.toHaveBeenCalled();
    });

    it('should throw error when initialization fails', async () => {
      (Capacitor.getPlatform as jest.Mock).mockReturnValue('web');
      (GoogleAuth.initialize as jest.Mock).mockRejectedValue(
        new Error('Init error')
      );

      await expect(
        GoogleDriveService.initialize('test-client-id')
      ).rejects.toThrow('Failed to initialize Google authentication');
    });
  });

  describe('signIn', () => {
    it('should sign in and store current user', async () => {
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);

      const result = await GoogleDriveService.signIn();

      expect(result).toEqual(mockUser);
      expect(GoogleAuth.signIn).toHaveBeenCalledWith({
        scopes: [
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/drive.appdata',
        ],
      });
      expect(GoogleDriveService.getCurrentUser()).toEqual(mockUser);
    });

    it('should throw error when sign in fails', async () => {
      (GoogleAuth.signIn as jest.Mock).mockRejectedValue(
        new Error('Sign in error')
      );

      await expect(GoogleDriveService.signIn()).rejects.toThrow(
        'Failed to authenticate with Google'
      );
    });
  });

  describe('signOut', () => {
    it('should sign out and clear current user', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.signOut as jest.Mock).mockResolvedValue({});

      await GoogleDriveService.signOut();

      expect(GoogleAuth.signOut).toHaveBeenCalled();
      expect(GoogleDriveService.getCurrentUser()).toBeNull();
    });

    it('should throw error when sign out fails', async () => {
      (GoogleAuth.signOut as jest.Mock).mockRejectedValue(
        new Error('Sign out error')
      );

      await expect(GoogleDriveService.signOut()).rejects.toThrow(
        'Failed to sign out from Google'
      );
    });
  });

  describe('refresh', () => {
    it('should refresh authentication token', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const result = await GoogleDriveService.refresh();

      expect(result).toEqual(mockAuthentication);
      expect(GoogleAuth.refresh).toHaveBeenCalled();
    });

    it('should throw error when refresh fails', async () => {
      (GoogleAuth.refresh as jest.Mock).mockRejectedValue(new Error('Refresh error'));

      await expect(GoogleDriveService.refresh()).rejects.toThrow(
        'Failed to refresh authentication'
      );
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', async () => {
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      expect(GoogleDriveService.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', async () => {
      (GoogleAuth.signOut as jest.Mock).mockResolvedValue({});
      await GoogleDriveService.signOut();

      expect(GoogleDriveService.isAuthenticated()).toBe(false);
    });
  });

  describe('getAccessToken', () => {
    it('should return access token after refreshing', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const token = await GoogleDriveService.getAccessToken();

      expect(token).toBe('refreshed-access-token');
      expect(GoogleAuth.refresh).toHaveBeenCalled();
    });

    it('should throw error when user is not authenticated', async () => {
      (GoogleAuth.signOut as jest.Mock).mockResolvedValue({});
      await GoogleDriveService.signOut();

      await expect(GoogleDriveService.getAccessToken()).rejects.toThrow(
        'Failed to get access token'
      );
    });

    it('should throw error when no access token available', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue({});

      await expect(GoogleDriveService.getAccessToken()).rejects.toThrow(
        'Failed to get access token'
      );
    });
  });

  describe('uploadFile', () => {
    it('should upload a file to Google Drive', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'file123' }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const fileId = await GoogleDriveService.uploadFile(
        'backup.json',
        '{"data": "test"}'
      );

      expect(fileId).toBe('file123');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer refreshed-access-token',
          }),
        })
      );
    });

    it('should throw error when upload fails', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const mockResponse = {
        ok: false,
        statusText: 'Upload failed',
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(
        GoogleDriveService.uploadFile('backup.json', '{"data": "test"}')
      ).rejects.toThrow('Failed to upload file to Google Drive');
    });
  });

  describe('downloadFile', () => {
    it('should download a file from Google Drive', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue('{"data": "test"}'),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const content = await GoogleDriveService.downloadFile('file123');

      expect(content).toBe('{"data": "test"}');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.googleapis.com/drive/v3/files/file123?alt=media',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer refreshed-access-token',
          }),
        })
      );
    });

    it('should throw error when download fails', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const mockResponse = {
        ok: false,
        statusText: 'Not found',
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(GoogleDriveService.downloadFile('file123')).rejects.toThrow(
        'Failed to download file from Google Drive'
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file from Google Drive', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const mockResponse = {
        ok: true,
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await GoogleDriveService.deleteFile('file123');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.googleapis.com/drive/v3/files/file123',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            Authorization: 'Bearer refreshed-access-token',
          }),
        })
      );
    });

    it('should not throw error when file not found (404)', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const mockResponse = {
        ok: false,
        status: 404,
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(GoogleDriveService.deleteFile('file123')).resolves.not.toThrow();
    });

    it('should throw error when delete fails with non-404 error', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Server error',
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(GoogleDriveService.deleteFile('file123')).rejects.toThrow(
        'Failed to delete file from Google Drive'
      );
    });
  });

  describe('listFiles', () => {
    it('should list files from Google Drive', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const mockFiles = [
        { id: 'file1', name: 'backup1.json', modifiedTime: '2024-01-01' },
        { id: 'file2', name: 'backup2.json', modifiedTime: '2024-01-02' },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ files: mockFiles }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const files = await GoogleDriveService.listFiles();

      expect(files).toEqual(mockFiles);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,modifiedTime)',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer refreshed-access-token',
          }),
        })
      );
    });

    it('should return empty array when no files found', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const files = await GoogleDriveService.listFiles();

      expect(files).toEqual([]);
    });
  });

  describe('findFileByName', () => {
    it('should find a file by name', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const mockFiles = [
        { id: 'file1', name: 'backup1.json', modifiedTime: '2024-01-01' },
        { id: 'file2', name: 'backup2.json', modifiedTime: '2024-01-02' },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ files: mockFiles }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const fileId = await GoogleDriveService.findFileByName('backup2.json');

      expect(fileId).toBe('file2');
    });

    it('should return null when file not found', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ files: [] }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const fileId = await GoogleDriveService.findFileByName('nonexistent.json');

      expect(fileId).toBeNull();
    });
  });

  describe('saveFile', () => {
    it('should save a new file when no existing file ID provided', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'newfile123' }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const fileId = await GoogleDriveService.saveFile(
        'backup.json',
        '{"data": "test"}'
      );

      expect(fileId).toBe('newfile123');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should delete old file and create new one when existing file ID provided', async () => {
      // Sign in first
      (GoogleAuth.signIn as jest.Mock).mockResolvedValue(mockUser);
      await GoogleDriveService.signIn();

      (GoogleAuth.refresh as jest.Mock).mockResolvedValue(mockAuthentication);

      const deleteResponse = { ok: true };
      const uploadResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'newfile456' }),
      };
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(deleteResponse)
        .mockResolvedValueOnce(uploadResponse);

      const fileId = await GoogleDriveService.saveFile(
        'backup.json',
        '{"data": "test"}',
        'oldfile123'
      );

      expect(fileId).toBe('newfile456');
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
