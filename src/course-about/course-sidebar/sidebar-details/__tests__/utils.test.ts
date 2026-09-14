import { mockCourseAboutResponse } from '@src/__mocks__';
import { getSidebarDetails } from '../utils';
import { SIDEBAR_DETAIL_KEYS } from '../constants';
import messages from '../messages';

describe('getSidebarDetails', () => {
  const mockIntl = {
    formatMessage: jest.fn((message) => message.defaultMessage),
    formatDate: jest.fn(),
    formatNumber: jest.fn((value) => value.toLocaleString('en')),
  } as any;

  beforeEach(() => {
    mockIntl.formatDate.mockClear();
    mockIntl.formatNumber.mockClear();
  });

  const createCourseData = (overrides = {}) => ({
    ...mockCourseAboutResponse,
    ...overrides,
  });

  const getDetailByKey = (result, key) => result.find(detail => detail.key === key);

  beforeEach(() => jest.clearAllMocks());

  it('returns all sidebar details with correct structure', () => {
    mockIntl.formatDate.mockReturnValue('Jan 15, 2024');

    const courseData = createCourseData({
      effort: '5-10 hours per week',
      start: '2024-01-15T00:00:00Z',
      end: '2024-06-15T00:00:00Z',
      startDateIsStillDefault: false,
      duration: '6 weeks',
    });

    const result = getSidebarDetails(mockIntl, courseData);

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({
      key: SIDEBAR_DETAIL_KEYS.START_DATE,
      icon: expect.any(Function),
      label: messages.releaseDate.defaultMessage,
      value: expect.any(String),
      show: true,
    });
  });

  it('handles start date when startDateIsStillDefault is false', () => {
    const formattedDate = 'Jan 15, 2024';
    mockIntl.formatDate.mockReturnValue(formattedDate);

    const courseData = createCourseData({
      start: '2024-01-15T00:00:00Z',
      startDateIsStillDefault: false,
    });

    const result = getSidebarDetails(mockIntl, courseData);
    const startDateDetail = getDetailByKey(result, SIDEBAR_DETAIL_KEYS.START_DATE);

    expect(startDateDetail?.show).toBe(true);
    // formatDate will format according to locale, so we check it contains expected parts
    expect(startDateDetail?.value).toMatch(/Jan.*15.*2024/);
  });

  it('handles start date when startDateIsStillDefault is true', () => {
    const courseData = createCourseData({
      start: '2024-01-15T00:00:00Z',
      startDateIsStillDefault: true,
    });

    const result = getSidebarDetails(mockIntl, courseData);
    const startDateDetail = getDetailByKey(result, SIDEBAR_DETAIL_KEYS.START_DATE);

    expect(startDateDetail?.show).toBe(false);
  });

  it('uses advertisedStart when start is not available', () => {
    const formattedDate = 'Feb 1, 2024';
    mockIntl.formatDate.mockReturnValue(formattedDate);

    const courseData = createCourseData({
      start: null,
      advertisedStart: '2024-02-01T00:00:00Z',
      startDateIsStillDefault: false,
    });

    const result = getSidebarDetails(mockIntl, courseData);
    const startDateDetail = getDetailByKey(result, SIDEBAR_DETAIL_KEYS.START_DATE);

    expect(startDateDetail?.show).toBe(true);
    expect(startDateDetail?.value).toMatch(/Feb.*1.*2024/);
  });

  it('handles end date when provided', () => {
    const formattedDate = 'Jun 15, 2024';
    mockIntl.formatDate.mockReturnValue(formattedDate);

    const courseData = createCourseData({
      end: '2024-06-15T00:00:00Z',
    });

    const result = getSidebarDetails(mockIntl, courseData);
    const endDateDetail = getDetailByKey(result, SIDEBAR_DETAIL_KEYS.END_DATE);

    expect(endDateDetail?.show).toBe(true);
    expect(endDateDetail?.value).toMatch(/Jun.*15.*2024/);
  });

  it('handles end date when not provided', () => {
    const courseData = createCourseData({ end: null });

    const result = getSidebarDetails(mockIntl, courseData);
    const endDateDetail = getDetailByKey(result, SIDEBAR_DETAIL_KEYS.END_DATE);

    expect(endDateDetail?.show).toBe(false);
  });

  it('handles effort when provided', () => {
    const courseData = createCourseData({
      effort: '3-5 hours per week',
    });

    const result = getSidebarDetails(mockIntl, courseData);
    const effortDetail = getDetailByKey(result, SIDEBAR_DETAIL_KEYS.EFFORT);

    expect(effortDetail?.show).toBe(true);
    expect(effortDetail?.value).toBe(courseData.effort);
  });

  it('handles effort when not provided', () => {
    const courseData = createCourseData({ effort: null });

    const result = getSidebarDetails(mockIntl, courseData);
    const effortDetail = getDetailByKey(result, SIDEBAR_DETAIL_KEYS.EFFORT);

    expect(effortDetail?.show).toBe(false);
  });

  it('formats a numeric effort value as hours per week', () => {
    const courseData = createCourseData({ effort: '3' });

    const result = getSidebarDetails(mockIntl, courseData);
    const effortDetail = getDetailByKey(result, SIDEBAR_DETAIL_KEYS.EFFORT);

    expect(effortDetail?.show).toBe(true);
    expect(mockIntl.formatMessage).toHaveBeenCalledWith(messages.estimatedEffortHours, { hours: 3 });
  });

  it('handles duration when provided', () => {
    const courseData = createCourseData({
      duration: '8 weeks',
    });

    const result = getSidebarDetails(mockIntl, courseData);
    const durationDetail = getDetailByKey(result, SIDEBAR_DETAIL_KEYS.DURATION);

    expect(durationDetail?.show).toBe(true);
    expect(durationDetail?.value).toBe(courseData.duration);
  });

  it('handles duration when not provided', () => {
    const courseData = createCourseData({ duration: null });

    const result = getSidebarDetails(mockIntl, courseData);
    const durationDetail = result.find(detail => detail.key === SIDEBAR_DETAIL_KEYS.DURATION);

    expect(durationDetail?.show).toBe(false);
  });

  it('handles empty string duration', () => {
    const courseData = createCourseData({ duration: '' });

    const result = getSidebarDetails(mockIntl, courseData);
    const durationDetail = result.find(detail => detail.key === SIDEBAR_DETAIL_KEYS.DURATION);

    expect(durationDetail?.show).toBe(false);
  });

  it('shows students enrolled count, locale-formatted', () => {
    const courseData = createCourseData({ enrolledStudentsCount: 12345 });

    const result = getSidebarDetails(mockIntl, courseData);
    const enrolledDetail = getDetailByKey(result, SIDEBAR_DETAIL_KEYS.STUDENTS_ENROLLED);

    expect(enrolledDetail?.show).toBe(true);
    expect(mockIntl.formatNumber).toHaveBeenCalledWith(12345);
    expect(enrolledDetail?.value).toBe('12,345');
  });

  it('shows a students enrolled count of zero', () => {
    const courseData = createCourseData({ enrolledStudentsCount: 0 });

    const result = getSidebarDetails(mockIntl, courseData);
    const enrolledDetail = getDetailByKey(result, SIDEBAR_DETAIL_KEYS.STUDENTS_ENROLLED);

    expect(enrolledDetail?.show).toBe(true);
    expect(enrolledDetail?.value).toBe('0');
  });

  it('returns correct icons for each detail type', () => {
    const courseData = createCourseData();
    const result = getSidebarDetails(mockIntl, courseData);

    result.forEach((detail) => {
      expect(detail.icon).toBeDefined();
    });
  });

  it('handles edge case with all null values', () => {
    const courseData = createCourseData({
      effort: null,
      start: null,
      end: null,
      startDateIsStillDefault: true,
      duration: null,
    });

    const result = getSidebarDetails(mockIntl, courseData);
    const get = (key: string) => getDetailByKey(result, key);

    expect(get(SIDEBAR_DETAIL_KEYS.START_DATE)?.show).toBe(false);
    expect(get(SIDEBAR_DETAIL_KEYS.END_DATE)?.show).toBe(false);
    expect(get(SIDEBAR_DETAIL_KEYS.EFFORT)?.show).toBe(false);
    expect(get(SIDEBAR_DETAIL_KEYS.DURATION)?.show).toBe(false);
  });

  it('handles empty string dates', () => {
    const formattedDate = 'Invalid Date';
    mockIntl.formatDate.mockReturnValue(formattedDate);

    const courseData = createCourseData({
      start: '',
      end: '',
      startDateIsStillDefault: false,
    });

    const result = getSidebarDetails(mockIntl, courseData);
    const get = (key: string) => getDetailByKey(result, key);

    expect(get(SIDEBAR_DETAIL_KEYS.START_DATE)?.show).toBe(true);
    expect(get(SIDEBAR_DETAIL_KEYS.START_DATE)?.value).toBe('Invalid Date');
    expect(get(SIDEBAR_DETAIL_KEYS.END_DATE)?.show).toBe(false);
  });

  it('handles undefined values gracefully', () => {
    const courseData = createCourseData({
      effort: undefined,
      duration: undefined,
    });

    const result = getSidebarDetails(mockIntl, courseData);
    const get = (key: string) => getDetailByKey(result, key);

    expect(get(SIDEBAR_DETAIL_KEYS.EFFORT)?.show).toBe(false);
    expect(get(SIDEBAR_DETAIL_KEYS.DURATION)?.show).toBe(false);
  });
});
