const KEBAB_CASE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/** Returns an error message for an invalid app name, or null when it is valid. */
export function validateName(name: string): string | null {
  if (name === '') return 'Enter a name.';
  if (name.length < 3 || name.length > 30) return 'Use 3 to 30 characters.';
  if (!KEBAB_CASE.test(name)) {
    return 'Use lowercase letters, digits and single dashes, starting with a letter.';
  }
  return null;
}
