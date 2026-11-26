import type { UserState } from '../../src/types';
import { emptyUserState } from '../../src/services/profileService';

export const makeState = (overrides: Partial<UserState> = {}): UserState => ({
  ...emptyUserState(),
  ...overrides,
});
