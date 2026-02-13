        let weaponsData = {};
        let weapons = [];
        let locationsData = {};
        let localizationData = {
            weapons: {},
            stats: {
                attribute: {},
                secondary: {},
                skill: {}
            },
            locations:{}
        };
        let hasInitializedUI = false;
        let currentLanguage = document.documentElement.lang === 'en' ? 'en' : 'ru';
        let isInterfaceHidden = false;
        let uidCopyResetTimeoutId = null;
        const GAME_UID = '6639599843';
        const REPOSITORY_URL = 'https://github.com/Sunriseex/essence-optimizer';

        const I18N = {
            ru: {
                pageTitle: 'Essence Farm Optimizer - Arknights Endfield',
                appTitle: 'Essence Farm Optimizer',
                languageLabel: 'Язык',
                languageRu: 'Русский',
                languageEn: 'English',
                statsSectionTitle: 'Желаемые статы',
                statsSectionSubtitle: 'Выберите статы для эссенции оружия, которое нужно фармить. Secondary и Skill можно выбрать одновременно вручную.',
                weaponsSectionTitle: 'Оружие',
                weaponsSectionSubtitle: '<strong>Левый клик:</strong> Отметить оружие, для которого нужно фармить эссенцию (синий)<br><strong>Правый клик:</strong> Отметить оружие с уже готовой эссенцией (зелёный, не будет учитываться в фарме)',
                weaponSearchLabel: 'Поиск оружия',
                weaponSearchPlaceholder: 'Введите название оружия',
                weaponSearchNoMatches: 'По запросу ничего не найдено.',
                repoLinkLabel: 'Открыть GitHub репозиторий',
                uidButtonLabel: 'UID: {uid}',
                uidCopied: 'UID скопирован',
                uidCopyFailed: 'Не удалось скопировать',
                hideUiBtn: 'Скрыть интерфейс',
                showUiBtn: 'Показать интерфейс',
                legendOwned: 'Есть на аккаунте',
                legendEssence: 'Эссенция готова',
                attributeGroupTitle: 'Attribute Stats <span class="stat-limit">(максимум 3 из 5)</span>',
                secondaryGroupTitle: 'Secondary Stats <span class="stat-limit">(выбрать 1)</span>',
                skillGroupTitle: 'Skill Stats <span class="stat-limit">(выбрать 1)</span>',
                calculateBtn: 'Найти лучшую локацию',
                resetBtn: 'Сбросить всё',
                resultsSectionTitle: 'Результаты',
                rarityLabel: '{rarity}★ оружие',
                tooltipAttribute: 'Attribute:',
                tooltipSecondary: 'Secondary:',
                tooltipSkill: 'Skill:',
                noResultsSelectWeapon: 'Выберите хотя бы одно оружие для фарма (левый клик)',
                noResultsAllFarmed: 'Всё выбранное оружие уже отфармлено.',
                noResultsInvalidSelection: 'Выберите ровно 3 Attribute Stats и хотя бы 1 стат из Secondary или Skill.',
                noResultsNoMatch: 'Ни одно выбранное оружие не подходит под выбранные Secondary/Skill статы. Измените выбор.',
                noResultsNoLocation: 'Не найдено локаций, где этот набор статов может дропнуть оружие: {weapons}',
                groupBest: 'Группа 1',
                groupN: 'Группа {index}',
                groupStats: 'статы: {stats}',
                weaponsInGroup: 'Оружие в группе ({count}):',
                attrStatsLabel: 'Attribute Stats:',
                secondaryStatLabel: 'Secondary Stat:',
                skillStatLabel: 'Skill Stat:',
                locationSpotlightBest: 'Ключевая локация',
                locationSpotlightGroup: 'Локация группы',
                coverageTitle: 'Покрытие выбранных статов',
                scoreWeapons: '{percentage}% оружия ({matched}/{total})',
                scoreStats: '{matched}/{total} статов',
                errorFileProtocol: 'Браузер блокирует загрузку JSON при открытии HTML напрямую.',
                errorNetwork: 'Ошибка сети при загрузке data/weapons.json, data/locations.json и data/localization.json',
                errorFetchStatus: 'Не удалось загрузить JSON (weapons: {weaponsStatus}, locations: {locationsStatus}, localization: {localizationStatus})',
                errorInvalidJson: 'Некорректный формат JSON в data/weapons.json, data/locations.json или data/localization.json',
                errorEmptyJson: 'JSON загружен, но список оружия или локаций пуст. Проверьте содержимое data/weapons.json, data/locations.json и data/localization.json'
            },
            en: {
                pageTitle: 'Essence Farm Optimizer - Arknights Endfield',
                appTitle: 'Essence Farm Optimizer',
                languageLabel: 'Language',
                languageRu: 'Russian',
                languageEn: 'English',
                statsSectionTitle: 'Desired Stats',
                statsSectionSubtitle: 'Choose essence stats for weapons you want to farm. Secondary and Skill can be selected together manually.',
                weaponsSectionTitle: 'Weapons',
                weaponsSectionSubtitle: '<strong>Left click:</strong> Mark weapon for essence farming (blue)<br><strong>Right click:</strong> Mark weapon as already farmed (green, excluded from farming)',
                weaponSearchLabel: 'Weapon Search',
                weaponSearchPlaceholder: 'Type weapon name',
                weaponSearchNoMatches: 'No weapons match your search.',
                repoLinkLabel: 'Open GitHub repository',
                uidButtonLabel: 'UID: {uid}',
                uidCopied: 'UID copied',
                uidCopyFailed: 'Copy failed',
                hideUiBtn: 'Hide Interface',
                showUiBtn: 'Show Interface',
                legendOwned: 'Owned on account',
                legendEssence: 'Essence ready',
                attributeGroupTitle: 'Attribute Stats <span class="stat-limit">(max 3 of 5)</span>',
                secondaryGroupTitle: 'Secondary Stats <span class="stat-limit">(choose 1)</span>',
                skillGroupTitle: 'Skill Stats <span class="stat-limit">(choose 1)</span>',
                calculateBtn: 'Find Best Location',
                resetBtn: 'Reset All',
                resultsSectionTitle: 'Results',
                rarityLabel: '{rarity}-Star Weapons',
                tooltipAttribute: 'Attribute:',
                tooltipSecondary: 'Secondary:',
                tooltipSkill: 'Skill:',
                noResultsSelectWeapon: 'Select at least one weapon to farm (left click)',
                noResultsAllFarmed: 'All selected weapons are already farmed.',
                noResultsInvalidSelection: 'Select exactly 3 Attribute Stats and at least 1 stat from Secondary or Skill.',
                noResultsNoMatch: 'No selected weapon matches the chosen Secondary/Skill stats. Change your selection.',
                noResultsNoLocation: 'No locations found where this stat set can drop weapons: {weapons}',
                groupBest: 'Group 1',
                groupN: 'Group {index}',
                groupStats: 'stats: {stats}',
                weaponsInGroup: 'Weapons in group ({count}):',
                attrStatsLabel: 'Attribute Stats:',
                secondaryStatLabel: 'Secondary Stat:',
                skillStatLabel: 'Skill Stat:',
                locationSpotlightBest: 'Key location',
                locationSpotlightGroup: 'Group location',
                coverageTitle: 'Selected stats coverage',
                scoreWeapons: '{percentage}% weapons ({matched}/{total})',
                scoreStats: '{matched}/{total} stats',
                errorFileProtocol: 'Browser blocks JSON loading when opening HTML directly.',
                errorNetwork: 'Network error while loading data/weapons.json, data/locations.json, and data/localization.json',
                errorFetchStatus: 'Failed to load JSON (weapons: {weaponsStatus}, locations: {locationsStatus}, localization: {localizationStatus})',
                errorInvalidJson: 'Invalid JSON format in data/weapons.json, data/locations.json, or data/localization.json',
                errorEmptyJson: 'JSON loaded, but weapons or locations list is empty. Check data/weapons.json, data/locations.json, and data/localization.json'
            }
        };

        try {
            const savedLanguage = localStorage.getItem('essenceOptimizer.language');
            if (savedLanguage === 'ru' || savedLanguage === 'en') {
                currentLanguage = savedLanguage;
            }
        } catch (error) {
            // Ignore storage errors and use default language.
        }

        function t(key, params = {}) {
            const languagePack = I18N[currentLanguage] || I18N.ru;
            const fallbackPack = I18N.ru;
            let value = languagePack[key] ?? fallbackPack[key] ?? key;

            return value.replace(/\{(\w+)\}/g, (_, token) => {
                return Object.prototype.hasOwnProperty.call(params, token) ? String(params[token]) : `{${token}}`;
            });
        }

        function getLocalizedWeaponName(weaponKey) {
            const localized = localizationData.weapons?.[weaponKey]?.[currentLanguage];
            const fallback = localizationData.weapons?.[weaponKey]?.en;
            return localized || fallback || weaponKey;
        }

        function getLocalizedStatName(statCategory, statKey) {
            const localized = localizationData.stats?.[statCategory]?.[statKey]?.[currentLanguage];
            const fallback = localizationData.stats?.[statCategory]?.[statKey]?.en;
            return localized || fallback || statKey;
        }

        function getLocalizedLocationName(locationKey) {
            const localized = localizationData.locations?.[locationKey]?.[currentLanguage];
            const fallback = localizationData.locations?.[locationKey]?.en;
            return localized || fallback || locationKey;
        }

        function applyStaticTranslations() {
            document.documentElement.lang = currentLanguage;
            document.title = t('pageTitle');

            const languageSelect = document.getElementById('languageSelect');
            if (languageSelect) {
                languageSelect.value = currentLanguage;
                const ruOption = languageSelect.querySelector('option[value="ru"]');
                const enOption = languageSelect.querySelector('option[value="en"]');
                if (ruOption) ruOption.textContent = t('languageRu');
                if (enOption) enOption.textContent = t('languageEn');
            }

            const byId = (id) => document.getElementById(id);
            if (byId('appTitle')) byId('appTitle').textContent = t('appTitle');
            if (byId('languageLabel')) byId('languageLabel').textContent = t('languageLabel');
            if (byId('statsSectionTitle')) byId('statsSectionTitle').textContent = t('statsSectionTitle');
            if (byId('statsSectionSubtitle')) byId('statsSectionSubtitle').textContent = t('statsSectionSubtitle');
            if (byId('weaponsSectionTitle')) byId('weaponsSectionTitle').textContent = t('weaponsSectionTitle');
            if (byId('weaponsSectionSubtitle')) byId('weaponsSectionSubtitle').innerHTML = t('weaponsSectionSubtitle');
            if (byId('weaponSearchLabel')) byId('weaponSearchLabel').textContent = t('weaponSearchLabel');
            if (byId('weaponSearchInput')) byId('weaponSearchInput').placeholder = t('weaponSearchPlaceholder');
            if (byId('weaponSearchNoMatches')) byId('weaponSearchNoMatches').textContent = t('weaponSearchNoMatches');
            if (byId('repoLink')) {
                byId('repoLink').setAttribute('href', REPOSITORY_URL);
                byId('repoLink').setAttribute('aria-label', t('repoLinkLabel'));
                byId('repoLink').setAttribute('title', t('repoLinkLabel'));
            }
            if (byId('uidCopyBtn') && !byId('uidCopyBtn').classList.contains('copied') && !byId('uidCopyBtn').classList.contains('copy-failed')) {
                byId('uidCopyBtn').textContent = t('uidButtonLabel', { uid: GAME_UID });
            }
            if (byId('focusModeToggle')) byId('focusModeToggle').textContent = isInterfaceHidden ? t('showUiBtn') : t('hideUiBtn');
            if (byId('legendOwned')) byId('legendOwned').textContent = t('legendOwned');
            if (byId('legendEssence')) byId('legendEssence').textContent = t('legendEssence');
            if (byId('attributeGroupTitle')) byId('attributeGroupTitle').innerHTML = t('attributeGroupTitle');
            if (byId('secondaryGroupTitle')) byId('secondaryGroupTitle').innerHTML = t('secondaryGroupTitle');
            if (byId('skillGroupTitle')) byId('skillGroupTitle').innerHTML = t('skillGroupTitle');
            if (byId('calculateBtn')) byId('calculateBtn').textContent = t('calculateBtn');
            if (byId('resetBtn')) byId('resetBtn').textContent = t('resetBtn');
            if (byId('resultsSectionTitle')) byId('resultsSectionTitle').textContent = t('resultsSectionTitle');
        }

        function restoreUidButtonDefaultLabel() {
            const button = document.getElementById('uidCopyBtn');
            if (!button) {
                return;
            }
            button.classList.remove('copied', 'copy-failed');
            button.textContent = t('uidButtonLabel', { uid: GAME_UID });
        }

        function setUidButtonFeedback(label, cssClass) {
            const button = document.getElementById('uidCopyBtn');
            if (!button) {
                return;
            }

            button.classList.remove('copied', 'copy-failed');
            if (cssClass) {
                button.classList.add(cssClass);
            }
            button.textContent = label;

            if (uidCopyResetTimeoutId !== null) {
                clearTimeout(uidCopyResetTimeoutId);
            }

            uidCopyResetTimeoutId = window.setTimeout(() => {
                uidCopyResetTimeoutId = null;
                restoreUidButtonDefaultLabel();
            }, 1600);
        }

        async function copyGameUid() {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(GAME_UID);
                } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = GAME_UID;
                    textarea.setAttribute('readonly', 'readonly');
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    textarea.style.pointerEvents = 'none';
                    document.body.appendChild(textarea);
                    textarea.select();
                    const copied = document.execCommand('copy');
                    document.body.removeChild(textarea);
                    if (!copied) {
                        throw new Error('copy-fallback-failed');
                    }
                }

                setUidButtonFeedback(t('uidCopied'), 'copied');
            } catch (error) {
                setUidButtonFeedback(t('uidCopyFailed'), 'copy-failed');
            }
        }

        function setLanguage(language) {
            if (language !== 'ru' && language !== 'en') {
                return;
            }

            currentLanguage = language;
            try {
                localStorage.setItem('essenceOptimizer.language', language);
            } catch (error) {
                // Ignore storage errors.
            }

            applyStaticTranslations();

            if (!hasInitializedUI) {
                return;
            }

            initWeapons();
            refreshLocalizedStatChipLabels();
            updateMainWeaponList();
            highlightMatchingWeapons();
            applyWeaponSearchFilter();

            const resultsSection = document.getElementById('resultsSection');
            if (!resultsSection.classList.contains('visible')) {
                return;
            }

            const btn = document.getElementById('calculateBtn');
            if (btn.disabled) {
                const weaponsNeedingEssence = Array.from(state.ownedWeapons)
                    .filter(weapon => !state.essenceReady.has(weapon));

                if (state.ownedWeapons.size === 0) {
                    showNoResults(t('noResultsSelectWeapon'), { scrollToResults: false });
                    return;
                }

                if (state.ownedWeapons.size > 0 && weaponsNeedingEssence.length === 0) {
                    showNoResults(t('noResultsAllFarmed'), { scrollToResults: false });
                    return;
                }

                showNoResults(t('noResultsInvalidSelection'), { scrollToResults: false });
                return;
            }

            calculateBestLocation({ scrollToResults: false });
        }

        function refreshLocalizedStatChipLabels() {
            const relabel = (containerId, statCategory) => {
                const container = document.getElementById(containerId);
                if (!container) {
                    return;
                }

                Array.from(container.children).forEach(chip => {
                    const statKey = chip.dataset.statKey;
                    if (!statKey) {
                        return;
                    }
                    chip.textContent = getLocalizedStatName(statCategory, statKey);
                });
            };

            relabel('attributeStats', 'attribute');
            relabel('secondaryStats', 'secondary');
            relabel('skillStats', 'skill');
        }

        async function loadDataFromJson() {
            const isFileProtocol = window.location.protocol === 'file:';
            let weaponsResponse;
            let locationsResponse;
            let localizationResponse;

            try {
                [weaponsResponse, locationsResponse, localizationResponse] = await Promise.all([
                    fetch('data/weapons.json'),
                    fetch('data/locations.json'),
                    fetch('data/localization.json')
                ]);
            } catch (error) {
                if (isFileProtocol) {
                    throw new Error(t('errorFileProtocol'));
                }
                throw new Error(t('errorNetwork'));
            }

            if (!weaponsResponse.ok || !locationsResponse.ok || !localizationResponse.ok) {
                throw new Error(t('errorFetchStatus', {
                    weaponsStatus: weaponsResponse.status,
                    locationsStatus: locationsResponse.status,
                    localizationStatus: localizationResponse.status
                }));
            }

            try {
                [weaponsData, locationsData, localizationData] = await Promise.all([
                    weaponsResponse.json(),
                    locationsResponse.json(),
                    localizationResponse.json()
                ]);
            } catch (error) {
                throw new Error(t('errorInvalidJson'));
            }

            weapons = Object.keys(weaponsData).sort();

            if (weapons.length === 0 || Object.keys(locationsData).length === 0) {
                throw new Error(t('errorEmptyJson'));
            }
        }

        const state = {
            ownedWeapons: new Set(),
            essenceReady: new Set(),
            selectedAttributeStats: new Set(),
            selectedSecondaryStat: null,
            selectedSkillStat: null
        };

        function triggerWeaponClickFill(element, interactionEvent) {
            if (!interactionEvent || !element) {
                return;
            }

            const rect = element.getBoundingClientRect();
            const x = interactionEvent.clientX - rect.left;
            const y = interactionEvent.clientY - rect.top;

            element.style.setProperty('--ripple-x', `${x}px`);
            element.style.setProperty('--ripple-y', `${y}px`);
            element.classList.remove('ripple-animate');
            void element.offsetWidth;
            element.classList.add('ripple-animate');
        }

        function refreshWeaponListHeights() {
            document.querySelectorAll('.weapon-list').forEach(list => {
                if (list.classList.contains('collapsed')) {
                    list.style.maxHeight = '0px';
                    return;
                }

                list.style.maxHeight = `${list.scrollHeight}px`;
            });
        }

        function normalizeSearchText(value) {
            return (value || '').toString().toLowerCase().trim();
        }

        function applyWeaponSearchFilter() {
            const searchInput = document.getElementById('weaponSearchInput');
            if (!searchInput) {
                return;
            }

            const query = normalizeSearchText(searchInput.value);
            let hasVisibleWeapons = false;

            document.querySelectorAll('.rarity-section').forEach(section => {
                const list = section.querySelector('.weapon-list');
                const toggle = section.querySelector('.rarity-toggle');
                let visibleInSection = 0;

                section.querySelectorAll('.weapon-item').forEach(item => {
                    const weaponKey = item.dataset.weapon || '';
                    const localizedName = item.querySelector('.weapon-name')?.textContent || '';
                    const matchesQuery = !query ||
                        normalizeSearchText(weaponKey).includes(query) ||
                        normalizeSearchText(localizedName).includes(query);

                    item.style.display = matchesQuery ? '' : 'none';
                    if (matchesQuery) {
                        visibleInSection += 1;
                        hasVisibleWeapons = true;
                    }
                });

                section.style.display = visibleInSection > 0 ? '' : 'none';

                if (query && visibleInSection > 0 && list) {
                    list.classList.remove('collapsed');
                    list.style.maxHeight = `${list.scrollHeight}px`;
                    if (toggle) {
                        toggle.classList.remove('collapsed');
                    }
                }
            });

            const noMatches = document.getElementById('weaponSearchNoMatches');
            if (noMatches) {
                noMatches.textContent = t('weaponSearchNoMatches');
                noMatches.style.display = query && !hasVisibleWeapons ? 'block' : 'none';
            }

            if (!query) {
                refreshWeaponListHeights();
            }
        }

        function handleWeaponSearchInput() {
            applyWeaponSearchFilter();
        }

        function setInterfaceHidden(hidden) {
            isInterfaceHidden = hidden;
            document.body.classList.toggle('interface-hidden', hidden);
            const btn = document.getElementById('focusModeToggle');
            if (btn) {
                btn.textContent = hidden ? t('showUiBtn') : t('hideUiBtn');
            }
        }

        function toggleInterfaceVisibility() {
            setInterfaceHidden(!isInterfaceHidden);
        }

        function updateWeaponTooltipAlignment(weaponElement) {
            const tooltip = weaponElement ? weaponElement.querySelector('.weapon-tooltip') : null;
            if (!tooltip) {
                return;
            }

            tooltip.classList.remove('tooltip-align-left', 'tooltip-align-right');

            const rect = weaponElement.getBoundingClientRect();
            const tooltipWidth = Math.max(tooltip.offsetWidth || 0, 250);
            const viewportPadding = 10;
            const expectedLeft = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            const expectedRight = expectedLeft + tooltipWidth;

            if (expectedLeft < viewportPadding) {
                tooltip.classList.add('tooltip-align-left');
            } else if (expectedRight > window.innerWidth - viewportPadding) {
                tooltip.classList.add('tooltip-align-right');
            }
        }

        function getWeaponIconPath(weapon) {
            const iconOverrides = {
                "Opus: Etch Figure": "оpus etch figure.png",
                "Opus: The Living": "opus_the_living.png"
            };

            if (iconOverrides[weapon]) {
                return `assets/weapons/${iconOverrides[weapon]}`;
            }

            const normalizedName = weapon
                .toLowerCase()
                .replace(/:/g, '')
                .replace(/\s+/g, '_');
            return `assets/weapons/${normalizedName}.png`;
        }

        function initWeapons() {
            const weaponList = document.getElementById('weaponList');
            const weaponsByRarity = {6: [], 5: [], 4: []};
            weaponList.innerHTML = '';

            weapons.forEach(weapon => {
                const rarity = weaponsData[weapon].rarity;
                weaponsByRarity[rarity].push(weapon);
            });

            [6, 5, 4].forEach(rarity => {
                const section = document.createElement('div');
                section.className = 'rarity-section';

                const header = document.createElement('div');
                header.className = 'rarity-header';
                header.innerHTML = `
                    <span class="rarity-stars">${'★'.repeat(rarity)}</span>
                    <span class="rarity-label">${t('rarityLabel', { rarity })}</span>
                    <span class="rarity-toggle ${rarity !== 6 ? 'collapsed' : ''}">▼</span>
                `;
                header.onclick = () => toggleRarity(rarity, header);
                section.appendChild(header);

                const grid = document.createElement('div');
                grid.className = `weapon-list ${rarity !== 6 ? 'collapsed' : ''}`;
                grid.dataset.rarity = rarity;

                weaponsByRarity[rarity].forEach(weapon => {
                    const weaponData = weaponsData[weapon];
                    const div = document.createElement('div');
                    div.className = 'weapon-item';
                    div.dataset.weapon = weapon;
                    const iconPath = getWeaponIconPath(weapon);
                    const localizedWeaponName = getLocalizedWeaponName(weapon);
                    div.innerHTML = `
                        <img src="${iconPath}" alt="${localizedWeaponName}" class="weapon-icon" onerror="this.style.display='none'">
                        <span class="weapon-name">${localizedWeaponName}</span>
                        <div class="weapon-tooltip">
                            <div class="tooltip-stat">
                                <span class="tooltip-label">${t('tooltipAttribute')}</span>
                                <span class="tooltip-value">${getLocalizedStatName('attribute', weaponData.attribute_stats)}</span>
                            </div>
                            <div class="tooltip-stat">
                                <span class="tooltip-label">${t('tooltipSecondary')}</span>
                                <span class="tooltip-value">${getLocalizedStatName('secondary', weaponData.secondary_stats)}</span>
                            </div>
                            <div class="tooltip-stat">
                                <span class="tooltip-label">${t('tooltipSkill')}</span>
                                <span class="tooltip-value">${getLocalizedStatName('skill', weaponData.skill_stats)}</span>
                            </div>
                        </div>
                    `;
                    div.onclick = (e) => toggleWeapon(weapon, div, e);
                    div.oncontextmenu = (e) => {
                        e.preventDefault();
                        toggleEssence(weapon, div, e);
                    };
                    div.onmouseenter = () => updateWeaponTooltipAlignment(div);
                    grid.appendChild(div);
                });

                section.appendChild(grid);
                weaponList.appendChild(section);
            });

            requestAnimationFrame(refreshWeaponListHeights);
            updateMainWeaponList();
            highlightMatchingWeapons();
            applyWeaponSearchFilter();
        }

        function toggleWeapon(weapon, element, interactionEvent) {
            if (state.essenceReady.has(weapon)) {
                return;
            }

            triggerWeaponClickFill(element, interactionEvent);
            
            if (state.ownedWeapons.has(weapon)) {
                state.ownedWeapons.delete(weapon);
                element.classList.remove('selected');
            } else {
                state.ownedWeapons.add(weapon);
                element.classList.add('selected');
            }
            
            autoSelectStats();
        }

        function toggleEssence(weapon, element, interactionEvent) {
            triggerWeaponClickFill(element, interactionEvent);

            if (state.essenceReady.has(weapon)) {
                state.essenceReady.delete(weapon);
                state.ownedWeapons.delete(weapon);
                element.classList.remove('has-essence');
                element.classList.remove('selected');
            } else {
                state.essenceReady.add(weapon);
                state.ownedWeapons.add(weapon);
                element.classList.add('has-essence');
                element.classList.remove('selected');
            }
            
            autoSelectStats();
        }

        function initStats() {
            const allStats = {
                attribute: new Set(),
                secondary: new Set(),
                skill: new Set()
            };

            Object.values(locationsData).forEach(location => {
                location.attribute_stats.forEach(stat => allStats.attribute.add(stat));
                location.secondary_stats.forEach(stat => allStats.secondary.add(stat));
                location.skill_stats.forEach(stat => allStats.skill.add(stat));
            });

            const attributeContainer = document.getElementById('attributeStats');
            Array.from(allStats.attribute).sort().forEach(stat => {
                const chip = document.createElement('div');
                chip.className = 'stat-chip';
                chip.dataset.statKey = stat;
                chip.textContent = getLocalizedStatName('attribute', stat);
                chip.onclick = () => toggleAttributeStat(stat, chip);
                attributeContainer.appendChild(chip);
            });

            const secondaryContainer = document.getElementById('secondaryStats');
            Array.from(allStats.secondary).sort().forEach(stat => {
                const chip = document.createElement('div');
                chip.className = 'stat-chip';
                chip.dataset.statKey = stat;
                chip.textContent = getLocalizedStatName('secondary', stat);
                chip.onclick = () => toggleSecondaryStat(stat, chip);
                secondaryContainer.appendChild(chip);
            });

            const skillContainer = document.getElementById('skillStats');
            Array.from(allStats.skill).sort().forEach(stat => {
                const chip = document.createElement('div');
                chip.className = 'stat-chip';
                chip.dataset.statKey = stat;
                chip.textContent = getLocalizedStatName('skill', stat);
                chip.onclick = () => toggleSkillStat(stat, chip);
                skillContainer.appendChild(chip);
            });
        }

        function toggleAttributeStat(stat, element) {
            if (element.classList.contains('disabled')) {
                return;
            }

            element.classList.remove('auto-selected');

            if (state.selectedAttributeStats.has(stat)) {
                state.selectedAttributeStats.delete(stat);
                element.classList.remove('selected');
            } else if (state.selectedAttributeStats.size < 3) {
                state.selectedAttributeStats.add(stat);
                element.classList.add('selected');
            }
            highlightMatchingWeapons();
            updateCalculateButton();
            resetWeaponSelectionsAfterStatClear();
        }

        function toggleSecondaryStat(stat, element) {
            if (element.classList.contains('disabled')) {
                return;
            }

            const container = document.getElementById('secondaryStats');
            const wasSelected = state.selectedSecondaryStat === stat;
            container.querySelectorAll('.stat-chip').forEach(chip => {
                chip.classList.remove('selected', 'auto-selected');
            });

            if (wasSelected) {
                state.selectedSecondaryStat = null;
            } else {
                state.selectedSecondaryStat = stat;
                element.classList.add('selected');
            }
            highlightMatchingWeapons();
            updateCalculateButton();
            resetWeaponSelectionsAfterStatClear();
        }

        function toggleSkillStat(stat, element) {
            if (element.classList.contains('disabled')) {
                return;
            }

            const container = document.getElementById('skillStats');
            const wasSelected = state.selectedSkillStat === stat;
            container.querySelectorAll('.stat-chip').forEach(chip => {
                chip.classList.remove('selected', 'auto-selected');
            });

            if (wasSelected) {
                state.selectedSkillStat = null;
            } else {
                state.selectedSkillStat = stat;
                element.classList.add('selected');
            }
            highlightMatchingWeapons();
            updateCalculateButton();
            resetWeaponSelectionsAfterStatClear();
        }

        function highlightMatchingWeapons() {
            const weaponItems = document.querySelectorAll('.weapon-item');
            const hasAnySelectedStat = state.selectedAttributeStats.size > 0 ||
                state.selectedSecondaryStat !== null ||
                state.selectedSkillStat !== null;
            
            weaponItems.forEach(item => {
                const weaponName = item.dataset.weapon;
                if (!weaponName) {
                    return;
                }
                const weaponData = weaponsData[weaponName];
                
                // Remove previous highlight
                item.style.boxShadow = '';

                // If no stats are selected, keep list unhighlighted.
                if (!hasAnySelectedStat) {
                    return;
                }
                
                // Don't highlight if weapon is already selected
                if (state.ownedWeapons.has(weaponName)) {
                    return;
                }
                
                // Check if weapon matches selected stats
                const attributeMatch = state.selectedAttributeStats.size === 0 || 
                    state.selectedAttributeStats.has(weaponData.attribute_stats);
                
                const secondaryMatch = !state.selectedSecondaryStat || 
                    weaponData.secondary_stats === state.selectedSecondaryStat;
                
                const skillMatch = !state.selectedSkillStat || 
                    weaponData.skill_stats === state.selectedSkillStat;
                
                if (attributeMatch && secondaryMatch && skillMatch) {
                    item.style.boxShadow = '0 0 0 3px var(--color-warning)';
                }
            });
        }

        function updateSecondaryStatsAvailability(available) {
            const container = document.getElementById('secondaryStats');
            container.querySelectorAll('.stat-chip').forEach(chip => {
                if (!chip.classList.contains('auto-selected')) {
                    if (available) {
                        chip.classList.remove('disabled');
                    } else {
                        chip.classList.add('disabled');
                    }
                }
            });
        }

        function updateSkillStatsAvailability(available) {
            const container = document.getElementById('skillStats');
            container.querySelectorAll('.stat-chip').forEach(chip => {
                if (!chip.classList.contains('auto-selected')) {
                    if (available) {
                        chip.classList.remove('disabled');
                    } else {
                        chip.classList.add('disabled');
                    }
                }
            });
        }

        function refreshResultsAfterSelectionChange() {
            const resultsSection = document.getElementById('resultsSection');
            if (!resultsSection.classList.contains('visible')) {
                return;
            }

            const weaponsNeedingEssence = Array.from(state.ownedWeapons)
                .filter(weapon => !state.essenceReady.has(weapon));

            if (state.ownedWeapons.size > 0 && weaponsNeedingEssence.length === 0) {
                showNoResults(t('noResultsAllFarmed'), { scrollToResults: false });
                return;
            }

            const btn = document.getElementById('calculateBtn');
            if (btn.disabled) {
                resultsSection.classList.remove('visible');
                return;
            }

            calculateBestLocation({ scrollToResults: false });
        }

        function resetWeaponSelectionsAfterStatClear() {
            const noSelectedStats = state.selectedAttributeStats.size === 0 &&
                state.selectedSecondaryStat === null &&
                state.selectedSkillStat === null;
            if (!noSelectedStats) {
                return;
            }

            document.querySelectorAll('.weapon-item').forEach(item => {
                item.style.boxShadow = '';
            });

            if (state.ownedWeapons.size === 0 && state.essenceReady.size === 0) {
                return;
            }

            // Keep "essence ready" weapons (green) and clear only farm targets (blue).
            Array.from(state.ownedWeapons).forEach(weapon => {
                if (!state.essenceReady.has(weapon)) {
                    state.ownedWeapons.delete(weapon);
                }
            });

            updateMainWeaponList();

            document.getElementById('resultsSection').classList.remove('visible');
            updateCalculateButton();
        }

        function autoSelectStats() {
            const weaponsNeedingEssence = Array.from(state.ownedWeapons)
                .filter(weapon => !state.essenceReady.has(weapon));

            state.selectedAttributeStats.clear();
            state.selectedSecondaryStat = null;
            state.selectedSkillStat = null;

            document.querySelectorAll('.stat-chip').forEach(chip => {
                chip.classList.remove('selected', 'auto-selected', 'disabled');
            });

            // Clear weapon highlights
            document.querySelectorAll('.weapon-item').forEach(item => {
                item.style.boxShadow = '';
            });

            if (weaponsNeedingEssence.length === 0) {
                updateCalculateButton();
                refreshResultsAfterSelectionChange();
                return;
            }

            const statCounts = {
                attribute: {},
                secondary: {},
                skill: {}
            };

            weaponsNeedingEssence.forEach(weapon => {
                const weaponData = weaponsData[weapon];
                statCounts.attribute[weaponData.attribute_stats] = (statCounts.attribute[weaponData.attribute_stats] || 0) + 1;
                statCounts.secondary[weaponData.secondary_stats] = (statCounts.secondary[weaponData.secondary_stats] || 0) + 1;
                statCounts.skill[weaponData.skill_stats] = (statCounts.skill[weaponData.skill_stats] || 0) + 1;
            });

            const sortedAttributes = Object.entries(statCounts.attribute)
                .sort((a, b) => b[1] - a[1])
                .map(([stat]) => stat);

            const allAttributes = ["Agility Boost", "Strength Boost", "Will Boost", "Intellect Boost", "Main Attribute Boost"];
            const selectedAttributes = sortedAttributes.slice(0, Math.min(3, sortedAttributes.length));
            
            if (selectedAttributes.length < 3) {
                const remaining = allAttributes.filter(attr => !selectedAttributes.includes(attr));
                selectedAttributes.push(...remaining.slice(0, 3 - selectedAttributes.length));
            }

            selectedAttributes.forEach(stat => {
                state.selectedAttributeStats.add(stat);
                const chip = Array.from(document.getElementById('attributeStats').children)
                    .find(el => el.dataset.statKey === stat);
                if (chip) chip.classList.add('auto-selected');
            });

            const uniqueSecondaryStats = new Set(Object.keys(statCounts.secondary));
            const uniqueSkillStats = new Set(Object.keys(statCounts.skill));

            if (uniqueSecondaryStats.size === 1 && uniqueSkillStats.size > 1) {
                const onlySecondaryStat = Array.from(uniqueSecondaryStats)[0];
                state.selectedSecondaryStat = onlySecondaryStat;
                const chip = Array.from(document.getElementById('secondaryStats').children)
                    .find(el => el.dataset.statKey === onlySecondaryStat);
                if (chip) {
                    chip.classList.add('auto-selected');
                }
            } else if (uniqueSkillStats.size === 1 && uniqueSecondaryStats.size > 1) {
                const onlySkillStat = Array.from(uniqueSkillStats)[0];
                state.selectedSkillStat = onlySkillStat;
                const chip = Array.from(document.getElementById('skillStats').children)
                    .find(el => el.dataset.statKey === onlySkillStat);
                if (chip) {
                    chip.classList.add('auto-selected');
                }
            } else if (uniqueSecondaryStats.size === 1 && uniqueSkillStats.size === 1) {
                const onlySecondaryStat = Array.from(uniqueSecondaryStats)[0];
                state.selectedSecondaryStat = onlySecondaryStat;
                const chip = Array.from(document.getElementById('secondaryStats').children)
                    .find(el => el.dataset.statKey === onlySecondaryStat);
                if (chip) {
                    chip.classList.add('auto-selected');
                }
            } else {
                const sortedSecondaryStats = Object.entries(statCounts.secondary)
                    .sort((a, b) => b[1] - a[1]);
                const sortedSkillStats = Object.entries(statCounts.skill)
                    .sort((a, b) => b[1] - a[1]);

                const topSecondaryCount = sortedSecondaryStats[0] ? sortedSecondaryStats[0][1] : 0;
                const topSkillCount = sortedSkillStats[0] ? sortedSkillStats[0][1] : 0;

                if (topSkillCount > topSecondaryCount) {
                    const topSkillStat = sortedSkillStats[0];
                    state.selectedSkillStat = topSkillStat[0];
                    const chip = Array.from(document.getElementById('skillStats').children)
                        .find(el => el.dataset.statKey === topSkillStat[0]);
                    if (chip) {
                        chip.classList.add('auto-selected');
                    }
                } else if (topSecondaryCount > topSkillCount) {
                    const topSecondaryStat = sortedSecondaryStats[0];
                    state.selectedSecondaryStat = topSecondaryStat[0];
                    const chip = Array.from(document.getElementById('secondaryStats').children)
                        .find(el => el.dataset.statKey === topSecondaryStat[0]);
                    if (chip) {
                        chip.classList.add('auto-selected');
                    }
                } else {
                    const topSecondaryStat = sortedSecondaryStats[0];
                    state.selectedSecondaryStat = topSecondaryStat[0];
                    const chip = Array.from(document.getElementById('secondaryStats').children)
                        .find(el => el.dataset.statKey === topSecondaryStat[0]);
                    if (chip) {
                        chip.classList.add('auto-selected');
                    }
                }
            }

            updateCalculateButton();
            refreshResultsAfterSelectionChange();
        }

        function updateCalculateButton() {
            const btn = document.getElementById('calculateBtn');
            const weaponsNeedingEssence = Array.from(state.ownedWeapons)
                .filter(weapon => !state.essenceReady.has(weapon));
            const hasStatPairSelection = state.selectedSecondaryStat !== null || state.selectedSkillStat !== null;
            const hasValidSelection = state.selectedAttributeStats.size === 3 && hasStatPairSelection;

            btn.disabled = weaponsNeedingEssence.length === 0 || !hasValidSelection;
        }

        function getRecommendedStatsForWeapons(targetWeapons) {
            const statCounts = {
                attribute: {},
                secondary: {},
                skill: {}
            };

            targetWeapons.forEach(weapon => {
                const weaponData = weaponsData[weapon];
                statCounts.attribute[weaponData.attribute_stats] = (statCounts.attribute[weaponData.attribute_stats] || 0) + 1;
                statCounts.secondary[weaponData.secondary_stats] = (statCounts.secondary[weaponData.secondary_stats] || 0) + 1;
                statCounts.skill[weaponData.skill_stats] = (statCounts.skill[weaponData.skill_stats] || 0) + 1;
            });

            const sortedAttributes = Object.entries(statCounts.attribute)
                .sort((a, b) => b[1] - a[1])
                .map(([stat]) => stat);

            const allAttributes = ["Agility Boost", "Strength Boost", "Will Boost", "Intellect Boost", "Main Attribute Boost"];
            const selectedAttributes = sortedAttributes.slice(0, Math.min(3, sortedAttributes.length));

            if (selectedAttributes.length < 3) {
                const remaining = allAttributes.filter(attr => !selectedAttributes.includes(attr));
                selectedAttributes.push(...remaining.slice(0, 3 - selectedAttributes.length));
            }

            const sortedSecondaryStats = Object.entries(statCounts.secondary)
                .sort((a, b) => b[1] - a[1]);
            const sortedSkillStats = Object.entries(statCounts.skill)
                .sort((a, b) => b[1] - a[1]);

            const topSecondaryCount = sortedSecondaryStats[0] ? sortedSecondaryStats[0][1] : 0;
            const topSkillCount = sortedSkillStats[0] ? sortedSkillStats[0][1] : 0;

            let secondary = null;
            let skill = null;

            if (topSkillCount > topSecondaryCount) {
                skill = sortedSkillStats[0][0];
            } else {
                secondary = sortedSecondaryStats[0][0];
            }

            return {
                attribute: selectedAttributes,
                secondary,
                skill
            };
        }

        function getLocationScores(targetWeapons, desiredStats, options = {}) {
            const matchingWeapons = targetWeapons.filter(weapon => {
                const weaponData = weaponsData[weapon];
                const attributeMatch = desiredStats.attribute.includes(weaponData.attribute_stats);
                const secondaryMatch = desiredStats.secondary ?
                    weaponData.secondary_stats === desiredStats.secondary : true;
                const skillMatch = desiredStats.skill ?
                    weaponData.skill_stats === desiredStats.skill : true;

                return attributeMatch && secondaryMatch && skillMatch;
            });

            const strictDesiredStats = options.strictDesiredStats === true;
            const poolWeapons = (strictDesiredStats || matchingWeapons.length > 0) ? matchingWeapons : targetWeapons;

            const locationScores = Object.entries(locationsData).map(([name, location]) => {
                const locationMatchingWeapons = poolWeapons.filter(weapon => {
                    const weaponData = weaponsData[weapon];
                    const hasAttribute = location.attribute_stats.includes(weaponData.attribute_stats);
                    const hasSecondary = location.secondary_stats.includes(weaponData.secondary_stats);
                    const hasSkill = location.skill_stats.includes(weaponData.skill_stats);
                    return hasAttribute && hasSecondary && hasSkill;
                });

                const matchedAttributes = desiredStats.attribute.filter(stat =>
                    location.attribute_stats.includes(stat)
                );

                const hasSecondaryStat = desiredStats.secondary ?
                    location.secondary_stats.includes(desiredStats.secondary) : false;
                const hasSkillStat = desiredStats.skill ?
                    location.skill_stats.includes(desiredStats.skill) : false;

                const extraStatMatchCount = (hasSecondaryStat ? 1 : 0) + (hasSkillStat ? 1 : 0);
                const selectedExtraStatsCount = (desiredStats.secondary ? 1 : 0) + (desiredStats.skill ? 1 : 0);
                const matchedWeaponsCount = locationMatchingWeapons.length;
                const totalWeaponsCount = poolWeapons.length;
                const weaponMatchPercentage = totalWeaponsCount > 0
                    ? Math.round((matchedWeaponsCount / totalWeaponsCount) * 100)
                    : 0;

                const statMatchCount = matchedAttributes.length + extraStatMatchCount;
                const totalPossibleStats = desiredStats.attribute.length + selectedExtraStatsCount;

                return {
                    name,
                    matchedAttributes,
                    hasSecondaryStat,
                    hasSkillStat,
                    secondaryStat: desiredStats.secondary,
                    skillStat: desiredStats.skill,
                    weaponMatchPercentage,
                    matchedWeaponsCount,
                    totalWeaponsCount,
                    statMatchCount,
                    totalPossibleStats,
                    locationMatchingWeapons,
                    location
                };
            });

            locationScores.sort((a, b) => {
                if (b.weaponMatchPercentage !== a.weaponMatchPercentage) {
                    return b.weaponMatchPercentage - a.weaponMatchPercentage;
                }

                return b.statMatchCount - a.statMatchCount;
            });

            return {
                scores: locationScores,
                targetedWeapons: poolWeapons
            };
        }

        function calculateBestLocation(options = {}) {
            const scrollToResults = options.scrollToResults !== false;
            const weaponsNeedingEssence = Array.from(state.ownedWeapons)
                .filter(weapon => !state.essenceReady.has(weapon));

            if (weaponsNeedingEssence.length === 0) {
                if (state.ownedWeapons.size === 0) {
                    showNoResults(t('noResultsSelectWeapon'), { scrollToResults });
                } else {
                    showNoResults(t('noResultsAllFarmed'), { scrollToResults });
                }
                return;
            }

            const desiredStats = {
                attribute: Array.from(state.selectedAttributeStats),
                secondary: state.selectedSecondaryStat,
                skill: state.selectedSkillStat
            };

            const hasValidSelection = desiredStats.attribute.length === 3 &&
                (desiredStats.secondary || desiredStats.skill);

            if (!hasValidSelection) {
                showNoResults(t('noResultsInvalidSelection'), { scrollToResults });
                return;
            }

            const allAttributes = ["Agility Boost", "Strength Boost", "Will Boost", "Intellect Boost", "Main Attribute Boost"];
            const preferredExtraStats = [];
            if (desiredStats.secondary) {
                preferredExtraStats.push({ type: 'secondary', value: desiredStats.secondary });
            }
            if (desiredStats.skill) {
                preferredExtraStats.push({ type: 'skill', value: desiredStats.skill });
            }

            const isPreferredExtraCandidate = (candidate) => {
                return preferredExtraStats.some(
                    preferred => preferred.type === candidate.type && preferred.value === candidate.value
                );
            };

            const getExtraCandidates = (weaponPool) => {
                const secondaryCounts = {};
                const skillCounts = {};

                weaponPool.forEach(weapon => {
                    const weaponData = weaponsData[weapon];
                    secondaryCounts[weaponData.secondary_stats] = (secondaryCounts[weaponData.secondary_stats] || 0) + 1;
                    skillCounts[weaponData.skill_stats] = (skillCounts[weaponData.skill_stats] || 0) + 1;
                });

                const candidates = [];
                Object.entries(secondaryCounts).forEach(([value, count]) => {
                    candidates.push({ type: 'secondary', value, count });
                });
                Object.entries(skillCounts).forEach(([value, count]) => {
                    candidates.push({ type: 'skill', value, count });
                });

                candidates.sort((a, b) => {
                    const aPreferred = isPreferredExtraCandidate(a) ? 1 : 0;
                    const bPreferred = isPreferredExtraCandidate(b) ? 1 : 0;
                    if (bPreferred !== aPreferred) {
                        return bPreferred - aPreferred;
                    }
                    if (b.count !== a.count) {
                        return b.count - a.count;
                    }
                    if (a.type !== b.type) {
                        return a.type.localeCompare(b.type);
                    }
                    return a.value.localeCompare(b.value);
                });

                return candidates;
            };

            const getBestAttributesForLocation = (candidateWeapons, location) => {
                const allowedAttributes = allAttributes.filter(attr => location.attribute_stats.includes(attr));
                const attributeCounts = {};

                allowedAttributes.forEach(attr => {
                    attributeCounts[attr] = 0;
                });

                candidateWeapons.forEach(weapon => {
                    const attr = weaponsData[weapon].attribute_stats;
                    if (Object.prototype.hasOwnProperty.call(attributeCounts, attr)) {
                        attributeCounts[attr] += 1;
                    }
                });

                const sortedAttributes = [...allowedAttributes].sort((a, b) => {
                    if (attributeCounts[b] !== attributeCounts[a]) {
                        return attributeCounts[b] - attributeCounts[a];
                    }
                    const aPreferred = desiredStats.attribute.includes(a) ? 1 : 0;
                    const bPreferred = desiredStats.attribute.includes(b) ? 1 : 0;
                    if (bPreferred !== aPreferred) {
                        return bPreferred - aPreferred;
                    }
                    return a.localeCompare(b);
                });

                const selectedAttributes = sortedAttributes.slice(0, Math.min(3, sortedAttributes.length));

                if (selectedAttributes.length < 3) {
                    const preferredFill = desiredStats.attribute.filter(attr =>
                        allowedAttributes.includes(attr) && !selectedAttributes.includes(attr)
                    );
                    selectedAttributes.push(...preferredFill.slice(0, 3 - selectedAttributes.length));
                }

                if (selectedAttributes.length < 3) {
                    const allowedFill = allowedAttributes.filter(attr => !selectedAttributes.includes(attr));
                    selectedAttributes.push(...allowedFill.slice(0, 3 - selectedAttributes.length));
                }

                if (selectedAttributes.length < 3) {
                    const globalFill = allAttributes.filter(attr => !selectedAttributes.includes(attr));
                    selectedAttributes.push(...globalFill.slice(0, 3 - selectedAttributes.length));
                }

                return selectedAttributes.slice(0, 3);
            };

            const isBetterLocationChoice = (candidateResult, currentBest) => {
                if (!currentBest) {
                    return true;
                }

                const candidateScore = candidateResult.bestLocation;
                const currentScore = currentBest.bestLocation;

                if (candidateScore.matchedWeaponsCount !== currentScore.matchedWeaponsCount) {
                    return candidateScore.matchedWeaponsCount > currentScore.matchedWeaponsCount;
                }
                if (candidateScore.weaponMatchPercentage !== currentScore.weaponMatchPercentage) {
                    return candidateScore.weaponMatchPercentage > currentScore.weaponMatchPercentage;
                }
                if (candidateScore.statMatchCount !== currentScore.statMatchCount) {
                    return candidateScore.statMatchCount > currentScore.statMatchCount;
                }
                return candidateScore.name.localeCompare(currentScore.name) < 0;
            };

            const evaluateExtraCandidate = (weaponPool, extraCandidate) => {
                const candidateWeapons = weaponPool.filter(weapon => {
                    const weaponData = weaponsData[weapon];
                    return extraCandidate.type === 'secondary'
                        ? weaponData.secondary_stats === extraCandidate.value
                        : weaponData.skill_stats === extraCandidate.value;
                });

                if (candidateWeapons.length === 0) {
                    return null;
                }

                let bestResult = null;

                Object.entries(locationsData).forEach(([locationName, location]) => {
                    const hasExtraStat = extraCandidate.type === 'secondary'
                        ? location.secondary_stats.includes(extraCandidate.value)
                        : location.skill_stats.includes(extraCandidate.value);

                    if (!hasExtraStat) {
                        return;
                    }

                    const locationCompatibleWeapons = candidateWeapons.filter(weapon => {
                        const weaponData = weaponsData[weapon];
                        return location.attribute_stats.includes(weaponData.attribute_stats) &&
                            location.secondary_stats.includes(weaponData.secondary_stats) &&
                            location.skill_stats.includes(weaponData.skill_stats);
                    });

                    if (locationCompatibleWeapons.length === 0) {
                        return;
                    }

                    const selectedAttributes = getBestAttributesForLocation(locationCompatibleWeapons, location);
                    const locationMatchingWeapons = locationCompatibleWeapons.filter(weapon =>
                        selectedAttributes.includes(weaponsData[weapon].attribute_stats)
                    );

                    if (locationMatchingWeapons.length === 0) {
                        return;
                    }

                    const desiredGroupStats = {
                        attribute: selectedAttributes,
                        secondary: extraCandidate.type === 'secondary' ? extraCandidate.value : null,
                        skill: extraCandidate.type === 'skill' ? extraCandidate.value : null
                    };

                    const matchedAttributes = desiredGroupStats.attribute.filter(stat =>
                        location.attribute_stats.includes(stat)
                    );
                    const hasSecondaryStat = desiredGroupStats.secondary
                        ? location.secondary_stats.includes(desiredGroupStats.secondary)
                        : false;
                    const hasSkillStat = desiredGroupStats.skill
                        ? location.skill_stats.includes(desiredGroupStats.skill)
                        : false;
                    const extraStatMatchCount = (hasSecondaryStat ? 1 : 0) + (hasSkillStat ? 1 : 0);
                    const totalWeaponsCount = candidateWeapons.length;
                    const matchedWeaponsCount = locationMatchingWeapons.length;
                    const weaponMatchPercentage = totalWeaponsCount > 0
                        ? Math.round((matchedWeaponsCount / totalWeaponsCount) * 100)
                        : 0;

                    const locationScore = {
                        name: locationName,
                        matchedAttributes,
                        hasSecondaryStat,
                        hasSkillStat,
                        secondaryStat: desiredGroupStats.secondary,
                        skillStat: desiredGroupStats.skill,
                        statMatchCount: matchedAttributes.length + extraStatMatchCount,
                        totalPossibleStats: desiredGroupStats.attribute.length + 1,
                        weaponMatchPercentage,
                        matchedWeaponsCount,
                        totalWeaponsCount,
                        locationMatchingWeapons,
                        location
                    };

                    const candidateResult = {
                        weapons: locationMatchingWeapons,
                        desiredStats: desiredGroupStats,
                        bestLocation: locationScore,
                        extraCandidate,
                        candidatePoolSize: candidateWeapons.length
                    };

                    if (isBetterLocationChoice(candidateResult, bestResult)) {
                        bestResult = candidateResult;
                    }
                });

                return bestResult;
            };

            const isBetterGroupChoice = (candidateResult, currentBest) => {
                if (!currentBest) {
                    return true;
                }

                const candidateScore = candidateResult.bestLocation;
                const currentScore = currentBest.bestLocation;

                if (candidateScore.matchedWeaponsCount !== currentScore.matchedWeaponsCount) {
                    return candidateScore.matchedWeaponsCount > currentScore.matchedWeaponsCount;
                }
                if (candidateResult.candidatePoolSize !== currentBest.candidatePoolSize) {
                    return candidateResult.candidatePoolSize > currentBest.candidatePoolSize;
                }

                const candidatePreferred = isPreferredExtraCandidate(candidateResult.extraCandidate) ? 1 : 0;
                const currentPreferred = isPreferredExtraCandidate(currentBest.extraCandidate) ? 1 : 0;
                if (candidatePreferred !== currentPreferred) {
                    return candidatePreferred > currentPreferred;
                }

                if (candidateScore.weaponMatchPercentage !== currentScore.weaponMatchPercentage) {
                    return candidateScore.weaponMatchPercentage > currentScore.weaponMatchPercentage;
                }
                if (candidateScore.statMatchCount !== currentScore.statMatchCount) {
                    return candidateScore.statMatchCount > currentScore.statMatchCount;
                }
                return candidateScore.name.localeCompare(currentScore.name) < 0;
            };

            const farmPlan = [];
            let remainingCandidateWeapons = [...weaponsNeedingEssence];

            while (remainingCandidateWeapons.length > 0) {
                const extraCandidates = getExtraCandidates(remainingCandidateWeapons);
                let bestGroup = null;

                extraCandidates.forEach(extraCandidate => {
                    const evaluatedCandidate = evaluateExtraCandidate(remainingCandidateWeapons, extraCandidate);
                    if (!evaluatedCandidate) {
                        return;
                    }
                    if (isBetterGroupChoice(evaluatedCandidate, bestGroup)) {
                        bestGroup = evaluatedCandidate;
                    }
                });

                if (!bestGroup || bestGroup.weapons.length === 0) {
                    const fallbackWeapon = remainingCandidateWeapons[0];
                    const fallbackData = weaponsData[fallbackWeapon];
                    const fallbackLocationEntry = Object.entries(locationsData).find(([, location]) => {
                        return location.attribute_stats.includes(fallbackData.attribute_stats) &&
                            location.secondary_stats.includes(fallbackData.secondary_stats) &&
                            location.skill_stats.includes(fallbackData.skill_stats);
                    });

                    if (!fallbackLocationEntry) {
                        showNoResults(t('noResultsNoLocation', { weapons: remainingCandidateWeapons.map(getLocalizedWeaponName).join(', ') }), { scrollToResults });
                        return;
                    }

                    const [fallbackLocationName, fallbackLocation] = fallbackLocationEntry;
                    const fallbackAttributes = getBestAttributesForLocation([fallbackWeapon], fallbackLocation);
                    const fallbackDesiredStats = {
                        attribute: fallbackAttributes,
                        secondary: fallbackData.secondary_stats,
                        skill: null
                    };
                    const fallbackBest = {
                        name: fallbackLocationName,
                        matchedAttributes: fallbackAttributes.filter(stat => fallbackLocation.attribute_stats.includes(stat)),
                        hasSecondaryStat: true,
                        hasSkillStat: false,
                        secondaryStat: fallbackDesiredStats.secondary,
                        skillStat: fallbackDesiredStats.skill,
                        statMatchCount: fallbackAttributes.length + 1,
                        totalPossibleStats: fallbackAttributes.length + 1,
                        weaponMatchPercentage: 100,
                        matchedWeaponsCount: 1,
                        totalWeaponsCount: 1,
                        locationMatchingWeapons: [fallbackWeapon],
                        location: fallbackLocation
                    };

                    farmPlan.push({
                        weapons: [fallbackWeapon],
                        desiredStats: fallbackDesiredStats,
                        bestLocation: fallbackBest
                    });

                    remainingCandidateWeapons = remainingCandidateWeapons.filter(weapon => weapon !== fallbackWeapon);
                    continue;
                }

                const groupWeapons = [...bestGroup.weapons];

                farmPlan.push({
                    weapons: groupWeapons,
                    desiredStats: bestGroup.desiredStats,
                    bestLocation: bestGroup.bestLocation
                });

                remainingCandidateWeapons = remainingCandidateWeapons.filter(
                    weapon => !groupWeapons.includes(weapon)
                );
            }

            displayResults(farmPlan, { scrollToResults });
        }

        function displayResults(farmPlan, options = {}) {
            const scrollToResults = options.scrollToResults !== false;
            const resultsSection = document.getElementById('resultsSection');
            const resultsContainer = document.getElementById('resultsContainer');

            resultsContainer.innerHTML = '';

            farmPlan.forEach((step, index) => {
                const section = document.createElement('div');
                section.className = 'result-group';
                section.style.animationDelay = `${index * 90}ms`;
                const localizedGroupStats = [
                    ...step.desiredStats.attribute.map(stat => getLocalizedStatName('attribute', stat)),
                    step.desiredStats.secondary ? getLocalizedStatName('secondary', step.desiredStats.secondary) : null,
                    step.desiredStats.skill ? getLocalizedStatName('skill', step.desiredStats.skill) : null
                ].filter(Boolean).join(', ');

                section.innerHTML = `
                    <h3 style="margin: 18px 0 8px 0; color: ${index === 0 ? 'var(--color-success)' : 'var(--color-warning)'};">
                        ${index === 0 ? t('groupBest') : t('groupN', { index: index + 1 })} (${t('groupStats', { stats: localizedGroupStats })})
                    </h3>
                `;

                const loc = step.bestLocation;
                const card = document.createElement('div');
                card.className = `location-card ${index === 0 ? 'best' : ''}`;

                let statsHTML = '';

                if (step.weapons && step.weapons.length > 0) {
                    statsHTML += `
                        <div style="margin-bottom: 12px; padding: 8px; background: rgba(56, 189, 248, 0.1); border-radius: 6px;">
                            <strong style="color: var(--color-accent);">${t('weaponsInGroup', { count: step.weapons.length })}</strong>
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; margin-top: 8px;">
                                ${step.weapons.map(weapon => {
                                    const iconPath = getWeaponIconPath(weapon);
                                    const localizedWeaponName = getLocalizedWeaponName(weapon);
                                    const isSelected = state.ownedWeapons.has(weapon);
                                    const hasEssence = state.essenceReady.has(weapon);
                                    const classes = hasEssence ? 'has-essence' : (isSelected ? 'selected' : '');
                                    return `
                                        <div class="result-weapon-item ${classes}" data-weapon="${weapon}">
                                            <img src="${iconPath}" alt="${localizedWeaponName}" style="width: 60px; height: 60px; object-fit: contain;" onerror="this.style.display='none'">
                                            <span style="font-size: 0.75rem; text-align: center; line-height: 1.2;">${localizedWeaponName}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }

                statsHTML += '<div class="stat-matches">';
                statsHTML += `
                    <div class="stat-match-row">
                        <span class="stat-category">${t('attrStatsLabel')}</span>
                        <div class="stat-list">
                            ${step.desiredStats.attribute.map(stat => {
                                const isMatch = loc.matchedAttributes.includes(stat);
                                return `<span class="stat-badge ${isMatch ? 'match' : ''}">${getLocalizedStatName('attribute', stat)}</span>`;
                            }).join('')}
                        </div>
                    </div>
                `;

                if (loc.secondaryStat) {
                    statsHTML += `
                        <div class="stat-match-row">
                            <span class="stat-category">${t('secondaryStatLabel')}</span>
                            <div class="stat-list">
                                <span class="stat-badge ${loc.hasSecondaryStat ? 'match' : ''}">${getLocalizedStatName('secondary', loc.secondaryStat)}</span>
                            </div>
                        </div>
                    `;
                }

                if (loc.skillStat) {
                    statsHTML += `
                        <div class="stat-match-row">
                            <span class="stat-category">${t('skillStatLabel')}</span>
                            <div class="stat-list">
                                <span class="stat-badge ${loc.hasSkillStat ? 'match' : ''}">${getLocalizedStatName('skill', loc.skillStat)}</span>
                            </div>
                        </div>
                    `;
                }

                statsHTML += '</div>';

                card.innerHTML = `
                    <div class="location-spotlight ${index === 0 ? 'best' : ''}">
                        <span class="location-spotlight-label">${index === 0 ? t('locationSpotlightBest') : t('locationSpotlightGroup')}</span>
                        <span class="location-spotlight-name">${getLocalizedLocationName(loc.name)}</span>
                    </div>
                    <div class="location-header">
                        <span class="location-name">${t('coverageTitle')}</span>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span class="match-score">${t('scoreWeapons', { percentage: loc.weaponMatchPercentage, matched: loc.matchedWeaponsCount, total: loc.totalWeaponsCount })}</span>
                            <span class="match-score">${t('scoreStats', { matched: loc.statMatchCount, total: loc.totalPossibleStats })}</span>
                        </div>
                    </div>
                    ${statsHTML}
                `;

                section.appendChild(card);
                resultsContainer.appendChild(section);
            });

            resultsSection.classList.add('visible');
            if (scrollToResults) {
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            document.querySelectorAll('.result-weapon-item').forEach(item => {
                const weaponName = item.dataset.weapon;

                item.onclick = () => {
                    if (state.essenceReady.has(weaponName)) {
                        return;
                    }

                    if (state.ownedWeapons.has(weaponName)) {
                        state.ownedWeapons.delete(weaponName);
                        item.classList.remove('selected');
                    } else {
                        state.ownedWeapons.add(weaponName);
                        item.classList.add('selected');
                    }

                    updateMainWeaponList();
                    autoSelectStats();
                };

                item.oncontextmenu = (e) => {
                    e.preventDefault();

                    if (state.essenceReady.has(weaponName)) {
                        state.essenceReady.delete(weaponName);
                        state.ownedWeapons.delete(weaponName);
                        item.classList.remove('has-essence');
                        item.classList.remove('selected');
                    } else {
                        state.essenceReady.add(weaponName);
                        state.ownedWeapons.add(weaponName);
                        item.classList.add('has-essence');
                        item.classList.remove('selected');
                    }

                    updateMainWeaponList();
                    autoSelectStats();
                };
            });
        }

        function updateMainWeaponList() {
            document.querySelectorAll('.weapon-item').forEach(item => {
                const weaponName = item.dataset.weapon;
                if (!weaponName) {
                    return;
                }
                
                if (state.essenceReady.has(weaponName)) {
                    item.classList.add('has-essence');
                    item.classList.remove('selected');
                } else if (state.ownedWeapons.has(weaponName)) {
                    item.classList.add('selected');
                    item.classList.remove('has-essence');
                } else {
                    item.classList.remove('selected', 'has-essence');
                }
            });
        }

        function showNoResults(message, options = {}) {
            const scrollToResults = options.scrollToResults !== false;
            const resultsSection = document.getElementById('resultsSection');
            const resultsContainer = document.getElementById('resultsContainer');
            
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>${message}</h3>
                </div>
            `;

            resultsSection.classList.add('visible');
            if (scrollToResults) {
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        function resetAll() {
            state.ownedWeapons.clear();
            state.essenceReady.clear();
            state.selectedAttributeStats.clear();
            state.selectedSecondaryStat = null;
            state.selectedSkillStat = null;

            document.querySelectorAll('.weapon-item').forEach(el => {
                el.classList.remove('selected', 'has-essence');
                el.style.boxShadow = '';
            });

            document.querySelectorAll('.stat-chip').forEach(el => {
                el.classList.remove('selected', 'auto-selected', 'disabled');
            });

            updateSecondaryStatsAvailability(true);
            updateSkillStatsAvailability(true);

            document.getElementById('resultsSection').classList.remove('visible');
            updateCalculateButton();
        }

        function toggleRarity(rarity, headerElement) {
            const weaponList = document.querySelector(`.weapon-list[data-rarity="${rarity}"]`);
            const toggle = headerElement.querySelector('.rarity-toggle');
            const isCollapsed = weaponList.classList.contains('collapsed');
            const finishAnimation = (event) => {
                if (event.propertyName !== 'max-height') {
                    return;
                }

                weaponList.classList.remove('animating');
                if (!weaponList.classList.contains('collapsed')) {
                    weaponList.style.maxHeight = `${weaponList.scrollHeight}px`;
                }
                weaponList.removeEventListener('transitionend', finishAnimation);
            };

            weaponList.classList.add('animating');
            weaponList.addEventListener('transitionend', finishAnimation);

            if (isCollapsed) {
                weaponList.classList.remove('collapsed');
                weaponList.style.maxHeight = '0px';
                requestAnimationFrame(() => {
                    weaponList.style.maxHeight = `${weaponList.scrollHeight}px`;
                });
            } else {
                weaponList.style.maxHeight = `${weaponList.scrollHeight}px`;
                requestAnimationFrame(() => {
                    weaponList.classList.add('collapsed');
                    weaponList.style.maxHeight = '0px';
                });
            }

            toggle.classList.toggle('collapsed');
        }

        async function runCalculateWithLoading() {
            const btn = document.getElementById('calculateBtn');
            if (!btn || btn.disabled || btn.classList.contains('loading')) {
                return;
            }

            btn.classList.add('loading');
            btn.setAttribute('aria-busy', 'true');

            try {
                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                calculateBestLocation({ scrollToResults: true });
            } finally {
                btn.classList.remove('loading');
                btn.removeAttribute('aria-busy');
            }
        }

        async function initApp() {
            try {
                await loadDataFromJson();
                setLanguage(currentLanguage);
                initWeapons();
                initStats();
                updateCalculateButton();
                window.addEventListener('resize', refreshWeaponListHeights);
                hasInitializedUI = true;
            } catch (error) {
                showNoResults(error.message);
                document.getElementById('calculateBtn').disabled = true;
                console.error(error);
            }
        }

        initApp();
    
