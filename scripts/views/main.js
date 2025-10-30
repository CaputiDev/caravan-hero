// Espera o HTML ser totalmente carregado
document.addEventListener('DOMContentLoaded', () => {


    // Painel Esquerdo
    const teamRoster = document.getElementById('team-roster');
    const skillsIcon = document.getElementById('skills-icon');

    const teamPanelTitle = document.querySelector('#team-panel .panel-title');
    // Área de Batalha
    const enemyArea = document.getElementById('enemy-area');
    const playerArea = document.getElementById('player-area');

    // Ícones Globais
    const recruitIcon = document.getElementById('recruit-icon');

    // Painéis Ocultos
    const recruitPanel = document.getElementById('recruit-panel');
    const skillsPanel = document.getElementById('skills-panel');
    const enemyTooltip = document.getElementById('enemy-tooltip');

    // Botões de Fechar
    const closeButtons = document.querySelectorAll('.close-panel-btn');



    //importação do personagem
    let firstCharData = localStorage.getItem('FirstCharData');

    if(firstCharData){
        firstCharData = JSON.parse(firstCharData);
        let attributes = firstCharData.attributes
        console.log(attributes);
        
        const firstChar = new PCharacter(firstCharData.name,attributes);
        console.log("Personagem carregado:", firstChar);
        
        localStorage.clear();
        preencherTime(firstChar);
        desenharPersonagemNaBatalha(firstChar);
    } else {
    localStorage.clear();
    console.warn(`Falha ao carregar dados. Criando time de DEBUG com 6 membros.`);
    
    // 1. Cria um array com o time completo
    const debugTeam = [
        new PCharacter('Guerreiro', {"atk": 3, "con": 2, "int": 1}),
        new PCharacter('Mago', {"atk": 1, "con": 2, "int": 3}),
        new PCharacter('Ladino', {"atk": 3, "con": 1, "int": 2}),
        new PCharacter('Clérigo', {"atk": 1, "con": 2, "int": 3}),
        new PCharacter('Tanque', {"atk": 2, "con": 3, "int": 1}),
        new PCharacter('Arqueiro', {"atk": 3, "con": 2, "int": 1})
    ];

    console.log(`DEBUG: Criação de time padrão para testes de desenvolvimento:`);


    debugTeam.forEach(character => {
        console.log(character);
        preencherTime(character);
        desenharPersonagemNaBatalha(character);
    });
}
    
    //INTERATIVIDADE DOS MENUS

    // Abrir o Painel de Recrutamento
    recruitIcon.addEventListener('click', () => {
        recruitPanel.classList.remove('hidden');
    });

    // Abrir o Painel de Habilidades
    skillsIcon.addEventListener('click', () => {
        skillsPanel.classList.remove('hidden');
    });

    // Fechar Painéis (Recrutar ou Habilidades)
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Pega o ID do painel que este botão deve fechar
            // (Nós definimos isso no HTML com 'data-target-panel')
            const panelId = button.dataset.targetPanel;
            if (panelId) {
                document.getElementById(panelId).classList.add('hidden');
            } else {
                // Fallback se for um modal
                skillsPanel.classList.add('hidden');
            }
        });
    });

    // Interatividade do Tooltip do Inimigo
    

    enemyArea.addEventListener('mouseover', (event) => {
        // Encontra o '.enemy-card' mais próximo que o mouse tocou
        const enemyCard = event.target.closest('.enemy-card');
        
        if (enemyCard) {
            // --- LÓGICA FUTURA ---
            // ID do inimigo (enemyCard.dataset.enemyId)
            // e buscaria os dados dele para preencher o tooltip.
            
            // Dados de exemplo:
            document.getElementById('tooltip-name').textContent = "Goblin";
            document.getElementById('tooltip-desc').textContent = "Fraco contra fogo. Rápido.";
            document.getElementById('tooltip-hp').textContent = "10/10";
            document.getElementById('tooltip-atk').textContent = "3";

            // Posiciona e mostra o tooltip
            enemyTooltip.classList.remove('hidden');
            // Posiciona o tooltip 10px abaixo e à direita do mouse
            enemyTooltip.style.left = `${event.pageX + 10}px`;
            enemyTooltip.style.top = `${event.pageY + 10}px`;
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

    //funcoes

    function preencherTime(character) {
    // Encontra o primeiro slot vazio no painel
    const firstEmptySlot = teamRoster.querySelector('.empty-slot');

    if (firstEmptySlot) {
        // Cria o HTML para o novo membro do time
        const newPortraitHTML = `
            <div class="portrait-image"></div>
            <div class="portrait-info">
                <span class="portrait-name">${character.name}</span>
                <div class="portrait-stats">
                    <span class="portrait-atk">⚔️ ${character.stats.damage}</span>
                    <span class="portrait-hp">❤️ ${character.stats.hp}/${character.stats.hp}</span>
                    <span class="portrait-mana">🌀 ${character.stats.mana}/${character.stats.mana}</span>
                </div>
            </div>
        `;
        
        // Adiciona o HTML ao slot
        firstEmptySlot.innerHTML = newPortraitHTML;
        firstEmptySlot.classList.remove('empty-slot');
        firstEmptySlot.dataset.memberId = character.name;

        // --- ATUALIZAÇÃO IMPORTANTE ---
        // Agora, contamos quantos slots estão preenchidos de verdade
        const filledSlots = teamRoster.querySelectorAll('.team-member-portrait:not(.empty-slot)').length;
        
        // E atualizamos o título dinamicamente
        teamPanelTitle.textContent = `Seu Time (${filledSlots}/6)`;

    } else {
        console.warn(`Time cheio! Não foi possível adicionar ${character.name}.`);
    }
}

function desenharPersonagemNaBatalha(character) {
        // Cria o HTML para a carta na batalha
        const newPlayerCardHTML = `
            <div class="player-card" data-member-id="${character.name}">
                <div class="player-name">${character.name}</div>
                <div class="player-sprite"></div> <div class="player-stats-bar">
                    <div class="hp-bar-player" style="width: 100%;"></div>
                    <div class="mana-bar-player" style="width: 100%;"></div>
                </div>
            </div>
        `;
        
        // Adiciona o novo HTML dentro da #player-area
        playerArea.innerHTML += newPlayerCardHTML;
    }
});




