import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', {
        'conditional-class': true,
        'hidden': false,
      });
      expect(result).toContain('base-class');
      expect(result).toContain('conditional-class');
      expect(result).not.toContain('hidden');
    });

    it('should override conflicting Tailwind classes', () => {
      // The cn function uses tailwind-merge which should keep the last class
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base-class', undefined, null, 'other-class');
      expect(result).toContain('base-class');
      expect(result).toContain('other-class');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });
  });
});
