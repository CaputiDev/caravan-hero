
// Botões de Atributo (+ e -)
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

// Navegação de Etapas
charNameInput.addEventListener('input', () => {
    // Habilita o botão "Próximo" apenas se um nome for digitado
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

// Botão Final (Começar)
startButton.addEventListener('click', () => {
    const charName = charNameInput.value;
    
    // [IMPORTANTE] Cria o PCharacter usando o novo array de atributos
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
    
    // Altere para o caminho da sua página principal do jogo
    window.location.href = './pages/main.html';
});
