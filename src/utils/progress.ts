import { documents } from '../data/documents';
import { fitnessNormSets } from '../data/fitness';
import { vvkChecklist } from '../data/vvk';
import type { Gender, PathStage, UserState } from '../types';
import { pluralRu } from './format';

export const vvkItemsFor = (gender: Gender | undefined) =>
  vvkChecklist.filter((i) => !i.appliesTo || !gender || i.appliesTo === gender);

export function vvkStats(state: UserState) {
  const items = vvkItemsFor(state.profile?.gender);
  const done = items.filter((i) => state.vvkProgress[i.id]).length;
  return { done, total: items.length };
}

export function documentStats(state: UserState) {
  const total = documents.length;
  const ready = documents.filter((d) => state.documentsProgress[d.id] === 'ready').length;
  const inProgress = documents.filter((d) => state.documentsProgress[d.id] === 'in_progress').length;
  return { ready, inProgress, total };
}

/** Упражнения пола пользователя, по которым внесён хотя бы один результат */
export function fitnessStats(state: UserState) {
  const gender = state.profile?.gender ?? 'male';
  const ids = Array.from(
    new Set(fitnessNormSets.flatMap((s) => s.exercises.filter((e) => e.gender === gender).map((e) => e.id))),
  );
  const logged = ids.filter((id) => state.fitnessResults.some((r) => r.exerciseId === id)).length;
  return { logged, total: ids.length };
}

/**
 * Этапы «Моего пути». Готовность = выполненные этапы / все этапы.
 * Никаких фиксированных процентов — только фактическое состояние пользователя.
 */
export function buildPath(state: UserState): PathStage[] {
  const vvk = vvkStats(state);
  const docs = documentStats(state);
  const fit = fitnessStats(state);
  const academyLink = state.selectedAcademy ? `/academies/${state.selectedAcademy}` : '/academies';

  return [
    {
      id: 'account',
      title: 'Аккаунт создан',
      description: 'Регистрация и профиль абитуриента.',
      done: Boolean(state.profile),
      link: '/profile',
      linkLabel: 'Профиль',
    },
    {
      id: 'academy',
      title: 'Академия выбрана',
      description: 'Выберите одно из четырёх учебных заведений МВД РК.',
      done: Boolean(state.selectedAcademy),
      link: '/academies',
      linkLabel: state.selectedAcademy ? 'Изменить' : 'Выбрать',
    },
    {
      id: 'specialty',
      title: 'Специальность выбрана',
      description: 'Изучите программы академии и подтвердите выбор.',
      done: Boolean(state.selectedSpecialty),
      link: `${academyLink}/specialties`,
      linkLabel: state.selectedSpecialty ? 'Изменить' : 'Выбрать',
    },
    {
      id: 'requirements',
      title: 'Требования просмотрены',
      description: 'ВВК, документы, физическая подготовка и этапы конкурса.',
      done: state.myPathProgress.requirementsViewed,
      link: '/requirements',
      linkLabel: 'Открыть',
    },
    {
      id: 'documents',
      title: 'Документы',
      description: 'Отметьте статус каждого документа. Этап завершён, когда все — «Готово».',
      done: docs.total > 0 && docs.ready === docs.total,
      partial: docs.total ? docs.ready / docs.total : 0,
      partialLabel: `${docs.ready} из ${docs.total} готово`,
      link: '/documents',
      linkLabel: 'Чеклист',
    },
    {
      id: 'vvk',
      title: 'ВВК',
      description: 'Подготовка к военно-врачебной комиссии. Отметьте все пункты или отметьте ВВК как пройденную.',
      done: Boolean(state.myPathProgress.manual.vvkPassed) || (vvk.total > 0 && vvk.done === vvk.total),
      partial: vvk.total ? vvk.done / vvk.total : 0,
      partialLabel: `${vvk.done} из ${vvk.total} пунктов`,
      link: '/vvk',
      linkLabel: 'Чеклист',
      manual: 'vvkPassed',
    },
    {
      id: 'fitness',
      title: 'Физическая подготовка',
      description: 'Внесите свои результаты по всем упражнениям норматива.',
      done: fit.total > 0 && fit.logged === fit.total,
      partial: fit.total ? fit.logged / fit.total : 0,
      partialLabel: `${fit.logged} из ${fit.total} ${pluralRu(fit.total, ['упражнения', 'упражнений', 'упражнений'])}`,
      link: '/fitness',
      linkLabel: 'Результаты',
    },
    {
      id: 'competition',
      title: 'Конкурсный отбор',
      description: 'Учитываются ЕНТ, льготы и другие конкурсные показатели. Отметьте, когда этап пройден.',
      done: Boolean(state.myPathProgress.manual.competition),
      link: '/requirements',
      linkLabel: 'Об этапе',
      manual: 'competition',
    },
    {
      id: 'enrollment',
      title: 'Зачисление',
      description: 'Результаты — только в личном кабинете Qyzmet police. Отметьте после официального решения.',
      done: Boolean(state.myPathProgress.manual.enrollment),
      link: '/news',
      linkLabel: 'Новости',
      manual: 'enrollment',
    },
  ];
}

export function readiness(stages: PathStage[]) {
  const done = stages.filter((s) => s.done).length;
  const total = stages.length;
  return {
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0,
    next: stages.find((s) => !s.done) ?? null,
  };
}
