

//logica e sistemas

function checkBattleReady() {
    const actionsSet = Object.keys(playerActions).length;
    const teamSize = team.length;
    
    // Só permite começar se o time tiver membros
    if (teamSize > 0 && actionsSet === teamSize) {
        startBattleButton.disabled = false;
        startBattleButton.textContent = "Começar Batalha!";
    } else {
        startBattleButton.disabled = true;
        startBattleButton.textContent = `Selecione Ações (${actionsSet}/${teamSize})`;
    }
}

function executeRound() {
    if (startBattleButton.disabled) return;

    console.log("Batalha Iniciada! Ações:", playerActions);
    
    // --- LÓGICA DO JOGO (FUTURO) ---
    //chamaria a lógica de processar as 'playerActions'
    //chamaria a IA para as ações inimigas
    //atualizaria o 'team' (HP, mana, efeitos)
    //chamaria a 'refreshAllUI()' para redesenhar tudo
    //

    // sistema de round
    roundNumberSpan.textContent = GAME_MANAGER.passRound();
    
    // Limpa as ações para o próximo round
    playerActions = {};
    playerArea.querySelectorAll('.action-icon').forEach(icon => {
        icon.classList.remove('selected');
    });

    // Desabilita o botão novamente
    checkBattleReady();
}

//draws (desenha os estados atuais na tela)
function refreshAllUI() {
    team.forEach(character => {
        updateSquad(character);
    });
    
    /*enemyTeam.forEach(enemy =>{
        updateEnemySquad(enemy);
    })*/
}

function drawRoster(character) {
    if(!team.includes(character)){
        console.warn('Tentativa de adcionar personagem inexistente');
        return;
    }
    
    // verifica se o slot existe
    const existingSlot = teamRoster.querySelector(`.team-member-portrait[data-id="${character.id}"]`);
    
    const newPortraitHTML = `
        <div class="portrait-image"></div>
        <div class="portrait-info">
            <span class="portrait-name">${character.name}</span>
            <div class="portrait-stats">
                <span class="portrait-atk">⚔️ ${character.currentStats.damage}</span>
                <span class="portrait-hp">❤️ ${character.currentStats.hp}/${character.stats.hp}</span>
                <span class="portrait-mana">🌀 ${character.currentStats.mana}/${character.stats.mana}</span>
            </div>
        </div>
    `;

    if (existingSlot) {
        // update
        existingSlot.innerHTML = newPortraitHTML;
    } else {
        // add
        const firstEmptySlot = teamRoster.querySelector('.empty-slot');
        if (firstEmptySlot) {
            firstEmptySlot.innerHTML = newPortraitHTML;
            firstEmptySlot.classList.remove('empty-slot');
            firstEmptySlot.dataset.id = character.id;
        } else {
            console.error(`Erro: Não foi possível adicionar ${character.name} ao roster.`);
        }
    }

    teamPanelTitle.textContent = `Esquadrão (${MAX_TEAM_SIZE}/6)`
}

function drawCrew(character) {
    if(!team.includes(character)){
        console.warn('Tentativa de adcionar personagem inexistente');
        
        return;
    }
    // efeitos
    let effectsHTML = '';
    if (character.effects && Array.isArray(character.effects)) {
        character.effects.forEach(effect => {
            if (effect.duration > 0) {
                effectsHTML += `<div class="effect-icon" title="${effect.name} (${effect.duration} turnos)">
                    ${effect.icon}
                </div>`;
            }
        });
    }

    // Procura se o card deste personagem já existe na tela
    const existingCard = playerArea.querySelector(`.player-card[data-id="${character.id}"]`);

    const newInnerCardHTML = `
    <div class="player-action-bar">
            <div class="action-icon" data-action-type="melee" title="Ataque Básico">👊</div>
            <div class="action-icon" data-action-type="skill" title="Habilidades">📜</div>
            <div class="action-icon" data-action-type="rest" title="Descansar">💤</div>
        </div>
        <div class="player-name">${character.name}</div>
        <div class="player-sprite"></div>
        <div class="player-lvl">Lvl ${character.lvl}</div>
        <div class="player-stats-area">
            <div class="player-atk">
                ATK: ${character.currentStats.damage}
            </div>
            <div class="stat-bar-container hp-bar">
                <div class="bar-text hp-text">
                    ${character.currentStats.hp} / ${character.stats.hp}
                </div>
                <div class="armor-text">
                    ${character.stats.armor}
                </div>
                <div class="hp-bar-fill" style="width: ${(character.currentStats.hp / character.stats.hp) * 100}%"></div>
            </div>
            <div class="stat-bar-container mana-bar">
                <div class="bar-text mana-text">
                    ${character.currentStats.mana} / ${character.stats.mana}
                </div>
                <div class="mana-bar-fill" style="width: ${(character.currentStats.mana / character.stats.mana) * 100}%"></div>
            </div>
            <div class="player-effects">
                ${effectsHTML}
            </div>
        </div>
    `;

    if (existingCard) {
        existingCard.innerHTML = newInnerCardHTML;
        
    } else {
        playerArea.innerHTML += `
            <div class="player-card" data-id="${character.id}">
                ${newInnerCardHTML}
            </div>
        `;
    }
}

function addCharToSquad(character) {
    if(team.includes(character)){
        console.warn(`Já existe no time! Não há necessidade de adicionar ${character.name}.`);
        return;
    }
    if (team.length >= 6) {
        console.warn(`Time cheio! Não foi possível adicionar ${character.name}.`);
        return;
    }
    team.push(character);
    
    // Chama as funções de desenho
    updateSquad(character);
}

function updateSquad(character){
    drawCrew(character);
    drawRoster(character);
    }

/*function UpdateEnemySquad(){
    //logica futura
} */
