# Essence Farm Optimizer

[Перейти к русскому описанию](#русский)

## English

A web app for finding efficient weapon essence farming routes in **Arknights: Endfield**.

### Availability

The project is published via **GitHub Pages**.

### Features

- Weapon list grouped by rarity (6/5/4-star).
- Weapon state management:
  - `Left click`: mark weapon for farming (blue).
  - `Right click`: mark weapon as already farmed (green).
- Automatic stat preselection based on currently selected weapons.
- Manual essence check modes:
  - `3 Attribute + 1 Secondary`
  - `3 Attribute + 1 Skill`
  - `3 Attribute + 1 Secondary + 1 Skill` (manual combined selection)
- Grouped farm plan output with:
  - recommended location per group
  - weapon coverage
  - stat coverage
- UI language switching (RU/EN) with localized weapon/stat/location names.

### Project Structure

- `index.html` - main HTML entry.
- `src/css/styles.css` - styles and animations.
- `src/js/app.js` - application logic.
- `data/weapons.json` - weapon data.
- `data/locations.json` - location stat pools.
- `data/localization.json` - localization for UI, stats, weapons, and locations.
- `assets/backgrounds/` - background images.
- `assets/weapons/` - weapon icons.
- `assets/icons/` - app icons.

### Usage

1. Select weapons in the `Weapons` panel.
2. Click `Find Best Location`.
3. Review grouped farming results.

For manual essence verification:

1. Set stats in `Desired Stats`.
2. Check highlighted matching weapons.

### Data Format

#### `data/weapons.json`

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

#### `data/locations.json`

```json
{
  "Location Name": {
    "attribute_stats": [
      "Agility Boost",
      "Strength Boost",
      "Will Boost",
      "Intellect Boost",
      "Main Attribute Boost"
    ],
    "secondary_stats": ["ATK Boost", "HP Boost"],
    "skill_stats": ["Infliction", "Suppression"]
  }
}
```

### Customization

- Data: `data/weapons.json`, `data/locations.json`, `data/localization.json`
- Styling and animations: `src/css/styles.css`
- Selection and planning logic: `src/js/app.js`

### License

This project is licensed under the MIT License. See `LICENSE` for details.

---

## Русский

Веб-приложение для подбора эффективных локаций фарма эссенций оружия в **Arknights: Endfield**.

### Доступ

Проект опубликован через **GitHub Pages**.

### Возможности

- Отображение оружия по редкости (6/5/4 звезды).
- Управление состояниями оружия:
  - `Левый клик`: отметить оружие для фарма (синий).
  - `Правый клик`: отметить оружие как уже отфармленное (зелёный).
- Автоподбор базового набора статов по текущему выбору оружия.
- Ручная проверка эссенции в режимах:
  - `3 Attribute + 1 Secondary`
  - `3 Attribute + 1 Skill`
  - `3 Attribute + 1 Secondary + 1 Skill` (одновременный ручной выбор)
- Групповой план фарма с отображением:
  - рекомендуемой локации для группы
  - покрытия оружия
  - покрытия статов
- Переключение языка интерфейса (RU/EN) с локализацией оружия, статов и локаций.

### Структура проекта

- `index.html` - основной HTML-файл.
- `src/css/styles.css` - стили и анимации.
- `src/js/app.js` - логика приложения.
- `data/weapons.json` - данные оружия.
- `data/locations.json` - пулы статов локаций.
- `data/localization.json` - локализация интерфейса, статов, оружия и локаций.
- `assets/backgrounds/` - фоновые изображения.
- `assets/weapons/` - иконки оружия.
- `assets/icons/` - иконки приложения.

### Использование

1. Выберите оружие в блоке `Оружие`.
2. Нажмите `Find Best Location` / `Найти лучшую локацию`.
3. Проверьте результат по группам.

Для ручной проверки эссенции:

1. Настройте статы в блоке `Desired Stats` / `Желаемые статы`.
2. Проверьте выделенные совпадения оружия.

### Формат данных

#### `data/weapons.json`

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

#### `data/locations.json`

```json
{
  "Location Name": {
    "attribute_stats": [
      "Agility Boost",
      "Strength Boost",
      "Will Boost",
      "Intellect Boost",
      "Main Attribute Boost"
    ],
    "secondary_stats": ["ATK Boost", "HP Boost"],
    "skill_stats": ["Infliction", "Suppression"]
  }
}
```

### Кастомизация

- Данные: `data/weapons.json`, `data/locations.json`, `data/localization.json`
- Стили и анимации: `src/css/styles.css`
- Логика выбора и планирования: `src/js/app.js`

### Лицензия

Проект распространяется по MIT License. Подробности в `LICENSE`.
