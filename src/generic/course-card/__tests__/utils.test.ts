import { getConfig } from '@edx/frontend-platform';

import { mockCourseResponse } from '@src/__mocks__';
import { DATE_FORMAT_OPTIONS } from '@src/constants';
import { getFullImageUrl, getStartDateDisplay } from '../utils';

describe('course-card utils', () => {
  describe('getFullImageUrl', () => {
    it('returns empty string when path is undefined', () => {
      expect(getFullImageUrl(undefined)).toBe('');
    });

    it('returns empty string when path is null', () => {
      expect(getFullImageUrl(null as any)).toBe('');
    });

    it('returns empty string when path is empty string', () => {
      expect(getFullImageUrl('')).toBe('');
    });

    it('constructs full URL when path is provided', () => {
      const imagePath = mockCourseResponse.data.imageUrl;
      const expectedUrl = `${getConfig().LMS_BASE_URL}${imagePath}`;

      expect(getFullImageUrl(imagePath)).toBe(expectedUrl);
    });

    it('leaves an https URL untouched', () => {
      const url = 'https://cdn.example.com/partner/logos/edx.png';

      expect(getFullImageUrl(url)).toBe(url);
    });

    it('leaves an http URL untouched', () => {
      const url = 'http://lms.example.com/asset-v1:edX+DemoX+Demo_Course+type@asset+block@image.jpg';

      expect(getFullImageUrl(url)).toBe(url);
    });

    it('leaves a protocol-relative URL untouched', () => {
      const url = '//cdn.example.com/partner/logos/edx.png';

      expect(getFullImageUrl(url)).toBe(url);
    });
  });

  describe('getStartDateDisplay', () => {
    const mockIntl = {
      formatDate: jest.fn(),
    } as any;

    beforeEach(() => {
      mockIntl.formatDate.mockClear();
    });

    it('returns advertisedStart when available', () => {
      const courseDates = {
        advertisedStart: 'Spring 2024',
        start: '2024-04-01T00:00:00Z',
      };

      const result = getStartDateDisplay(courseDates, mockIntl);

      expect(result).toBe('Spring 2024');
      expect(mockIntl.formatDate).not.toHaveBeenCalled();
    });

    it('returns formatted start date when advertisedStart is not available', () => {
      const courseDates = {
        advertisedStart: undefined,
        start: '2024-04-01T00:00:00Z',
      };

      const formattedDate = 'Apr 1, 2024';
      mockIntl.formatDate.mockReturnValue(formattedDate);

      const result = getStartDateDisplay(courseDates, mockIntl);

      expect(result).toBe(formattedDate);
      expect(mockIntl.formatDate).toHaveBeenCalledWith(
        new Date('2024-04-01T00:00:00Z'),
        DATE_FORMAT_OPTIONS,
      );
    });

    it('returns formatted start date when advertisedStart is empty string', () => {
      const courseDates = {
        advertisedStart: '',
        start: '2024-06-15T10:30:00Z',
      };

      const formattedDate = 'Jun 15, 2024';
      mockIntl.formatDate.mockReturnValue(formattedDate);

      const result = getStartDateDisplay(courseDates, mockIntl);

      expect(result).toBe(formattedDate);
      expect(mockIntl.formatDate).toHaveBeenCalledWith(
        new Date('2024-06-15T10:30:00Z'),
        DATE_FORMAT_OPTIONS,
      );
    });

    it('returns empty string when both advertisedStart and start are not available', () => {
      const courseDates = {
        advertisedStart: undefined,
        start: '',
      };

      const result = getStartDateDisplay(courseDates, mockIntl);

      expect(result).toBe('');
      expect(mockIntl.formatDate).not.toHaveBeenCalled();
    });

    it('returns empty string when course is undefined', () => {
      const result = getStartDateDisplay(undefined as any, mockIntl);

      expect(result).toBe('');
      expect(mockIntl.formatDate).not.toHaveBeenCalled();
    });

    it('prioritizes advertisedStart over start date', () => {
      const courseDates = {
        advertisedStart: 'Fall 2024',
        start: '2024-09-01T00:00:00Z',
      };

      const result = getStartDateDisplay(courseDates, mockIntl);

      expect(result).toBe('Fall 2024');
      expect(mockIntl.formatDate).not.toHaveBeenCalled();
    });
  });
});
