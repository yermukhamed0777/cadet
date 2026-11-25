import type { NotificationItem } from '../types';

/** Starter notifications for a new user */
export const initialNotifications = (): NotificationItem[] => {
  const now = new Date().toISOString();
  return [
    {
      id: 'welcome-medical',
      title: 'Medical exam',
      body: 'Review the DoDMERB steps and confirm the deadline with your academy.',
      date: now,
      read: false,
      link: '/vvk',
      topic: 'vvk',
    },
    {
      id: 'welcome-fitness',
      title: 'Fitness test',
      body: 'Check the official CFA reference scores and log your own results.',
      date: now,
      read: false,
      link: '/fitness',
      topic: 'fitness',
    },
    {
      id: 'welcome-news',
      title: 'Admissions updates',
      body: 'Official announcements are linked in Updates. Academy decisions come from the academy, not from this tracker.',
      date: now,
      read: false,
      link: '/news',
      topic: 'news',
    },
  ];
};
