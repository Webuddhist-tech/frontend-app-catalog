import { getConfig } from '@edx/frontend-platform';
import { IntlShape } from '@edx/frontend-platform/i18n';

import { DATE_FORMAT_OPTIONS } from './constants';

/**
 * Resolves a URL by combining it with a base URL if it's relative.
 * If the URL is null or absolute (starts with http:// or https://), it is returned as is.
 */
export const resolveUrl = (base: string, url: string) => ((url == null || url.startsWith('http://') || url.startsWith('https://')) ? url : `${base}${url}`);

/**
 * Creates a full URL by combining the LMS base URL with a relative path.
 */
export const baseAppUrl = (url: string) => resolveUrl(getConfig().LMS_BASE_URL, url);

/**
 * Gets the URL for the programs dashboard page.
 */
export const programsUrl = () => baseAppUrl('/dashboard/programs');

/**
 * Retrieves the value of a specific cookie by its name.
 */
export const getCookie = (name: string): string | null => {
  let cookieValue: string | null = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

/**
 * Formats a date string into a localized date format using React Intl.
 */
export const formatDate = (dateString: string, intl: IntlShape): string => {
  const date = new Date(dateString);
  return intl.formatDate(date, DATE_FORMAT_OPTIONS);
};

// Tibetan Unicode block (U+0F00-U+0FFF) — the same range the brand font
// stack keys its Jomolhari fallback off of (see _overrides.scss).
const TIBETAN_SCRIPT_PATTERN = /[\u0F00-\u0FFF]/;

/**
 * Returns whether the given text contains any Tibetan-script characters.
 *
 * Jomolhari (the font Tibetan text falls through to) stacks consonants and
 * vowel signs well above/below a normal line, needing more line-height than
 * Latin text does — this is how a heading knows to give Tibetan text that
 * extra room without also loosening the spacing around Latin text. Shared
 * rather than living next to one heading's own styling: the homepage
 * greeting and the course-about page's title both need it.
 */
export const containsTibetanScript = (text: string): boolean => TIBETAN_SCRIPT_PATTERN.test(text);
