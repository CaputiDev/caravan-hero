//DEBUG
const inimgo = new Enemy('enemy',{atk: 2,con: 3,int:1});

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
    // Verifica se o clique foi em um ícone de ação
    const clickedIcon = event.target.closest('.action-icon');
    
    // Se não foi, ou se a batalha estiver em andamento, ignora
    if (!clickedIcon) return; 

    // Pega o card e o ID do personagem
    const card = clickedIcon.closest('.player-card');
    const characterId = card.dataset.id;
    const actionType = clickedIcon.dataset.actionType;

    // Armazena a ação escolhida no "Estado"
    playerActions[characterId] = actionType;

    // Atualiza a UI (remove 'selected' de todos, adiciona no clicado)
    card.querySelectorAll('.action-icon').forEach(icon => {
        icon.classList.remove('selected');
    });
    clickedIcon.classList.add('selected');
    
    // (Lógica futura: se clicar em "Habilidades" 📜,
    //  você abriria um modal de skills aqui)

    // 3. Verifica se a batalha está pronta para começar
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



