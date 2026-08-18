import { getGreetingName } from './utils';

describe('home-banner utils', () => {
  describe('getGreetingName', () => {
    const greet = (name: string | null) => getGreetingName({ name, username: 'a_username' });

    it('returns the first word of a two-word name', () => {
      expect(greet('lionel messi')).toBe('Lionel');
    });

    it('returns the first word of a name with several words', () => {
      expect(greet('Adriana Moreira Longueira')).toBe('Adriana');
    });

    it('returns a single-word name unchanged apart from its capital', () => {
      expect(greet('tenkal')).toBe('Tenkal');
    });

    it('handles a name padded with whitespace', () => {
      expect(greet('  padma Dorje  ')).toBe('Padma');
    });

    it('handles a name separated by more than one space', () => {
      expect(greet('eglantine  Trouslard')).toBe('Eglantine');
    });

    it('leaves the rest of an all-caps name alone', () => {
      // Lowercasing the remainder would render "JP" as "Jp".
      expect(greet('JP Morgan')).toBe('JP');
    });

    it('returns a name written without spaces whole', () => {
      // CJK names carry no word separator, so there is no first word to take,
      // and no case to raise either.
      expect(greet('許俊賢')).toBe('許俊賢');
    });

    it('returns a Tibetan name written without spaces whole', () => {
      expect(greet('སངས་རྒྱས་རྒྱལ།')).toBe('སངས་རྒྱས་རྒྱལ།');
    });

    it('falls back to the username when the name is empty', () => {
      expect(greet('')).toBe('A_username');
    });

    it('falls back to the username when the name is only whitespace', () => {
      expect(greet('   ')).toBe('A_username');
    });

    it('falls back to the username when the name is null', () => {
      // Service accounts have no profile, so the LMS sends a null name claim.
      expect(greet(null)).toBe('A_username');
    });

    it('falls back to the username when the name is missing entirely', () => {
      // A token minted without the `profile` scope carries no name claim at all.
      expect(getGreetingName({ username: 'a_username' })).toBe('A_username');
    });
  });
});
