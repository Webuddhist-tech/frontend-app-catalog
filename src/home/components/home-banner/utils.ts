import type { AuthenticatedUserTypes } from '@src/header/types';

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
