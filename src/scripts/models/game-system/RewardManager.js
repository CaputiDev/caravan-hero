function RewardManager() {
    this.modal = document.getElementById('reward-modal');
    this.container = document.getElementById('reward-options-container');
}

RewardManager.prototype.showRewards = function() {
    this.container.innerHTML = ''; // Limpa opções antigas
    
    // Gera 3 opções aleatórias
    const options = [];
    for (let i = 0; i < 3; i++) {
        options.push(this.generateRandomReward());
    }

    // Desenha na tela
    options.forEach(option => {
        const card = document.createElement('div');
        card.classList.add('reward-card');
        card.innerHTML = `
            <div class="reward-icon">${option.icon}</div>
            <div class="reward-title">${option.title}</div>
            <div class="reward-desc">${option.desc}</div>
        `;
        
        // Click Listener
        card.addEventListener('click', () => {
            option.effect(); // Aplica o efeito
            this.closeModal();
        });

        this.container.appendChild(card);
    });

    this.modal.classList.remove('hidden');
}

RewardManager.prototype.closeModal = function() {
    this.modal.classList.add('hidden');
    
    // [IMPORTANTE] Só agora gera a próxima fase
    spawnNewEnemies();
    
    // Verifica se a loja deve abrir
    checkShopAvailability();
}

RewardManager.prototype.generateRandomReward = function() {
    const rand = Math.random();

    const luck = Math.random() +1;
    
    // 1. Ouro (40% chance)
    if (rand < 0.4) {
        const amount = Math.round((50 + (GAME_MANAGER.getPhase() * 10)) * luck);
        return {
            icon: '💰',
            title: 'Saco de Ouro',
            desc: `Receba ${amount} de ouro imediatamente.`,
            effect: () => {
                PLAYER_MANAGER.addGold(amount);
                goldAmount.textContent = PLAYER_MANAGER.getGold();
                console.log(`Recompensa: Ganhou ${amount} ouro.`);
            }
        };
    }
    
    // 2. XP para um Aliado (40% chance)
    if (rand < 0.8 && window.team.length > 0) {
        const target = window.team[Math.floor(Math.random() * window.team.length)];
        const xpAmount = Math.round((100 + (GAME_MANAGER.getPhase() * 20)) * luck);
        return {
            icon: '✨',
            title: `Treino: ${target.name}`,
            desc: `Concede ${xpAmount} XP para ${target.name}.`,
            effect: () => {
                target.gainExperience(xpAmount);
                refreshAllUI(); // Atualiza lvl se upar
            }
        };
    }
    
    // 3. Skill Aleatória (20% chance)
    return {
        icon: '💖',
        title: 'Descanso Completo',
        desc: 'Cura totalmente todo o esquadrão.',
        effect: () => {
            window.team.forEach(char => {
                char.currentHP = char.stats.hp;
                char.currentMana = char.stats.mana;
            });
            refreshAllUI();
        }
    };
}

const REWARD_MANAGER = new RewardManager();