import { describe, expect, it } from 'vitest';
import { validateBirthDate, validateEmail, validateName, validatePassword } from '../../src/utils/validation';

describe('validation rules', () => {
  it('accepts a normal email and rejects malformed or blank values', () => {
    expect(validateEmail(' Cadet@Example.com ')).toBeNull();
    expect(validateEmail('')).toBe('Enter your email');
    expect(validateEmail('cadet@example')).toBe('Enter a valid email address');
    expect(validateEmail('a b@example.com')).toBe('Enter a valid email address');
  });

  it('enforces password policy only in strict mode', () => {
    expect(validatePassword('')).toBe('Enter your password');
    expect(validatePassword('short1')).toBe('At least 8 characters');
    expect(validatePassword('letters only')).toBe('Use both letters and numbers');
    expect(validatePassword('cadet2026')).toBeNull();
    expect(validatePassword('abc', false)).toBeNull();
    expect(validatePassword('', false)).toBe('Enter your password');
  });

  it('allows letters, spaces, hyphens and apostrophes in names', () => {
    expect(validateName('Jean-Luc', 'Last name')).toBeNull();
    expect(validateName("O'Neill", 'Last name')).toBeNull();
    expect(validateName('A', 'Last name')).toBe('Too short');
    expect(validateName('Cadet123', 'Last name')).toBe('Letters, hyphens and spaces only');
    expect(validateName('', 'Middle name', false)).toBeNull();
  });

  it('rejects impossible and future birth dates', () => {
    expect(validateBirthDate('')).toBe('Enter your date of birth');
    expect(validateBirthDate('not-a-date')).toBe('Invalid date');
    expect(validateBirthDate('2999-01-01')).toBe('Date cannot be in the future');
    expect(validateBirthDate('1900-01-01')).toBe('Check the year of birth');
  });

  it('accepts an age typical of an applicant', () => {
    const elevenYearsAgo = new Date(Date.now() - 11 * 365.25 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 10);
    expect(validateBirthDate(elevenYearsAgo)).toBe('Check the year of birth');
    const seventeenYearsAgo = new Date(Date.now() - 17 * 365.25 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 10);
    expect(validateBirthDate(seventeenYearsAgo)).toBeNull();
  });
});
