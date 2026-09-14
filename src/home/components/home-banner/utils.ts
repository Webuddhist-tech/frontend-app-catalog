import type { AuthenticatedUserTypes } from '@src/header/types';

// Tibetan Unicode block (U+0F00-U+0FFF) — the same range the brand font
// stack keys its Jomolhari fallback off of (see _overrides.scss).
const TIBETAN_SCRIPT_PATTERN = /[\u0F00-\u0FFF]/;

/**
 * Returns whether the given text contains any Tibetan-script characters.
 *
 * Jomolhari (the font Tibetan text falls through to) stacks consonants and
 * vowel signs well above/below a normal line, needing more line-height than
 * Latin text does — this is how the heading knows to give a Tibetan name
 * that extra room without also loosening the spacing under an English one.
 */
export const containsTibetanScript = (text: string): boolean => TIBETAN_SCRIPT_PATTERN.test(text);

/**
 * Returns the name to greet a signed-in user by: the capitalised first word of
 * their full name, or their username if there's no name.
 *
 * The platform only stores one full name, no separate given name, so a
 * two-word given name (e.g. "maria jesus") gets clipped to its first word.
 */
export const getGreetingName = (
  user: Pick<AuthenticatedUserTypes, 'name' | 'username'>,
): string => {
  const [firstWord] = (user.name ?? '').split(/\s+/).filter(Boolean);
  const greeting = firstWord || user.username;

  // Only capitalises the first letter — lodash's `capitalize` also lowercases
  // the rest, which would turn "JP" into "Jp".
  return greeting.charAt(0).toUpperCase() + greeting.slice(1);
};
