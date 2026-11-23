import type { SourceRef } from '../types';

/** Дата последней ручной сверки данных с официальными источниками */
export const CHECKED_AT = '2026-09-27';

export const URLS = {
  mvdPage: 'https://www.gov.kz/memleket/entities/police/activities/10766?lang=ru',
  almatyHome: 'https://alpolac.edu.kz/ru/almatinskaya-akademiya-mvd-rk/',
  almatyApplicants: 'https://alpolac.edu.kz/ru/postupayushhim/',
  almatyEducation: 'https://alpolac.edu.kz/ru/obrazovanie/',
  almatyContacts: 'https://alpolac.edu.kz/ru/kontakty/',
  almatyEn: 'https://alpolac.edu.kz/en/',
  karagandaHome: 'https://kpa.edu.kz/',
  karagandaPrograms: 'https://kpa.edu.kz/bilim-beru-baghdarlamalary-2/',
  karagandaDorm: 'https://kpa.edu.kz/obshhezhitie-kursantov-kz/',
  kostanayHome: 'https://qpa.edu.kz/',
  kostanayLegacy: 'https://kostacademy.edu.kz/vakansii_rus/',
  kostanayEgov: 'https://egov.kz/cms/ru/articles/university_degree/akadem_shknb',
  aktobeHome: 'https://auimvd.edu.kz/',
  aktobeApplicants: 'https://auimvd.edu.kz/ru/enrollee/',
  aktobeContacts: 'https://auimvd.edu.kz/en/contacts/',
  polisiaDigital2026:
    'https://polisia.kz/ru/priem-v-vuzy-mvd-stal-polnost-yu-tsifrovym-s-15-iyulya-startuet-etap-sdachi-fizicheskih-normativov/',
  kazinformDigital2026: 'https://www.inform.kz/ru/priem-vvuzi-mvd-kazahstana-stal-polnostyu-tsifrovim-84f2fa3c',
  kazinformFakeSms2026:
    'https://www.inform.kz/ru/abiturientov-predupredili-o-feykovih-sms-o-zachislenii-v-uchebnie-zavedeniya-mvd-327f8e31',
  polisiaQyzmet2025:
    'https://polisia.kz/ru/mvd-rk-zapustilo-tsifrovuyu-platformu-qyzmet-police-kz-dlya-onlajn-postupleniya-na-sluzhbu-v-politsiyu/',
  qyzmetPolice: 'https://qyzmet-police.kz',
} as const;

const ref = (
  source: string,
  sourceUrl: string,
  status: SourceRef['status'],
  applicableYear: number | null,
  note?: string,
): SourceRef => ({ source, sourceUrl, checkedAt: CHECKED_AT, applicableYear, status, note });

export const SRC = {
  almatySite: (note?: string) =>
    ref('Официальный сайт Алматинской академии МВД РК', URLS.almatyHome, 'verified', 2026, note),
  almatyApplicants: (note?: string) =>
    ref('Алматинская академия МВД РК — «Поступающим»', URLS.almatyApplicants, 'verified', 2026, note),
  almatyEducation: (note?: string) =>
    ref('Алматинская академия МВД РК — «Образование»', URLS.almatyEducation, 'verified', 2026, note),
  karagandaSite: (note?: string) =>
    ref('Официальный сайт Карагандинской академии МВД РК', URLS.karagandaHome, 'verified', 2026, note),
  karagandaPrograms: (note?: string) =>
    ref('Карагандинская академия МВД РК — «Образовательные программы»', URLS.karagandaPrograms, 'verified', 2026, note),
  kostanayLegacy: (note?: string) =>
    ref('Официальный сайт Костанайской академии МВД РК (kostacademy.edu.kz)', URLS.kostanayLegacy, 'verified', null, note),
  kostanayEgov: (note?: string) =>
    ref('Портал электронного правительства eGov.kz', URLS.kostanayEgov, 'verified', null, note),
  kostanayUnverified: (note?: string) =>
    ref('Официальный сайт Костанайской академии МВД РК', URLS.kostanayHome, 'needs_review', 2026, note),
  aktobeApplicants: (note?: string) =>
    ref('Актюбинский юридический институт МВД РК — «Абитуриентам»', URLS.aktobeApplicants, 'verified', null, note),
  aktobeContacts: (note?: string) =>
    ref('Актюбинский юридический институт МВД РК — «Контакты»', URLS.aktobeContacts, 'verified', null, note),
  mvdUnverified: (note?: string) =>
    ref('МВД РК — страница «Ведомственные учебные заведения»', URLS.mvdPage, 'needs_review', 2026, note),
  mvd2026Digital: (note?: string) =>
    ref('МВД РК (Polisia.kz), через МИА «Казинформ»', URLS.polisiaDigital2026, 'verified', 2026, note),
  userArchive2025: (note?: string) =>
    ref(
      'Список 2025 года, предоставленный заказчиком (официальный документ не приложен)',
      URLS.mvdPage,
      'archive',
      2025,
      note,
    ),
  none: (note = 'Официальный источник не найден') => ref('Нет подтверждённого источника', '', 'needs_review', null, note),
};
