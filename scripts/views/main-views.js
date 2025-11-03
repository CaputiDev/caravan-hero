//popup para cancelar acao
const battleMessagePopup = document.getElementById('battle-message-popup');

//botao comecar batalha
const startBattleButton = document.getElementById('start-battle-btn')

//num das rodadas e das fases atuais
const roundNumber = document.getElementById('round-number');
const phaseNumber = document.getElementById('phase-number');

//moedas atuais
const goldAmount = document.getElementById('gold-amount');

// Painel Esquerdo
const teamRoster = document.getElementById('team-roster');
const skillsIcon = document.getElementById('skills-icon');
const teamPanelTitle = document.querySelector('#team-panel .panel-title');

// Área de Batalha
const enemyArea = document.getElementById('enemy-area');
const playerArea = document.getElementById('player-area');

// botões interativos
const recruitIcon = document.getElementById('recruit-icon');

// Painéis Ocultos
const recruitPanel = document.getElementById('recruit-panel');
const skillsPanel = document.getElementById('skills-panel');
const enemyTooltip = document.getElementById('enemy-tooltip');

// Botões de Fechar
const closeButtons = document.querySelectorAll('.close-panel-btn');



//add menu lateral esquerdo
const MAX_TEAM_SIZE = 6;
for (let i = 0; i < MAX_TEAM_SIZE; i++) {
    const slot = document.createElement('div');
    
    slot.classList.add('team-member-portrait', 'empty-slot');

    slot.setAttribute('disabled', ''); 

    teamRoster.appendChild(slot);
}

//INTERATIVIDADE DOS MENUS

//botao de iniciar batalha
startBattleButton.addEventListener('click', executeRound);

playerArea.addEventListener('click', (event) => {

    // Se estamos em modo de mira, clicar na área do jogador CANCELA a mira.
    if (BATTLE_MANAGER.isCurrentlyTargeting()) {
        console.log("[Main] Mira cancelada (clique na área do time)");
        BATTLE_MANAGER.resetTargeting(true); // Chama o método do gerenciador
        return;
    }
    
    // Verifica se o clique foi em um ícone de ação
    const clickedIcon = event.target.closest('.action-icon');
    if (!clickedIcon) return; 

    // Pega o card e o ID do personagem
    const card = clickedIcon.closest('.player-card');
    const characterId = card.dataset.id;
    const actionType = clickedIcon.dataset.actionType;

    // Atualiza a UI (remove 'selected' de todos, adiciona no clicado)
    card.querySelectorAll('.action-icon').forEach(icon => {
        icon.classList.remove('selected');
    });

    delete window.playerActions[characterId];

    if (actionType === 'rest') {
        // descanso
        const character = window.team.find(char => char.id == characterId);
        const charName = character ? character.name : `ID ${characterId}`;

        console.log(`[DEBUG]: Personagem ${characterId}:${charName} escolheu Descansar`);
        window.playerActions[characterId] = { type: 'rest' };
        clickedIcon.classList.add('selected');
        checkBattleReady();
    } else {
        // melee ou skill
        BATTLE_MANAGER.startTargeting(characterId, card, actionType);
    }
    
    // (Lógica futura: se clicar em "Habilidades" 📜,
    //  você abriria um modal de skills aqui)

    checkBattleReady();
});
// Abrir o Painel de Recrutamento
recruitIcon.addEventListener('click', () => {
    recruitPanel.classList.add('is-open');
    document.body.classList.add('shop-is-open');
});
// Abrir o Painel de Habilidades
skillsIcon.addEventListener('click', () => {
    skillsPanel.classList.remove('hidden');
});
// Fechar Painéis (Recrutar ou Habilidades)
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const panelId = button.dataset.targetPanel;
        
        if (panelId === 'recruit-panel') {
            recruitPanel.classList.remove('is-open');
            document.body.classList.remove('shop-is-open');
            
        } else if(panelId === 'skills-panel') {
            skillsPanel.classList.add('hidden');
        }
    });
});

enemyArea.addEventListener('click', (event) => {
    // Só funciona se o gerenciador estiver no modo de mira
    if (!BATTLE_MANAGER.isCurrentlyTargeting()) return;

    const enemyCard = event.target.closest('.enemy-card');
    
    if (enemyCard) {
        const enemyId = enemyCard.dataset.id;
        const enemyName = enemyCard.dataset.name;
        BATTLE_MANAGER.confirmTarget(enemyId);
    }
});
// Interatividade do Tooltip do Inimigo
enemyArea.addEventListener('mouseover', (event) => {
    const enemyCard = event.target.closest('.enemy-card');
    
    if (enemyCard) {
        // 1. Pega o ID do card do inimigo
        const enemyId = parseInt(enemyCard.dataset.id, 10);
        
        // 2. Encontra o objeto 'enemy' no array 'enemyTeam'
        const enemy = enemyTeam.find(e => e.id === enemyId);

        // 3. Se encontrou o inimigo, preenche o tooltip com seus dados
        if (enemy) {
            document.getElementById('tooltip-name').textContent = enemy.name;
            document.getElementById('tooltip-desc').textContent = enemy.description; // <-- USANDO A DESCRIÇÃO!
            document.getElementById('tooltip-hp').textContent = `${enemy.currentStats.hp}/${enemy.stats.hp}`;
            document.getElementById('tooltip-atk').textContent = enemy.currentStats.damage;
            
            // Posiciona e mostra o tooltip
            enemyTooltip.classList.remove('hidden');
            enemyTooltip.style.left = `${event.pageX + 10}px`;
            enemyTooltip.style.top = `${event.pageY + 10}px`;
        }
    }
});

// Esconde o tooltip quando o mouse sai da área do inimigo
enemyArea.addEventListener('mouseout', (event) => {
    if (event.target.closest('.enemy-card')) {
        enemyTooltip.classList.add('hidden');
    }
});

// Atualiza a posição do tooltip enquanto o mouse se mexe
enemyArea.addEventListener('mousemove', (event) => {
    if (!enemyTooltip.classList.contains('hidden')) {
        enemyTooltip.style.left = `${event.pageX + 10}px`;
        enemyTooltip.style.top = `${event.pageY + 10}px`;
    }
});


document.getElementById('battlefield').addEventListener('click', (event) => {
    if (!BATTLE_MANAGER.isCurrentlyTargeting()) return;
    
    if (!event.target.closest('.enemy-card') && !event.target.closest('.player-card')) {
        console.log("[Main] Mira cancelada (clique no fundo)");
        BATTLE_MANAGER.resetTargeting(true); 
    }
});