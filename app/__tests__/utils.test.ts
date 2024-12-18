import {
  formatDate,
  getRelativeTime,
  truncateText,
  generateSlug,
  formatFileSize,
  isValidEmail,
  generateRandomString,
  getErrorMessage,
  safeJsonParse,
  wait,
  retry,
  deepMerge,
} from '../lib/utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const date = '2024-01-01T00:00:00Z';
      expect(formatDate(date)).toBe('January 1st, 2024');
    });

    it('formats Date object correctly', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      expect(formatDate(date)).toBe('January 1st, 2024');
    });
  });

  describe('truncateText', () => {
    it('truncates text when longer than specified length', () => {
      const text = 'This is a long text that needs to be truncated';
      expect(truncateText(text, 10)).toBe('This is a...');
    });

    it('returns original text when shorter than specified length', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe(text);
    });
  });

  describe('generateSlug', () => {
    it('converts text to URL-friendly slug', () => {
      expect(generateSlug('This is a Test Title!')).toBe('this-is-a-test-title');
    });

    it('handles special characters', () => {
      expect(generateSlug('Test & Demo @ 2024')).toBe('test-demo-2024');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500.0 B');
    });

    it('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
    });

    it('formats megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('invalidates incorrect email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('generateRandomString', () => {
    it('generates string of specified length', () => {
      const result = generateRandomString(10);
      expect(result.length).toBe(10);
    });

    it('generates different strings', () => {
      const str1 = generateRandomString(10);
      const str2 = generateRandomString(10);
      expect(str1).not.toBe(str2);
    });
  });

  describe('getErrorMessage', () => {
    it('extracts message from Error object', () => {
      const error = new Error('Test error');
      expect(getErrorMessage(error)).toBe('Test error');
    });

    it('handles string errors', () => {
      expect(getErrorMessage('Test error')).toBe('Test error');
    });

    it('handles unknown error types', () => {
      expect(getErrorMessage(null)).toBe('An unknown error occurred');
    });
  });

  describe('safeJsonParse', () => {
    it('parses valid JSON', () => {
      const json = '{"test": "value"}';
      expect(safeJsonParse(json, null)).toEqual({ test: 'value' });
    });

    it('returns fallback for invalid JSON', () => {
      const fallback = { default: true };
      expect(safeJsonParse('invalid json', fallback)).toBe(fallback);
    });
  });

  describe('wait', () => {
    it('waits for specified duration', async () => {
      const start = Date.now();
      await wait(100);
      const duration = Date.now() - start;
      expect(duration).toBeGreaterThanOrEqual(100);
    });
  });

  describe('retry', () => {
    it('retries failed operations', async () => {
      let attempts = 0;
      const fn = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 2) throw new Error('Test error');
        return 'success';
      });

      const result = await retry(fn, 3, 100);
      expect(result).toBe('success');
      expect(attempts).toBe(2);
    });

    it('throws after max attempts', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('Test error'));
      await expect(retry(fn, 3, 100)).rejects.toThrow('Test error');
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });

  describe('deepMerge', () => {
    it('merges objects deeply', () => {
      const target = {
        a: 1,
        b: { c: 2, d: 3 },
        e: [1, 2, 3],
      };
      const source = {
        b: { c: 4 },
        e: [4, 5],
      };
      const expected = {
        a: 1,
        b: { c: 4, d: 3 },
        e: [4, 5],
      };
      expect(deepMerge(target, source)).toEqual(expected);
    });

    it('handles null and undefined values', () => {
      const target = { a: 1, b: 2 };
      const source = { b: null, c: undefined };
      const expected = { a: 1, b: null, c: undefined };
      expect(deepMerge(target, source)).toEqual(expected);
    });
  });
});