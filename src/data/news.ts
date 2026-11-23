import type { NewsItem } from '../types';
import { CHECKED_AT, URLS } from './sources';

/** Только реальные публикации. Статью не копируем — только краткое содержание и ссылку. */
export const news: NewsItem[] = [
  {
    id: 'n-2026-07-23-sms',
    title: 'МВД предупредило о фейковых SMS о «зачислении» в вузы МВД',
    date: '2026-07-23',
    summary:
      'МВД сообщило, что SMS о зачислении абитуриентов — фейк. Система «Qyzmet police» такие SMS не рассылает; окончательные результаты будут доступны только в личном кабинете абитуриента после завершения всех этапов отбора.',
    publisher: 'МВД РК, через МИА «Казинформ»',
    source: 'МИА «Казинформ»',
    sourceUrl: URLS.kazinformFakeSms2026,
    checkedAt: CHECKED_AT,
    applicableYear: 2026,
    status: 'verified',
  },
  {
    id: 'n-2026-07-15-digital',
    title: 'Приём в вузы МВД стал полностью цифровым: с 15 июля — сдача физических нормативов',
    date: '2026-07-15',
    summary:
      'Приёмная кампания в ведомственные вузы впервые полностью проходит через Qyzmet-Police.kz: документы и результаты ВВК отражаются в системе. Нормативы сдаются в территориальных департаментах полиции с видеозаписью и трансляцией. По данным МВД, на 1250 мест претендуют около 4 тысяч кандидатов.',
    publisher: 'МВД РК (Polisia.kz)',
    source: 'Polisia.kz — медиапортал МВД РК',
    sourceUrl: URLS.polisiaDigital2026,
    secondaryUrl: URLS.kazinformDigital2026,
    checkedAt: CHECKED_AT,
    applicableYear: 2026,
    status: 'verified',
  },
  {
    id: 'n-2025-11-07-qyzmet',
    title: 'МВД запустило цифровую платформу Qyzmet-Police.kz',
    date: '2025-11-07',
    summary:
      'Платформа позволяет подать заявку на службу в полицию онлайн, без очередей и бумажных документов. Вакансии всех регионов собраны на одном ресурсе.',
    publisher: 'МВД РК (Polisia.kz)',
    source: 'Polisia.kz — медиапортал МВД РК',
    sourceUrl: URLS.polisiaQyzmet2025,
    checkedAt: CHECKED_AT,
    applicableYear: 2025,
    status: 'archive',
  },
];
