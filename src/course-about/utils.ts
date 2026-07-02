/**
 * Returns whether an HTML string has anything a visitor would actually see —
 * not just a non-empty string. Rich-text editors commonly save an "empty"
 * field as markup like `<p></p>` or `<p><br></p>` rather than an empty
 * string, so a plain `.trim().length > 0` check on the raw HTML still passes
 * and renders a heading/card around nothing visible.
 *
 * A purely decorative embed (image, iframe, video, audio, inline svg) counts
 * as content on its own, even with no text alongside it.
 */
export const hasVisibleHtmlContent = (html?: string | null): boolean => {
  if (!html) {
    return false;
  }

  if (/<(img|iframe|video|audio|svg)\b/i.test(html)) {
    return true;
  }

  const textOnly = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim();
  return textOnly.length > 0;
};
