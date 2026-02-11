        let weaponsData = {};
        let weapons = [];
        let locationsData = {};

        async function loadDataFromJson() {
            const isFileProtocol = window.location.protocol === 'file:';
            let weaponsResponse;
            let locationsResponse;

            try {
                [weaponsResponse, locationsResponse] = await Promise.all([
                    fetch('weapons.json'),
                    fetch('locations.json')
                ]);
            } catch (error) {
                if (isFileProtocol) {
                    throw new Error('Браузер блокирует загрузку JSON при открытии HTML напрямую. Запустите локальный сервер: python -m http.server 4173 и откройте http://127.0.0.1:4173/Essence%20Farm%20Optimizer.html');
                }
                throw new Error('Ошибка сети при загрузке weapons.json и locations.json');
            }

            if (!weaponsResponse.ok || !locationsResponse.ok) {
                throw new Error(`Не удалось загрузить JSON (weapons: ${weaponsResponse.status}, locations: ${locationsResponse.status})`);
            }

            try {
                weaponsData = await weaponsResponse.json();
                locationsData = await locationsResponse.json();
            } catch (error) {
                throw new Error('Некорректный формат JSON в weapons.json или locations.json');
            }

            weapons = Object.keys(weaponsData).sort();

            if (weapons.length === 0 || Object.keys(locationsData).length === 0) {
                throw new Error('JSON загружен, но список оружия или локаций пуст. Проверьте содержимое weapons.json и locations.json');
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
                return `weapons/${iconOverrides[weapon]}`;
            }

            const normalizedName = weapon
                .toLowerCase()
                .replace(/:/g, '')
                .replace(/\s+/g, '_');
            return `weapons/${normalizedName}.png`;
        }

        function initWeapons() {
            const weaponList = document.getElementById('weaponList');
            const weaponsByRarity = {6: [], 5: [], 4: []};

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
                    <span class="rarity-label">${rarity}-Star Weapons</span>
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
                    const iconPath = getWeaponIconPath(weapon);
                    div.innerHTML = `
                        <img src="${iconPath}" alt="${weapon}" class="weapon-icon" onerror="this.style.display='none'">
                        <span class="weapon-name">${weapon}</span>
                        <div class="weapon-tooltip">
                            <div class="tooltip-stat">
                                <span class="tooltip-label">Attribute:</span>
                                <span class="tooltip-value">${weaponData.attribute_stats}</span>
                            </div>
                            <div class="tooltip-stat">
                                <span class="tooltip-label">Secondary:</span>
                                <span class="tooltip-value">${weaponData.secondary_stats}</span>
                            </div>
                            <div class="tooltip-stat">
                                <span class="tooltip-label">Skill:</span>
                                <span class="tooltip-value">${weaponData.skill_stats}</span>
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
                chip.textContent = stat;
                chip.onclick = () => toggleAttributeStat(stat, chip);
                attributeContainer.appendChild(chip);
            });

            const secondaryContainer = document.getElementById('secondaryStats');
            Array.from(allStats.secondary).sort().forEach(stat => {
                const chip = document.createElement('div');
                chip.className = 'stat-chip';
                chip.textContent = stat;
                chip.onclick = () => toggleSecondaryStat(stat, chip);
                secondaryContainer.appendChild(chip);
            });

            const skillContainer = document.getElementById('skillStats');
            Array.from(allStats.skill).sort().forEach(stat => {
                const chip = document.createElement('div');
                chip.className = 'stat-chip';
                chip.textContent = stat;
                chip.onclick = () => toggleSkillStat(stat, chip);
                skillContainer.appendChild(chip);
            });
        }

        function toggleAttributeStat(stat, element) {
            if (element.classList.contains('disabled') || element.classList.contains('auto-selected')) {
                return;
            }

            if (state.selectedAttributeStats.has(stat)) {
                state.selectedAttributeStats.delete(stat);
                element.classList.remove('selected');
            } else if (state.selectedAttributeStats.size < 3) {
                state.selectedAttributeStats.add(stat);
                element.classList.add('selected');
            }
            highlightMatchingWeapons();
            updateCalculateButton();
        }

        function toggleSecondaryStat(stat, element) {
            if (state.selectedSkillStat !== null || element.classList.contains('disabled') || element.classList.contains('auto-selected')) {
                return;
            }

            const container = document.getElementById('secondaryStats');
            container.querySelectorAll('.stat-chip').forEach(chip => {
                chip.classList.remove('selected');
            });
            
            if (state.selectedSecondaryStat === stat) {
                state.selectedSecondaryStat = null;
                updateSkillStatsAvailability(true);
            } else {
                state.selectedSecondaryStat = stat;
                element.classList.add('selected');
                updateSkillStatsAvailability(false);
            }
            highlightMatchingWeapons();
            updateCalculateButton();
        }

        function toggleSkillStat(stat, element) {
            if (state.selectedSecondaryStat !== null || element.classList.contains('disabled') || element.classList.contains('auto-selected')) {
                return;
            }

            const container = document.getElementById('skillStats');
            container.querySelectorAll('.stat-chip').forEach(chip => {
                chip.classList.remove('selected');
            });
            
            if (state.selectedSkillStat === stat) {
                state.selectedSkillStat = null;
                updateSecondaryStatsAvailability(true);
            } else {
                state.selectedSkillStat = stat;
                element.classList.add('selected');
                updateSecondaryStatsAvailability(false);
            }
            highlightMatchingWeapons();
            updateCalculateButton();
        }

        function highlightMatchingWeapons() {
            const weaponItems = document.querySelectorAll('.weapon-item');
            
            weaponItems.forEach(item => {
                const weaponName = item.querySelector('.weapon-name').textContent;
                const weaponData = weaponsData[weaponName];
                
                // Remove previous highlight
                item.style.boxShadow = '';
                
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

            const btn = document.getElementById('calculateBtn');
            if (btn.disabled) {
                resultsSection.classList.remove('visible');
                return;
            }

            calculateBestLocation();
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
                    .find(el => el.textContent === stat);
                if (chip) chip.classList.add('auto-selected');
            });

            const uniqueSecondaryStats = new Set(Object.keys(statCounts.secondary));
            const uniqueSkillStats = new Set(Object.keys(statCounts.skill));

            if (uniqueSecondaryStats.size === 1 && uniqueSkillStats.size > 1) {
                const onlySecondaryStat = Array.from(uniqueSecondaryStats)[0];
                state.selectedSecondaryStat = onlySecondaryStat;
                const chip = Array.from(document.getElementById('secondaryStats').children)
                    .find(el => el.textContent === onlySecondaryStat);
                if (chip) {
                    chip.classList.add('auto-selected');
                    updateSkillStatsAvailability(false);
                }
            } else if (uniqueSkillStats.size === 1 && uniqueSecondaryStats.size > 1) {
                const onlySkillStat = Array.from(uniqueSkillStats)[0];
                state.selectedSkillStat = onlySkillStat;
                const chip = Array.from(document.getElementById('skillStats').children)
                    .find(el => el.textContent === onlySkillStat);
                if (chip) {
                    chip.classList.add('auto-selected');
                    updateSecondaryStatsAvailability(false);
                }
            } else if (uniqueSecondaryStats.size === 1 && uniqueSkillStats.size === 1) {
                const onlySecondaryStat = Array.from(uniqueSecondaryStats)[0];
                state.selectedSecondaryStat = onlySecondaryStat;
                const chip = Array.from(document.getElementById('secondaryStats').children)
                    .find(el => el.textContent === onlySecondaryStat);
                if (chip) {
                    chip.classList.add('auto-selected');
                    updateSkillStatsAvailability(false);
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
                        .find(el => el.textContent === topSkillStat[0]);
                    if (chip) {
                        chip.classList.add('auto-selected');
                        updateSecondaryStatsAvailability(false);
                    }
                } else if (topSecondaryCount > topSkillCount) {
                    const topSecondaryStat = sortedSecondaryStats[0];
                    state.selectedSecondaryStat = topSecondaryStat[0];
                    const chip = Array.from(document.getElementById('secondaryStats').children)
                        .find(el => el.textContent === topSecondaryStat[0]);
                    if (chip) {
                        chip.classList.add('auto-selected');
                        updateSkillStatsAvailability(false);
                    }
                } else {
                    const topSecondaryStat = sortedSecondaryStats[0];
                    state.selectedSecondaryStat = topSecondaryStat[0];
                    const chip = Array.from(document.getElementById('secondaryStats').children)
                        .find(el => el.textContent === topSecondaryStat[0]);
                    if (chip) {
                        chip.classList.add('auto-selected');
                        updateSkillStatsAvailability(false);
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
            const hasValidSelection = state.selectedAttributeStats.size === 3 &&
                ((state.selectedSecondaryStat !== null && state.selectedSkillStat === null) ||
                 (state.selectedSkillStat !== null && state.selectedSecondaryStat === null));

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
            const activeStatType = desiredStats.secondary ? 'secondary' : 'skill';
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

                const hasActiveStat = activeStatType === 'secondary' ? hasSecondaryStat : hasSkillStat;
                const matchedWeaponsCount = locationMatchingWeapons.length;
                const totalWeaponsCount = poolWeapons.length;
                const weaponMatchPercentage = totalWeaponsCount > 0
                    ? Math.round((matchedWeaponsCount / totalWeaponsCount) * 100)
                    : 0;

                const statMatchCount = matchedAttributes.length + (hasActiveStat ? 1 : 0);
                const totalPossibleStats = desiredStats.attribute.length + 1;

                return {
                    name,
                    matchedAttributes,
                    hasActiveStat,
                    hasSecondaryStat,
                    hasSkillStat,
                    activeStatType,
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

                const aStatMatches = a.matchedAttributes.length + (a.hasActiveStat ? 1 : 0);
                const bStatMatches = b.matchedAttributes.length + (b.hasActiveStat ? 1 : 0);

                return bStatMatches - aStatMatches;
            });

            return {
                scores: locationScores,
                targetedWeapons: poolWeapons
            };
        }

        function calculateBestLocation() {
            const weaponsNeedingEssence = Array.from(state.ownedWeapons)
                .filter(weapon => !state.essenceReady.has(weapon));

            if (weaponsNeedingEssence.length === 0) {
                if (state.ownedWeapons.size === 0) {
                    showNoResults('❌ Выберите хотя бы одно оружие для фарма (левый клик)');
                } else {
                    showNoResults('✅ У всех выбранных оружий уже есть эссенция! Если хотите фармить новое, отметьте его левым кликом (синим), а не правым (зелёным).');
                }
                return;
            }

            const desiredStats = {
                attribute: Array.from(state.selectedAttributeStats),
                secondary: state.selectedSecondaryStat,
                skill: state.selectedSkillStat
            };

            const hasValidSelection = desiredStats.attribute.length === 3 &&
                ((desiredStats.secondary && !desiredStats.skill) || (desiredStats.skill && !desiredStats.secondary));

            if (!hasValidSelection) {
                showNoResults('❌ Выберите ровно 3 Attribute Stats и 1 стат из Secondary или Skill.');
                return;
            }

            const candidateWeapons = weaponsNeedingEssence.filter(weapon => {
                const weaponData = weaponsData[weapon];

                if (desiredStats.secondary) {
                    return weaponData.secondary_stats === desiredStats.secondary;
                }

                return weaponData.skill_stats === desiredStats.skill;
            });

            if (candidateWeapons.length === 0) {
                showNoResults('Ни одно выбранное оружие не подходит под выбранный Secondary/Skill стат. Измените выбор.');
                return;
            }

            const getGroupDesiredStats = (weaponPool) => {
                const groupRecommendedStats = getRecommendedStatsForWeapons(weaponPool);
                return {
                    attribute: groupRecommendedStats.attribute,
                    secondary: desiredStats.secondary,
                    skill: desiredStats.skill
                };
            };

            const applyDesiredStatsToLocationScore = (locationScore, groupDesiredStats) => {
                const matchedAttributes = groupDesiredStats.attribute.filter(stat =>
                    locationScore.location.attribute_stats.includes(stat)
                );

                const hasSecondaryStat = groupDesiredStats.secondary ?
                    locationScore.location.secondary_stats.includes(groupDesiredStats.secondary) : false;
                const hasSkillStat = groupDesiredStats.skill ?
                    locationScore.location.skill_stats.includes(groupDesiredStats.skill) : false;
                const hasActiveStat = groupDesiredStats.secondary ? hasSecondaryStat : hasSkillStat;

                return {
                    ...locationScore,
                    matchedAttributes,
                    hasSecondaryStat,
                    hasSkillStat,
                    secondaryStat: groupDesiredStats.secondary,
                    skillStat: groupDesiredStats.skill,
                    statMatchCount: matchedAttributes.length + (hasActiveStat ? 1 : 0),
                    totalPossibleStats: groupDesiredStats.attribute.length + 1
                };
            };

            const getLocationScoresForWeapons = (weaponPool, groupDesiredStats) => {
                const locationScores = Object.entries(locationsData).map(([name, location]) => {
                    const locationMatchingWeapons = weaponPool.filter(weapon => {
                        const weaponData = weaponsData[weapon];
                        const hasAttribute = location.attribute_stats.includes(weaponData.attribute_stats);
                        const hasSecondary = location.secondary_stats.includes(weaponData.secondary_stats);
                        const hasSkill = location.skill_stats.includes(weaponData.skill_stats);
                        return hasAttribute && hasSecondary && hasSkill;
                    });

                    const matchedAttributes = groupDesiredStats.attribute.filter(stat =>
                        location.attribute_stats.includes(stat)
                    );

                    const hasSecondaryStat = groupDesiredStats.secondary ?
                        location.secondary_stats.includes(groupDesiredStats.secondary) : false;
                    const hasSkillStat = groupDesiredStats.skill ?
                        location.skill_stats.includes(groupDesiredStats.skill) : false;
                    const hasActiveStat = groupDesiredStats.secondary ? hasSecondaryStat : hasSkillStat;

                    const matchedWeaponsCount = locationMatchingWeapons.length;
                    const totalWeaponsCount = weaponPool.length;
                    const weaponMatchPercentage = totalWeaponsCount > 0
                        ? Math.round((matchedWeaponsCount / totalWeaponsCount) * 100)
                        : 0;

                    return {
                        name,
                        matchedAttributes,
                        hasSecondaryStat,
                        hasSkillStat,
                        secondaryStat: groupDesiredStats.secondary,
                        skillStat: groupDesiredStats.skill,
                        statMatchCount: matchedAttributes.length + (hasActiveStat ? 1 : 0),
                        totalPossibleStats: groupDesiredStats.attribute.length + 1,
                        weaponMatchPercentage,
                        matchedWeaponsCount,
                        totalWeaponsCount,
                        locationMatchingWeapons,
                        location
                    };
                });

                locationScores.sort((a, b) => {
                    if (b.matchedWeaponsCount !== a.matchedWeaponsCount) {
                        return b.matchedWeaponsCount - a.matchedWeaponsCount;
                    }
                    if (b.statMatchCount !== a.statMatchCount) {
                        return b.statMatchCount - a.statMatchCount;
                    }
                    return b.weaponMatchPercentage - a.weaponMatchPercentage;
                });

                return locationScores;
            };

            const farmPlan = [];
            let remainingCandidateWeapons = [...candidateWeapons];

            while (remainingCandidateWeapons.length > 0) {
                const rankingDesiredStats = getGroupDesiredStats(remainingCandidateWeapons);
                const locationScores = getLocationScoresForWeapons(remainingCandidateWeapons, rankingDesiredStats);
                const bestLocation = locationScores[0];

                if (!bestLocation || bestLocation.matchedWeaponsCount === 0) {
                    showNoResults(`Не найдено локаций, где этот набор статов может дропнуть оружие: ${remainingCandidateWeapons.join(', ')}`);
                    return;
                }

                const groupWeapons = [...bestLocation.locationMatchingWeapons];
                const groupDesiredStats = getGroupDesiredStats(groupWeapons);
                const groupBestLocation = applyDesiredStatsToLocationScore(bestLocation, groupDesiredStats);

                farmPlan.push({
                    weapons: groupWeapons,
                    desiredStats: groupDesiredStats,
                    bestLocation: groupBestLocation
                });

                remainingCandidateWeapons = remainingCandidateWeapons.filter(
                    weapon => !groupWeapons.includes(weapon)
                );
            }

            const skippedWeapons = weaponsNeedingEssence.filter(
                weapon => !candidateWeapons.includes(weapon)
            );

            displayResults(farmPlan, skippedWeapons);
        }

        function displayResults(farmPlan, skippedWeapons = []) {
            const resultsSection = document.getElementById('resultsSection');
            const resultsContainer = document.getElementById('resultsContainer');

            resultsContainer.innerHTML = '';

            if (skippedWeapons.length > 0) {
                const skippedInfo = document.createElement('div');
                skippedInfo.className = 'section-subtitle';
                skippedInfo.style.marginBottom = '1rem';
                skippedInfo.innerHTML = `<strong>Не вошли в текущий набор статов:</strong> ${skippedWeapons.join(', ')}`;
                resultsContainer.appendChild(skippedInfo);
            }

            farmPlan.forEach((step, index) => {
                const section = document.createElement('div');
                section.className = 'result-group';
                section.style.animationDelay = `${index * 90}ms`;
                const groupStats = [...step.desiredStats.attribute, step.desiredStats.secondary || step.desiredStats.skill]
                    .filter(Boolean)
                    .join(', ');

                section.innerHTML = `
                    <h3 style="margin: 18px 0 8px 0; color: ${index === 0 ? 'var(--color-success)' : 'var(--color-warning)'};">
                        ${index === 0 ? '🏆 Группа 1' : '🎯 Группа ' + (index + 1)} (статы: ${groupStats})
                    </h3>
                `;

                const loc = step.bestLocation;
                const card = document.createElement('div');
                card.className = `location-card ${index === 0 ? 'best' : ''}`;

                let statsHTML = '';

                if (step.weapons && step.weapons.length > 0) {
                    statsHTML += `
                        <div style="margin-bottom: 12px; padding: 8px; background: rgba(56, 189, 248, 0.1); border-radius: 6px;">
                            <strong style="color: var(--color-accent);">Оружие в группе (${step.weapons.length}):</strong>
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; margin-top: 8px;">
                                ${step.weapons.map(weapon => {
                                    const iconPath = getWeaponIconPath(weapon);
                                    const isSelected = state.ownedWeapons.has(weapon);
                                    const hasEssence = state.essenceReady.has(weapon);
                                    const classes = hasEssence ? 'has-essence' : (isSelected ? 'selected' : '');
                                    return `
                                        <div class="result-weapon-item ${classes}" data-weapon="${weapon}">
                                            <img src="${iconPath}" alt="${weapon}" style="width: 60px; height: 60px; object-fit: contain;" onerror="this.style.display='none'">
                                            <span style="font-size: 0.75rem; text-align: center; line-height: 1.2;">${weapon}</span>
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
                        <span class="stat-category">Attribute Stats:</span>
                        <div class="stat-list">
                            ${step.desiredStats.attribute.map(stat => {
                                const isMatch = loc.matchedAttributes.includes(stat);
                                return `<span class="stat-badge ${isMatch ? 'match' : ''}">${stat}</span>`;
                            }).join('')}
                        </div>
                    </div>
                `;

                if (loc.secondaryStat) {
                    statsHTML += `
                        <div class="stat-match-row">
                            <span class="stat-category">Secondary Stat:</span>
                            <div class="stat-list">
                                <span class="stat-badge ${loc.hasSecondaryStat ? 'match' : ''}">${loc.secondaryStat}</span>
                            </div>
                        </div>
                    `;
                }

                if (loc.skillStat) {
                    statsHTML += `
                        <div class="stat-match-row">
                            <span class="stat-category">Skill Stat:</span>
                            <div class="stat-list">
                                <span class="stat-badge ${loc.hasSkillStat ? 'match' : ''}">${loc.skillStat}</span>
                            </div>
                        </div>
                    `;
                }

                statsHTML += '</div>';

                card.innerHTML = `
                    <div class="location-spotlight ${index === 0 ? 'best' : ''}">
                        <span class="location-spotlight-label">${index === 0 ? 'Ключевая локация' : 'Локация группы'}</span>
                        <span class="location-spotlight-name">${loc.name}</span>
                    </div>
                    <div class="location-header">
                        <span class="location-name">Покрытие выбранных статов</span>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span class="match-score">${loc.weaponMatchPercentage}% оружия (${loc.matchedWeaponsCount}/${loc.totalWeaponsCount})</span>
                            <span class="match-score">${loc.statMatchCount}/${loc.totalPossibleStats} статов</span>
                        </div>
                    </div>
                    ${statsHTML}
                `;

                section.appendChild(card);
                resultsContainer.appendChild(section);
            });

            resultsSection.classList.add('visible');
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

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
                const weaponName = item.querySelector('.weapon-name').textContent;
                
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

        function showNoResults(message) {
            const resultsSection = document.getElementById('resultsSection');
            const resultsContainer = document.getElementById('resultsContainer');
            
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>${message}</h3>
                </div>
            `;

            resultsSection.classList.add('visible');
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
                calculateBestLocation();
            } finally {
                btn.classList.remove('loading');
                btn.removeAttribute('aria-busy');
            }
        }

        async function initApp() {
            try {
                await loadDataFromJson();
                initWeapons();
                initStats();
                updateCalculateButton();
                window.addEventListener('resize', refreshWeaponListHeights);
            } catch (error) {
                showNoResults(`❌ ${error.message}`);
                document.getElementById('calculateBtn').disabled = true;
                console.error(error);
            }
        }

        initApp();
    
