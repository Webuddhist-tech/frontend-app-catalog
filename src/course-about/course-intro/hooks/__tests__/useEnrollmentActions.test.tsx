import { logError } from '@edx/frontend-platform/logging';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import { renderHook, act } from '@src/setupTest';
import { useEnrollment } from '@src/course-about/data/hooks';
import { mockCourseAboutResponse } from '@src/__mocks__';
import { useEnrollmentActions } from '../useEnrollmentActions';
import type { UseEnrollmentActionsTypes } from '../types';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@src/course-about/data/hooks', () => ({
  useEnrollment: jest.fn(),
}));

const renderHookWithWrapper = (props: UseEnrollmentActionsTypes) => renderHook(
  () => useEnrollmentActions(props),
  {
    wrapper: ({ children }) => (
      <IntlProvider locale="en" messages={{}}>
        {children}
      </IntlProvider>
    ),
  },
);

describe('useEnrollmentActions', () => {
  const mockEnrollAndRedirect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useEnrollment as jest.Mock).mockReturnValue(mockEnrollAndRedirect);
  });

  it('should initialize with default state', () => {
    const { result } = renderHookWithWrapper({
      courseId: mockCourseAboutResponse.id,
      ecommerceCheckoutLink: mockCourseAboutResponse.ecommerceCheckoutLink,
    });

    expect(result.current.enrollmentError).toBeNull();
    expect(result.current.isEnrollmentPending).toBe(false);
  });

  it('should handle successful enrollment', async () => {
    mockEnrollAndRedirect.mockResolvedValueOnce(undefined);
    const { result } = renderHookWithWrapper({
      courseId: mockCourseAboutResponse.id,
      ecommerceCheckoutLink: mockCourseAboutResponse.ecommerceCheckoutLink,
    });

    await act(async () => {
      await result.current.handleChangeEnrollment();
    });

    expect(mockEnrollAndRedirect).toHaveBeenCalledWith(
      mockCourseAboutResponse.id,
      `${getConfig().LMS_BASE_URL}/dashboard`,
    );
  });

  it('should handle enrollment error', async () => {
    const mockError = new Error('Enrollment failed');
    mockEnrollAndRedirect.mockRejectedValueOnce(mockError);
    const { result } = renderHookWithWrapper({
      courseId: mockCourseAboutResponse.id,
      ecommerceCheckoutLink: mockCourseAboutResponse.ecommerceCheckoutLink,
    });

    await act(async () => {
      await result.current.handleChangeEnrollment();
    });

    expect(logError).toHaveBeenCalledWith('Failed to enroll in course', mockError);
    expect(result.current.isEnrollmentPending).toBe(false);
  });

  it('should handle ecommerce checkout with valid link', () => {
    const { result } = renderHookWithWrapper({
      courseId: mockCourseAboutResponse.id,
      ecommerceCheckoutLink: mockCourseAboutResponse.ecommerceCheckoutLink,
    });

    const mockAssign = jest.fn();
    Object.defineProperty(window, 'location', {
      value: {
        assign: mockAssign,
        href: '',
      },
      configurable: true,
    });

    result.current.handleEcommerceCheckout();

    expect(mockAssign).toHaveBeenCalledWith(mockCourseAboutResponse.ecommerceCheckoutLink);
    expect(logError).not.toHaveBeenCalled();
  });

  it('resets a stuck pending flag when the page is restored from the back-forward cache', () => {
    // Mirrors the real redirect: the success path never itself flips
    // isEnrollmentPending back to false, it just navigates away.
    mockEnrollAndRedirect.mockReturnValue(new Promise(() => {}));
    const { result } = renderHookWithWrapper({
      courseId: mockCourseAboutResponse.id,
      ecommerceCheckoutLink: mockCourseAboutResponse.ecommerceCheckoutLink,
    });

    act(() => {
      result.current.handleChangeEnrollment();
    });
    expect(result.current.isEnrollmentPending).toBe(true);

    const pageShowEvent = new Event('pageshow');
    Object.defineProperty(pageShowEvent, 'persisted', { value: true });
    act(() => {
      window.dispatchEvent(pageShowEvent);
    });

    expect(result.current.isEnrollmentPending).toBe(false);
  });

  it('leaves a genuinely in-flight pending flag alone on an ordinary pageshow', () => {
    mockEnrollAndRedirect.mockReturnValue(new Promise(() => {}));
    const { result } = renderHookWithWrapper({
      courseId: mockCourseAboutResponse.id,
      ecommerceCheckoutLink: mockCourseAboutResponse.ecommerceCheckoutLink,
    });

    act(() => {
      result.current.handleChangeEnrollment();
    });
    expect(result.current.isEnrollmentPending).toBe(true);

    // A normal (non-bfcache) pageshow — persisted is false/undefined.
    act(() => {
      window.dispatchEvent(new Event('pageshow'));
    });

    expect(result.current.isEnrollmentPending).toBe(true);
  });

  it('should handle ecommerce checkout with missing link', () => {
    const { result } = renderHookWithWrapper({
      courseId: mockCourseAboutResponse.id,
      ecommerceCheckoutLink: undefined,
    });

    result.current.handleEcommerceCheckout();

    expect(logError).toHaveBeenCalledWith('Ecommerce checkout link is not available');
  });
});
