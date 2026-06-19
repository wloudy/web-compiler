# Web Compiler html (Next.js 15)

Современный веб-компилятор HTML, CSS и JavaScript в стиле VS Code на `Next.js 15` (App Router).

## Возможности

- Monaco Editor с подсветкой синтаксиса и автодополнением
- Три вкладки: `HTML`, `CSS`, `JavaScript`
- Live Preview в `iframe` с sandbox-режимом
- Кнопка `Run` для принудительного выполнения
- Автосохранение проекта в `localStorage`
- Управление проектом:
  - Новый проект
  - Очистка кода
  - Экспорт в ZIP
  - Импорт из ZIP
- Строка состояния:
  - Активная вкладка
  - Количество строк
  - Позиция курсора
- Ресайз панелей
- Fullscreen-режим редактора
- Горячие клавиши:
  - `Ctrl+S`
  - `Ctrl+Enter`
  - `Ctrl+/`
- Темная адаптивная тема на Tailwind CSS
- Анимации через Framer Motion

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

Проект готов к деплою на Vercel.
