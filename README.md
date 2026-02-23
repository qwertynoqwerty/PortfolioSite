# ✨ PortfolioSite

<p align="center">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19.x-149ECA?style=flat-square&logo=react&logoColor=white">
  <img alt="Tailwind" src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer%20Motion-12.x-111827?style=flat-square">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-84CC16?style=flat-square">
</p>

---

**PortfolioSite** — персональный сайт-портфолио VR/AR-разработчика на **React + Vite**.  
Проект показывает featured-работы, каталог остальных проектов, изображения/видео в модалках и адаптивный интерфейс с анимациями.

Сайт ориентирован на быстрый просмотр кейсов: сначала ключевые проекты, затем горизонтальный каталог остальных работ.

---

## 🎮 Основные возможности

- ✨ Hero-блок с анимированным акцентом и визуальной подсказкой скролла
- 🧠 Блок "Обо мне" с навыками и адаптивной сеткой
- 🗂️ Showcase избранных проектов (featured)
- 🎞️ Галерея изображений в модалке с полноэкранным viewer
- ▶️ Видео-модалка (YouTube embed, `youtube-nocookie`)
- 🎠 Горизонтальная карусель каталога с кнопками навигации
- 🖼️ Компонент `SmartImage` с подбором формата (AVIF/WEBP/original)
- 📱 Адаптивная верстка для mobile / tablet / desktop
- ♿ Базовая поддержка reduced-motion и блокировки скролла в модалках

---

## 🧱 Стек

- **React 19**
- **Vite**
- **Tailwind CSS**
- **Framer Motion**
- **Headless UI** (`Dialog`, `Transition`)
- **React Icons**

---

## 🚀 Запуск проекта

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск в режиме разработки

```bash
npm run dev
```

### 3. Production build

```bash
npm run build
```

### 4. Локальный preview сборки

```bash
npm run preview
```

### 5. Проверка линтером

```bash
npm run lint
```

---

## 🗂️ Структура проекта

```text
PortfolioSite/
├─ public/
│  └─ favicon.png
├─ src/
│  ├─ assets/
│  │  ├─ images/
│  │  └─ icons/
│  ├─ components/
│  │  ├─ Hero.jsx
│  │  ├─ About.jsx
│  │  ├─ ProjectsShowcase.jsx
│  │  ├─ CatalogCarousel.jsx
│  │  ├─ ProjectCard.jsx
│  │  ├─ ShowcaseImageModal.jsx
│  │  ├─ ShowcaseVideoModal.jsx
│  │  └─ ...
│  ├─ data/
│  │  └─ projects.json
│  ├─ utils/
│  │  ├─ projectHelpers.js
│  │  ├─ useProjectMediaModals.js
│  │  ├─ useLockBodyScroll.js
│  │  └─ motionPresets.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ index.html
├─ vite.config.js
├─ tailwind.config.js
└─ package.json
```

---

## 📦 Данные проектов

Проекты описываются в `src/data/projects.json`.

Для карточек/витрины используются поля:

- `id`
- `title`
- `year`
- `date`
- `summary`
- `cover`
- `images`
- `youtubeId`
- `repo`
- `featured`

`featured: true` — проект попадает в верхний showcase, остальные идут в каталог.

---

## 🖼️ Медиа и модалки

- Изображения открываются через `ShowcaseImageModal`
- Внутри есть viewer с переключением по кадрам
- Видео открывается через `ShowcaseVideoModal`
- Скролл страницы блокируется хуком `useLockBodyScroll`

---

## 🌐 Деплой

В `vite.config.js` настроен `base`:

- `"/"` для dev
- `"/PortfolioSite/"` для production

Это подходит для деплоя на **GitHub Pages** (если репозиторий публикуется в `PortfolioSite`).

---

## 📝 Примечания

- В проекте используется `import.meta.glob(...)` в `SmartImage` для поиска вариантов изображений
- Есть предупреждение Vite про deprecated `as: "url"` (работу не ломает, можно обновить позже)

