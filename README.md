# G7

Основной веб-проект оставлен в корне репозитория (`index.html`, `app.html`, `pages/*`).

## Отдельный проект игры
Игра вынесена в отдельный подпроект:

- `office-panda-clash/`

Запуск:

```bash
cd office-panda-clash
npm install
npm run run
```

Desktop build:

```bash
cd office-panda-clash
npm install
npm run build:desktop
```


## Публикация на GitHub
Если вы не видите новые файлы на GitHub, значит изменения есть только локально.

```bash
git push -u origin work
```

Если remote не настроен:

```bash
git remote add origin <URL_ВАШЕГО_GITHUB_РЕПО>
git push -u origin work
```
