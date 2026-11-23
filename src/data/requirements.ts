import type { SourceRef } from '../types';
import { SRC } from './sources';

export interface RequirementFact extends SourceRef {
  id: string;
  title: string;
  text: string;
}

/** Общие этапы и требования, подтверждённые источниками */
export const admissionFacts: RequirementFact[] = [
  {
    id: 'req-digital',
    title: 'Подача через Qyzmet-Police.kz',
    text: 'В 2026 году приёмная кампания впервые полностью прошла в цифровом формате: документы подавались через систему, там же отражались результаты ВВК.',
    ...SRC.mvd2026Digital(),
  },
  {
    id: 'req-fitness-2026',
    title: 'Физическая подготовка — по месту жительства',
    text: 'С 15 июля 2026 года нормативы принимали территориальные департаменты полиции. После испытаний материалы кандидатов направляются в приёмную комиссию вуза.',
    ...SRC.mvd2026Digital(),
  },
  {
    id: 'req-competition',
    title: 'Конкурс',
    text: 'Приёмная комиссия учитывает результаты ЕНТ, наличие льгот и другие конкурсные показатели. При необходимости проводится видеособеседование.',
    ...SRC.mvd2026Digital(),
  },
  {
    id: 'req-ent',
    title: 'Пороговые баллы ЕНТ (Алматинская академия)',
    text: 'Не менее 50 баллов; не менее 3 баллов по грамотности чтения и математической грамотности, не менее 5 — по остальным предметам.',
    ...SRC.almatyApplicants('Указано на странице Алматинской академии; для других вузов сверяйте отдельно'),
  },
  {
    id: 'req-results',
    title: 'Результаты — только в личном кабинете',
    text: 'Окончательные результаты доступны в личном кабинете абитуриента в системе «Qyzmet police». SMS о зачислении система не рассылает.',
    source: 'МВД РК, через МИА «Казинформ»',
    sourceUrl:
      'https://www.inform.kz/ru/abiturientov-predupredili-o-feykovih-sms-o-zachislenii-v-uchebnie-zavedeniya-mvd-327f8e31',
    checkedAt: SRC.mvd2026Digital().checkedAt,
    applicableYear: 2026,
    status: 'verified',
  },
];
