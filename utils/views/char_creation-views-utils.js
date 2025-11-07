
plusButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statName = button.dataset.stat;
        if (totalPoints > 0 && stats[statName] < MAX_PER_STAT) {
            stats[statName]++;
            totalPoints--;
            updateUI();
        }
    });
});

minusButtons.forEach(button => {
    button.addEventListener('click', () => {
        const statName = button.dataset.stat;
        if (stats[statName] > MIN_PER_STAT) {
            stats[statName]--;
            totalPoints++;
            updateUI();
        }
    });
});

charNameInput.addEventListener('input', () => {

    nextStepButton.disabled = (charNameInput.value.trim() === '');
});

nextStepButton.addEventListener('click', () => {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
});

prevStepButton.addEventListener('click', () => {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
});

startButton.addEventListener('click', () => {
    const charName = charNameInput.value;
    
    const attributesArray = [
        stats.str,
        stats.con,
        stats.agi,
        stats.int,
        stats.wis
    ];
    
    let firstChar = new PCharacter(charName, attributesArray);
    const firstCharFormatted = JSON.stringify(firstChar);

    localStorage.setItem('FirstCharData', firstCharFormatted);
    
    window.location.href = './pages/main.html';
});

function updateUI() {
    pointsValueEl.textContent = totalPoints;

    plusButtons.forEach(button => {
        const statName = button.dataset.stat; 
        const statValue = stats[statName];
        button.disabled = (totalPoints === 0) || (statValue === MAX_PER_STAT);
    });

    minusButtons.forEach(button => {
        const statName = button.dataset.stat;
        const statValue = stats[statName];
        button.disabled = (statValue === MIN_PER_STAT);
    });
    
    for (const statName in stats) {
        valueElements[statName].textContent = stats[statName];
    }

    updateVocation();

    const arePointsSpent = (totalPoints === 0);
    startButton.disabled = !arePointsSpent;

    updateStatsPreview();
}

function updateVocation() {
    let highestStat = 'default';
    let maxValue = 0;
    let isTied = false;

    for (const statName in stats) {
        const value = stats[statName];
        if (value > maxValue) {
            maxValue = value;
            highestStat = statName;
            isTied = false;
        } else if (value === maxValue && maxValue > MIN_PER_STAT) {
            isTied = true;
        }
    }

    if(totalPoints == 0){
    if (isTied) {
        highestStat = 'default';
    }

    const vocation = VOCATIONS[highestStat];
    vocationNameEl.textContent = vocation.name;
    vocationTooltipEl.textContent = vocation.desc;
    }else{
        vocationNameEl.textContent = '';
        vocationTooltipEl.textContent = 'Indefinido. Gaste todos prontos de atributo.';
    }
}

function updateStatsPreview() {
    const lvl = 1; //
    const tier = 1; 
    
    const modifiers = {
        "damage": 2 + lvl,
        "critical_multiplier": 1 + lvl,
        "initiative" : 1 + lvl,
        "evasion": 0.5 + (lvl * 0.5),
        "critical_chance": 0.5 + (lvl * 0.5),
        "hp": 5 + lvl,
        "armor": 1 + lvl,
        "mana": 2 + lvl,
        "skill": 1 + lvl,
        "magic_resist": 1 + lvl,
        "mana_regen": 1 + (lvl),
        "hp_regen": 2 + (lvl)
    };

    const finalStats = {
        "damage": _calculateStatPreview(modifiers.damage, stats.str, tier),
        "critical_multiplier": Math.floor((stats.str + modifiers.critical_multiplier) /2) * tier,
        
        "initiative": _calculateStatPreview(modifiers.initiative, stats.agi, tier),
        "evasion": _calculateStatPreview(modifiers.evasion, stats.agi, tier),
        "critical_chance": _calculateStatPreview(modifiers.critical_chance, stats.agi, tier),

        "hp": _calculateStatPreview(modifiers.hp, stats.con, tier),
        "armor": _calculateStatPreview(modifiers.armor, stats.con, tier),

        "mana": _calculateStatPreview(modifiers.mana, stats.int, tier),
        "skill": _calculateStatPreview(modifiers.skill, stats.int, tier),

        "magic_resist": _calculateStatPreview(modifiers.magic_resist, stats.wis, tier),
        "mana_regen": _calculateStatPreview(modifiers.mana_regen, stats.wis, tier),
        "hp_regen": _calculateStatPreview(modifiers.mana_regen, stats.wis, tier),
    };

    for (const statName in finalStats) {
        if(statName == 'critical_multiplier'){
            previewStatElements[statName].textContent = `${finalStats[statName]}X`;
        }
        else if (previewStatElements[statName]) {
            previewStatElements[statName].textContent = finalStats[statName];
        }
    }
}