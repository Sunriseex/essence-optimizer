# Essence Farm Optimizer

Веб-приложение для подбора лучших локаций фарма эссенций оружия в **Arknights: Endfield**.

## Доступ

Приложение опубликовано через **GitHub Pages**.  

## Что умеет

- Отображает оружие по редкости (6/5/4★).
- Поддерживает состояния оружия:
  - `левый клик` - оружие для фарма (синий);
  - `правый клик` - оружие уже отфармлено (зелёный).
- Автоматически подбирает базовый набор статов под текущее выбранное оружие.
- Поддерживает проверку эссенции в режиме:
  - `3 Attribute + 1 Secondary`;
  - `3 Attribute + 1 Skill`;
  - `3 Attribute + 1 Secondary + 1 Skill` (одновременный ручной выбор).
- Строит результат по группам оружия и показывает:
  - ключевую локацию;
  - покрытие оружия;
  - покрытие статов.

## Структура проекта

- `index.html` - основной HTML.
- `src/css/styles.css` - стили и анимации.
- `src/js/app.js` - логика приложения.
- `data/weapons.json` - данные по оружию.
- `data/locations.json` - данные по локациям.
- `data/localization.json` - локализация интерфейса, статов и названий.
- `assets/backgrounds/` - фоновые изображения.
- `assets/weapons/` - иконки оружия.
- `assets/icons/` - иконки приложения.

## Как пользоваться

1. Выберите оружие в блоке `Оружие`.
2. Нажмите `Найти лучшую локацию`.
3. Проверьте результат по группам.

Для проверки эссенции:

1. Настройте статы в блоке `Желаемые статы`.
2. Проверьте выделенные оружия.

## Формат данных

### `data/weapons.json`

```json
{
  "Weapon Name": {
    "rarity": 6,
    "attribute_stats": "Intellect Boost",
    "secondary_stats": "Critical Rate Boost",
    "skill_stats": "Fracture"
  }
}
```

### `data/locations.json`

```json
{
  "Location Name": {
    "attribute_stats": ["Agility Boost", "Strength Boost", "Will Boost", "Intellect Boost", "Main Attribute Boost"],
    "secondary_stats": ["ATK Boost", "HP Boost"],
    "skill_stats": ["Infliction", "Suppression"]
  }
}
```

## Кастомизация

- Данные: `data/weapons.json`, `data/locations.json`, `data/localization.json`.
- Стили и анимации: `src/css/styles.css`.
- Логика подбора/фильтрации: `src/js/app.js`.
