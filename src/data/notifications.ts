import type { NotificationItem } from '../types';

/** Стартовые уведомления для нового пользователя */
export const initialNotifications = (): NotificationItem[] => {
  const now = new Date().toISOString();
  return [
    {
      id: 'welcome-vvk',
      title: 'ВВК',
      body: 'Проверь документы и сроки обследований перед прохождением ВВК.',
      date: now,
      read: false,
      link: '/vvk',
      topic: 'vvk',
    },
    {
      id: 'welcome-fitness',
      title: 'Физическая подготовка',
      body: 'Не забудь проверить актуальные нормативы физической подготовки.',
      date: now,
      read: false,
      link: '/fitness',
      topic: 'fitness',
    },
    {
      id: 'welcome-news',
      title: 'Новости',
      body: 'МВД предупредило о фейковых SMS о «зачислении». Результаты — только в личном кабинете Qyzmet police.',
      date: now,
      read: false,
      link: '/news',
      topic: 'news',
    },
  ];
};
