import type { Academy, Fact, SourceRef } from '../types';
import { SRC, URLS } from './sources';

const fact = <T>(value: T | null, ref: SourceRef): Fact<T> => ({ value, ...ref });
const unknown = <T = string>(note?: string): Fact<T> => fact<T>(null, SRC.none(note));

/**
 * Четыре ведомственных вуза МВД РК.
 * Каждое утверждение несёт источник и статус проверки. Пустое значение (null)
 * отображается в интерфейсе как «Нет подтверждённых данных».
 */
export const academies: Academy[] = [
  {
    id: 'almaty',
    title: 'Алматинская академия МВД РК имени М. Есбулатова',
    shortTitle: 'Алматинская академия',
    nameNote:
      'На официальном сайте встречаются два написания: «Есбулатова» (англоязычная версия и текст главной страницы) и «Есболатова» (заголовок русской версии).',
    nameRef: SRC.almatySite(),
    city: 'Алматы',
    website: URLS.almatyHome,
    address: fact('г. Алматы, Бостандыкский район, ул. Утепова, 29', SRC.almatySite()),
    founded: fact('1956', SRC.almatySite('На сайте: «Наследие и инновации с 1956 года»')),
    history: fact(
      'Первое ведомственное учебное заведение страны. По данным сайта академии, прошла путь от школы милиции до научно-образовательного центра; ведёт историю с 1956 года.',
      SRC.almatySite(),
    ),
    directions: fact(
      [
        'Правоохранительная деятельность',
        'IT-криминалистическое обеспечение',
        'Противодействие киберпреступности',
        'Информационно-техническое обеспечение',
      ],
      SRC.almatyEducation('Коды программ на странице не указаны'),
    ),
    studyConditions: fact(
      'Бесплатное обучение по госзаказу. Обучение приравнивается к срочной службе. Спортивные залы и секции.',
      SRC.almatyApplicants(),
    ),
    dormitory: fact('Общежитие для курсантов (на сайте: «Комфортабельное общежитие»)', SRC.almatyApplicants()),
    meals: fact('Питание предоставляется (на сайте: «Ежемесячная стипендия и питание»)', SRC.almatyApplicants()),
    stipend: fact('Ежемесячная стипендия', SRC.almatyApplicants()),
    employment: fact('На сайте академии указано: «100% трудоустройство после выпуска»', SRC.almatyApplicants()),
    contacts: [
      { label: 'Телефон', value: '+7 (727) 337-68-50', kind: 'phone', ref: SRC.almatySite() },
      { label: 'Сайт', value: 'alpolac.edu.kz', kind: 'web', ref: SRC.almatySite() },
    ],
  },
  {
    id: 'karaganda',
    title: 'Карагандинская академия МВД РК имени Б. Бейсенова',
    shortTitle: 'Карагандинская академия',
    nameNote: 'Полное имя в подвале сайта: «Карагандинская академия МВД РК имени Баримбека Бейсенова».',
    nameRef: SRC.karagandaSite(),
    city: 'Караганда',
    website: URLS.karagandaHome,
    address: fact('г. Караганда, ул. Ермекова, 124', SRC.karagandaSite()),
    founded: unknown('Год основания на проверенных страницах не найден'),
    history: unknown('Раздел истории на сайте опубликован на казахском языке; краткое изложение не сверено'),
    directions: fact(
      ['Правоохранительная деятельность (6В12301)', 'Противодействие киберпреступности (6В12303)'],
      SRC.karagandaPrograms('Бакалавриат, по таблице образовательных программ (стр. обновлена 27.01.2026)'),
    ),
    studyConditions: fact(
      'Обучение ведётся на государственном и русском языках. Квалификация бакалавриата — бакалавр национальной безопасности и военного дела.',
      SRC.karagandaPrograms(),
    ),
    dormitory: fact(
      'На сайте есть раздел «Общежитие обучающихся». Условия проживания в нём не сверены.',
      { ...SRC.karagandaSite(), sourceUrl: URLS.karagandaDorm },
    ),
    meals: unknown(),
    stipend: unknown(),
    employment: unknown(),
    contacts: [
      { label: 'Приёмная комиссия', value: '+7 (7212) 30-33-64', kind: 'phone', ref: SRC.karagandaSite() },
      { label: 'Телефон', value: '+7 (7212) 30-34-05', kind: 'phone', ref: SRC.karagandaSite() },
      { label: 'Телефон', value: '+7 (7212) 30-34-04', kind: 'phone', ref: SRC.karagandaSite() },
      { label: 'Email', value: 'academy@kpa.edu.kz', kind: 'email', ref: SRC.karagandaSite() },
      { label: 'Сайт', value: 'kpa.edu.kz', kind: 'web', ref: SRC.karagandaSite() },
    ],
  },
  {
    id: 'kostanay',
    title: 'Костанайская академия МВД РК имени Ш. Кабылбаева',
    shortTitle: 'Костанайская академия',
    nameNote: 'Полное имя: «Костанайская академия МВД Республики Казахстан имени Шракбека Кабылбаева».',
    nameRef: SRC.kostanayLegacy(),
    city: 'Костанай',
    website: URLS.kostanayHome,
    address: fact('110005, г. Костанай, пр. Абая, 11', SRC.kostanayLegacy()),
    founded: unknown('Официального подтверждения года основания не найдено'),
    history: unknown(),
    directions: fact(
      [
        'Правоохранительная деятельность (6B12301)',
        'Противодействие киберпреступности (6В12306)',
        'Педагогика и психология в деятельности органов внутренних дел (6В12305)',
      ],
      SRC.kostanayUnverified(
        'Список указан в ТЗ со ссылкой на qpa.edu.kz. Сайт закрыт для автоматической проверки — сверьте вручную.',
      ),
    ),
    studyConditions: fact(
      'Зачисление и обучение на основании государственного заказа. Обеспечение вещевым довольствием. Оплачивается проезд к месту постоянного проживания и обратно в период каникулярных отпусков (междугородний автомобильный, кроме такси, железнодорожный и водный транспорт).',
      SRC.kostanayEgov('Год применимости на странице не указан'),
    ),
    dormitory: fact('Проживание в благоустроенном общежитии', SRC.kostanayEgov('Год применимости не указан')),
    meals: fact('Обеспечение питанием', SRC.kostanayEgov('Год применимости не указан')),
    stipend: fact('Получение стипендии', SRC.kostanayEgov('Год применимости не указан')),
    employment: unknown(),
    contacts: [{ label: 'Сайт', value: 'qpa.edu.kz', kind: 'web', ref: SRC.kostanayUnverified('Официальный сайт академии') }],
  },
  {
    id: 'aktobe',
    title: 'Актюбинский юридический институт МВД РК имени М. Букенбаева',
    shortTitle: 'Актюбинский юридический институт',
    nameNote: 'Полное имя на сайте: «Актюбинский юридический институт МВД Республики Казахстан им. Малкеджара Букенбаева».',
    nameRef: SRC.aktobeApplicants(),
    city: 'Актобе',
    website: URLS.aktobeHome,
    address: fact('030011, г. Актобе, 41-разъезд, Курсантское шоссе, 1', SRC.aktobeContacts()),
    founded: unknown(),
    history: unknown(),
    directions: fact(
      ['Правоохранительная деятельность', 'Административно-правовая деятельность'],
      SRC.mvdUnverified('Страница МВД не открылась при автоматической проверке — названия требуют сверки'),
    ),
    studyConditions: unknown(),
    dormitory: unknown(),
    meals: unknown(),
    stipend: unknown(),
    employment: unknown(),
    contacts: [
      { label: 'Тел./факс', value: '8 (7132) 74-31-75', kind: 'phone', ref: SRC.aktobeContacts() },
      { label: 'Email', value: 'mail@auimvd.edu.kz', kind: 'email', ref: SRC.aktobeContacts() },
      { label: 'Для абитуриентов', value: '8 (7132) 73-05-21', kind: 'phone', ref: SRC.aktobeApplicants() },
      { label: 'Email для абитуриентов', value: 'auimvdrk@mail.kz', kind: 'email', ref: SRC.aktobeApplicants() },
      { label: 'Сайт', value: 'auimvd.edu.kz', kind: 'web', ref: SRC.aktobeContacts() },
    ],
  },
];
