import { hasVisibleHtmlContent } from '../utils';

describe('hasVisibleHtmlContent', () => {
  it('returns false for null, undefined, and empty string', () => {
    expect(hasVisibleHtmlContent(null)).toBe(false);
    expect(hasVisibleHtmlContent(undefined)).toBe(false);
    expect(hasVisibleHtmlContent('')).toBe(false);
  });

  it('returns false for whitespace-only markup a rich-text editor saves for an empty field', () => {
    expect(hasVisibleHtmlContent('<p></p>')).toBe(false);
    expect(hasVisibleHtmlContent('<p><br></p>')).toBe(false);
    expect(hasVisibleHtmlContent('<div>   </div>')).toBe(false);
    expect(hasVisibleHtmlContent('<p>&nbsp;</p>')).toBe(false);
  });

  it('returns true when there is real text', () => {
    expect(hasVisibleHtmlContent('<p>Hello</p>')).toBe(true);
    expect(hasVisibleHtmlContent('Plain text, no tags')).toBe(true);
  });

  it('returns true for a purely decorative embed with no text', () => {
    expect(hasVisibleHtmlContent('<img src="x.png" alt="">')).toBe(true);
    expect(hasVisibleHtmlContent('<iframe src="https://example.com"></iframe>')).toBe(true);
  });
});
