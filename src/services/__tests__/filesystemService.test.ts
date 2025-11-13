import { FilesystemService } from '../filesystemService';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

// Mock Capacitor modules
jest.mock('@capacitor/filesystem', () => ({
  Filesystem: {
    requestPermissions: jest.fn(),
    checkPermissions: jest.fn(),
    writeFile: jest.fn(),
    readFile: jest.fn(),
    deleteFile: jest.fn(),
    stat: jest.fn(),
    mkdir: jest.fn(),
    readdir: jest.fn(),
    getUri: jest.fn(),
  },
  Directory: {
    Data: 'DATA',
    Documents: 'DOCUMENTS',
  },
  Encoding: {
    UTF8: 'utf8',
  },
}));

jest.mock('@capacitor/core', () => ({
  Capacitor: {
    isPluginAvailable: jest.fn(),
  },
}));

describe('FilesystemService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isAvailable', () => {
    it('should return true when Filesystem plugin is available', () => {
      (Capacitor.isPluginAvailable as jest.Mock).mockReturnValue(true);

      const result = FilesystemService.isAvailable();

      expect(result).toBe(true);
      expect(Capacitor.isPluginAvailable).toHaveBeenCalledWith('Filesystem');
    });

    it('should return false when Filesystem plugin is not available', () => {
      (Capacitor.isPluginAvailable as jest.Mock).mockReturnValue(false);

      const result = FilesystemService.isAvailable();

      expect(result).toBe(false);
    });
  });

  describe('requestPermissions', () => {
    it('should return true when permissions are granted', async () => {
      (Filesystem.requestPermissions as jest.Mock).mockResolvedValue({
        publicStorage: 'granted',
      });

      const result = await FilesystemService.requestPermissions();

      expect(result).toBe(true);
      expect(Filesystem.requestPermissions).toHaveBeenCalled();
    });

    it('should return true on platforms with automatic permissions', async () => {
      (Filesystem.requestPermissions as jest.Mock).mockRejectedValue(
        new Error('Not supported')
      );

      const result = await FilesystemService.requestPermissions();

      expect(result).toBe(true);
    });
  });

  describe('checkPermissions', () => {
    it('should return true when permissions are granted', async () => {
      (Filesystem.checkPermissions as jest.Mock).mockResolvedValue({
        publicStorage: 'granted',
      });

      const result = await FilesystemService.checkPermissions();

      expect(result).toBe(true);
      expect(Filesystem.checkPermissions).toHaveBeenCalled();
    });

    it('should return true on platforms with automatic permissions', async () => {
      (Filesystem.checkPermissions as jest.Mock).mockRejectedValue(
        new Error('Not supported')
      );

      const result = await FilesystemService.checkPermissions();

      expect(result).toBe(true);
    });
  });

  describe('writeFile', () => {
    it('should write a file with default parameters', async () => {
      (Filesystem.writeFile as jest.Mock).mockResolvedValue({});

      await FilesystemService.writeFile('test.txt', 'Hello World');

      expect(Filesystem.writeFile).toHaveBeenCalledWith({
        path: 'test.txt',
        data: 'Hello World',
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
    });

    it('should write a file with custom directory and encoding', async () => {
      (Filesystem.writeFile as jest.Mock).mockResolvedValue({});

      await FilesystemService.writeFile(
        'test.txt',
        'Hello World',
        Directory.Documents,
        Encoding.UTF8
      );

      expect(Filesystem.writeFile).toHaveBeenCalledWith({
        path: 'test.txt',
        data: 'Hello World',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    });

    it('should throw error when write fails', async () => {
      (Filesystem.writeFile as jest.Mock).mockRejectedValue(
        new Error('Write error')
      );

      await expect(
        FilesystemService.writeFile('test.txt', 'Hello World')
      ).rejects.toThrow('Failed to write file: test.txt');
    });
  });

  describe('readFile', () => {
    it('should read a file with default parameters', async () => {
      (Filesystem.readFile as jest.Mock).mockResolvedValue({
        data: 'Hello World',
      });

      const result = await FilesystemService.readFile('test.txt');

      expect(result).toBe('Hello World');
      expect(Filesystem.readFile).toHaveBeenCalledWith({
        path: 'test.txt',
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
    });

    it('should read a file with custom directory and encoding', async () => {
      (Filesystem.readFile as jest.Mock).mockResolvedValue({
        data: 'Hello World',
      });

      const result = await FilesystemService.readFile(
        'test.txt',
        Directory.Documents,
        Encoding.UTF8
      );

      expect(result).toBe('Hello World');
      expect(Filesystem.readFile).toHaveBeenCalledWith({
        path: 'test.txt',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    });

    it('should throw error when read fails', async () => {
      (Filesystem.readFile as jest.Mock).mockRejectedValue(new Error('Read error'));

      await expect(FilesystemService.readFile('test.txt')).rejects.toThrow(
        'Failed to read file: test.txt'
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file with default directory', async () => {
      (Filesystem.deleteFile as jest.Mock).mockResolvedValue({});

      await FilesystemService.deleteFile('test.txt');

      expect(Filesystem.deleteFile).toHaveBeenCalledWith({
        path: 'test.txt',
        directory: Directory.Data,
      });
    });

    it('should delete a file with custom directory', async () => {
      (Filesystem.deleteFile as jest.Mock).mockResolvedValue({});

      await FilesystemService.deleteFile('test.txt', Directory.Documents);

      expect(Filesystem.deleteFile).toHaveBeenCalledWith({
        path: 'test.txt',
        directory: Directory.Documents,
      });
    });

    it('should throw error when delete fails', async () => {
      (Filesystem.deleteFile as jest.Mock).mockRejectedValue(
        new Error('Delete error')
      );

      await expect(FilesystemService.deleteFile('test.txt')).rejects.toThrow(
        'Failed to delete file: test.txt'
      );
    });
  });

  describe('fileExists', () => {
    it('should return true if file exists', async () => {
      (Filesystem.stat as jest.Mock).mockResolvedValue({});

      const result = await FilesystemService.fileExists('test.txt');

      expect(result).toBe(true);
      expect(Filesystem.stat).toHaveBeenCalledWith({
        path: 'test.txt',
        directory: Directory.Data,
      });
    });

    it('should return false if file does not exist', async () => {
      (Filesystem.stat as jest.Mock).mockRejectedValue(new Error('Not found'));

      const result = await FilesystemService.fileExists('test.txt');

      expect(result).toBe(false);
    });

    it('should check with custom directory', async () => {
      (Filesystem.stat as jest.Mock).mockResolvedValue({});

      await FilesystemService.fileExists('test.txt', Directory.Documents);

      expect(Filesystem.stat).toHaveBeenCalledWith({
        path: 'test.txt',
        directory: Directory.Documents,
      });
    });
  });

  describe('createDirectory', () => {
    it('should create a directory with default parent', async () => {
      (Filesystem.mkdir as jest.Mock).mockResolvedValue({});

      await FilesystemService.createDirectory('mydir');

      expect(Filesystem.mkdir).toHaveBeenCalledWith({
        path: 'mydir',
        directory: Directory.Data,
        recursive: true,
      });
    });

    it('should create a directory with custom parent', async () => {
      (Filesystem.mkdir as jest.Mock).mockResolvedValue({});

      await FilesystemService.createDirectory('mydir', Directory.Documents);

      expect(Filesystem.mkdir).toHaveBeenCalledWith({
        path: 'mydir',
        directory: Directory.Documents,
        recursive: true,
      });
    });

    it('should throw error when creation fails', async () => {
      (Filesystem.mkdir as jest.Mock).mockRejectedValue(new Error('Mkdir error'));

      await expect(FilesystemService.createDirectory('mydir')).rejects.toThrow(
        'Failed to create directory: mydir'
      );
    });
  });

  describe('listFiles', () => {
    it('should list files in a directory', async () => {
      (Filesystem.readdir as jest.Mock).mockResolvedValue({
        files: [{ name: 'file1.txt' }, { name: 'file2.txt' }],
      });

      const result = await FilesystemService.listFiles('mydir');

      expect(result).toEqual(['file1.txt', 'file2.txt']);
      expect(Filesystem.readdir).toHaveBeenCalledWith({
        path: 'mydir',
        directory: Directory.Data,
      });
    });

    it('should list files with custom directory', async () => {
      (Filesystem.readdir as jest.Mock).mockResolvedValue({
        files: [{ name: 'file1.txt' }],
      });

      await FilesystemService.listFiles('mydir', Directory.Documents);

      expect(Filesystem.readdir).toHaveBeenCalledWith({
        path: 'mydir',
        directory: Directory.Documents,
      });
    });

    it('should throw error when listing fails', async () => {
      (Filesystem.readdir as jest.Mock).mockRejectedValue(new Error('List error'));

      await expect(FilesystemService.listFiles('mydir')).rejects.toThrow(
        'Failed to list files in: mydir'
      );
    });
  });

  describe('getUri', () => {
    it('should get URI for a file', async () => {
      (Filesystem.getUri as jest.Mock).mockResolvedValue({
        uri: 'file:///data/test.txt',
      });

      const result = await FilesystemService.getUri('test.txt');

      expect(result).toBe('file:///data/test.txt');
      expect(Filesystem.getUri).toHaveBeenCalledWith({
        path: 'test.txt',
        directory: Directory.Data,
      });
    });

    it('should throw error when getting URI fails', async () => {
      (Filesystem.getUri as jest.Mock).mockRejectedValue(new Error('URI error'));

      await expect(FilesystemService.getUri('test.txt')).rejects.toThrow(
        'Failed to get URI for: test.txt'
      );
    });
  });

  describe('writeJSON', () => {
    it('should write JSON data to a file', async () => {
      (Filesystem.writeFile as jest.Mock).mockResolvedValue({});

      const data = { name: 'John', age: 30 };
      await FilesystemService.writeJSON('data.json', data);

      expect(Filesystem.writeFile).toHaveBeenCalledWith({
        path: 'data.json',
        data: JSON.stringify(data, null, 2),
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
    });

    it('should throw error when writing JSON fails', async () => {
      (Filesystem.writeFile as jest.Mock).mockRejectedValue(
        new Error('Write error')
      );

      await expect(
        FilesystemService.writeJSON('data.json', { test: true })
      ).rejects.toThrow('Failed to write JSON to: data.json');
    });
  });

  describe('readJSON', () => {
    it('should read and parse JSON data from a file', async () => {
      const data = { name: 'John', age: 30 };
      (Filesystem.readFile as jest.Mock).mockResolvedValue({
        data: JSON.stringify(data),
      });

      const result = await FilesystemService.readJSON('data.json');

      expect(result).toEqual(data);
      expect(Filesystem.readFile).toHaveBeenCalledWith({
        path: 'data.json',
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
    });

    it('should throw error when reading JSON fails', async () => {
      (Filesystem.readFile as jest.Mock).mockRejectedValue(new Error('Read error'));

      await expect(FilesystemService.readJSON('data.json')).rejects.toThrow(
        'Failed to read JSON from: data.json'
      );
    });

    it('should throw error when JSON parsing fails', async () => {
      (Filesystem.readFile as jest.Mock).mockResolvedValue({
        data: 'invalid json',
      });

      await expect(FilesystemService.readJSON('data.json')).rejects.toThrow(
        'Failed to read JSON from: data.json'
      );
    });
  });
});
