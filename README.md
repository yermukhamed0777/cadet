# BOLASHAQ KURSANT — «Твой путь в академию»

Мобильное web-приложение (PWA) для абитуриентов ведомственных вузов **МВД Республики Казахстан**:

- Алматинская академия МВД РК имени М. Есбулатова
- Карагандинская академия МВД РК имени Б. Бейсенова
- Костанайская академия МВД РК имени Ш. Кабылбаева
- Актюбинский юридический институт МВД РК имени М. Букенбаева

Приложение не является официальным ресурсом МВД. Каждая запись данных содержит источник, дату проверки, год применимости и статус (`verified` / `archive` / `needs_review`).

## Стек

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · React Router 6 · Lucide React · vite-plugin-pwa (Workbox).

## Установка и запуск

```bash
npm install
cp .env.example .env    # по умолчанию VITE_AUTH_MODE=demo
npm run dev             # http://localhost:5173 (флаг --host открывает доступ с телефона в той же Wi-Fi сети)
```

Открыть с телефона: `npm run dev` выведет адрес вида `http://192.168.x.x:5173` — откройте его на телефоне в той же сети.
Демо-регистрация использует Web Crypto, который браузеры дают только на `https://` или `localhost`. Для полноценной проверки с телефона используйте production-сборку на HTTPS-хостинге или туннель (например, `npx localtunnel --port 4173`).

### Production build

```bash
npm run build           # TypeScript-проверка + сборка в dist/ (с service worker)
npm run preview         # локальный просмотр production-сборки, http://localhost:4173
```

`npm run build:hash` — сборка в `dist-hash/` для хостинга без SPA-fallback: HashRouter (`/#/home`), относительные пути, без service worker.

### Деплой

`dist/` — статический сайт. На хостинге настройте SPA-fallback: все пути → `index.html` (Netlify: `_redirects` с `/* /index.html 200`; Vercel: `rewrites`; Nginx: `try_files $uri /index.html`). Для PWA и Web Crypto нужен HTTPS.

## Режимы авторизации

### Demo mode (по умолчанию)

`VITE_AUTH_MODE=demo` или пустой `VITE_API_URL`.

- Аккаунты и данные хранятся только в браузере этого устройства (localStorage, при недоступности — в памяти).
- Пароль не хранится: сохраняется только PBKDF2-SHA256 хэш (150 000 итераций) со случайной солью.
- В интерфейсе показывается плашка «Демо-режим». Это не настоящая авторизация.
- Кнопка «Продолжить с Google» неактивна и подписана, почему.

### Production mode

```env
VITE_AUTH_MODE=production
VITE_API_URL=https://api.example.kz
VITE_GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
VITE_OAUTH_REDIRECT_PATH=/auth/callback
```

## Google OAuth

Во frontend хранится **только публичный Client ID**. Client Secret и обмен кода на токен живут на backend.

1. Google Cloud Console → APIs & Services → Credentials → *Create OAuth client ID* → Web application.
2. **Authorized JavaScript origins:** `https://ваш-домен`, `http://localhost:5173`.
3. **Authorized redirect URIs** (на backend): `https://api.ваш-домен/auth/google/callback`.
4. Client ID → `VITE_GOOGLE_CLIENT_ID` (frontend) и в конфиг backend; Client Secret → только в секреты backend.

Поток:

```
Кнопка Google → GET {API}/auth/google?redirect_uri={APP}/auth/callback
→ Google → {API}/auth/google/callback (backend меняет code на токены, создаёт пользователя)
→ redirect на {APP}/auth/callback?token=<session_token>
→ frontend: GET {API}/auth/me → сессия
```

## Backend-контракт

Frontend работает через сервисный слой (`src/services`) и не зависит от конкретного хранилища. В режиме production ожидаются эндпоинты:

| Метод | Путь | Назначение |
|---|---|---|
| POST | `/auth/register` | `{email, password}` → `{user, token}` |
| POST | `/auth/login` | `{email, password}` → `{user, token}` |
| GET | `/auth/google` | старт OAuth (redirect) |
| GET | `/auth/me` | текущий пользователь |
| POST | `/auth/logout` | завершение сессии |
| GET / PUT | `/me/state` | профиль, выбор академии/специальности, чеклисты, результаты, уведомления (`UserState` в `src/types`) |
| GET | `/news` | новости (`NewsItem[]`) — например, из CMS |
| POST | `/support/messages` | `{subject, message}` |

Токен передаётся в `Authorization: Bearer`, запросы идут с `credentials: 'include'` (подходят и httpOnly-cookie). Подойдёт Supabase / Firebase / собственный сервер: достаточно реализовать эти эндпоинты или заменить реализацию в `authService.ts` и `profileService.ts`.

Push-уведомления: подключаются через Web Push (VAPID) на backend; в приложении уже есть центр уведомлений и настройки тем.

## Где обновлять данные

| Что | Файл |
|---|---|
| Академии (адреса, контакты, условия) | `src/data/academies.ts` |
| Специальности | `src/data/specialties.ts` |
| Нормативы физподготовки | `src/data/fitness.ts` |
| Документы | `src/data/documents.ts` |
| ВВК (чеклист, пункты на карте) | `src/data/vvk.ts` |
| Новости | `src/data/news.ts` |
| Этапы и общие требования | `src/data/requirements.ts` |
| FAQ | `src/data/faq.ts` |
| Ссылки на источники, дата проверки | `src/data/sources.ts` |

Правила:

- Не добавляйте данные без источника. Неподтверждённое → `status: 'needs_review'` (в интерфейсе: «Требует уточнения»).
- Данные прошлого года → `status: 'archive'`, `applicableYear: 2025` («Архивная информация — 2025»).
- `verified` + `applicableYear: 2026` → «Актуально на 2026». Ставьте только после проверки по официальному источнику.
- Пункты ВВК на карте (`vvkLocations`) добавляйте только с подтверждённым адресом и источником.
- После сверки обновите `CHECKED_AT` в `sources.ts`.

## Структура

```
src/
  components/   UI-кит (ui/), навигация, guards, карточки
  context/      Auth, AppState (user state), Toast
  data/         статические справочники с источниками
  hooks/        useAuth, useAppState/usePath, useToast, useAsync
  layouts/      AppLayout (нижняя навигация), AuthLayout
  pages/        экраны
  services/     auth, profile/support, academy, news, storage, apiClient, config
  types/        TypeScript-типы
  utils/        прогресс, нормативы, валидация, криптография, форматирование
```

## Состояние данных на момент сверки (27.09.2026)

- Алматы, Караганда: программы, адреса и контакты сверены с официальными сайтами.
- Костанай: сайт qpa.edu.kz закрыт для автоматической проверки; программы помечены «Требует уточнения», условия обучения — по eGov.kz.
- Актобе: адрес и контакты — с официального сайта; перечень программ требует сверки.
- Страница МВД на gov.kz не открылась при автоматической проверке — данные со ссылкой на неё помечены «Требует уточнения».
- ВВК и нормативы: актуальные официальные данные 2026 не найдены — показаны архив 2025 (из ТЗ) и таблица с сайта Алматинской академии без указания года.
- Пункты ВВК: подтверждённых адресов нет, на карте показано «Адрес требует уточнения».
