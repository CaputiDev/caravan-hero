function updateUI() {
    pointsValueEl.textContent = totalPoints;

    // Atualiza os botões + e -
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