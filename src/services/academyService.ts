import { academies } from '../data/academies';
import { specialties } from '../data/specialties';
import type { Academy, AcademyId, Specialty } from '../types';

/**
 * Access to the school and program catalogs. Currently static data from /data;
 * swapping in a CMS/API only requires changing these functions.
 */
export const academyService = {
  list: (): Academy[] => academies,
  get: (id: string | undefined): Academy | undefined => academies.find((a) => a.id === id),
  specialties: (academyId: AcademyId): Specialty[] => specialties.filter((s) => s.academyId === academyId),
  specialty: (id: string | undefined | null): Specialty | undefined => specialties.find((s) => s.id === id),
};
