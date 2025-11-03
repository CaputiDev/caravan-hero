
function BattleManager(popupElement) {
    this.isTargeting = false;
    this.targetingCharacterId = null;
    this.targetingActionType = null;
    this.targetingCardElement = null;

    this.popup = popupElement;
    this.skillTargetType = null;
}

BattleManager.prototype.startTargeting = function(characterId, cardElement, actionType) {
    // Se já estávamos mirando com outro personagem, cancele a ação anterior
    if (this.isTargeting) {
        this.resetTargeting(true);
    }

    console.log(`[BattleManager] Personagem ${characterId} iniciando mira com ${actionType}`);
    
    // Define o estado interno
    this.isTargeting = true;
    this.targetingCharacterId = characterId;
    this.targetingActionType = actionType;
    this.targetingCardElement = cardElement;

    // Atualiza a UI global
    document.body.classList.add('targeting-active');
    // Destaca o card que está mirando
    cardElement.classList.add('is-targeting');
    
    if (this.popup) {
        this.popup.querySelector('p').textContent = "Clique em um inimigo ou fora para cancelar";
        this.popup.classList.add('show');
    }
    // (Lógica futura: se actionType === 'skill', abra o modal de skills aqui)
}

BattleManager.prototype.confirmTarget = function(enemyId) {
    if (!this.isTargeting) return; // Checagem de segurança

    console.log(`[BattleManager] Personagem ${this.targetingCharacterId} mirou no inimigo ${enemyId}`);

    // Define a ação final no 'playerActions' global
    window.playerActions[this.targetingCharacterId] = {
        type: this.targetingActionType,
        targetId: enemyId // Salva o ID do alvo!
    };
    
    // Atualiza a UI: marca o ícone (👊 ou 📜) como selecionado
    const actionIcon = this.targetingCardElement.querySelector(`.action-icon[data-action-type="${this.targetingActionType}"]`);
    if (actionIcon) {
        actionIcon.classList.add('selected');
    }

    //Reseta a mira (sem limpar o ícone 'selected')
    this.resetTargeting(false);
}

BattleManager.prototype.resetTargeting = function(clearSelectedIcon = true) {
    if (clearSelectedIcon && this.targetingCardElement) {
        // Remove a ação do "cérebro"
        delete window.playerActions[this.targetingCharacterId];
        
        // Limpa a UI do card
        this.targetingCardElement.querySelectorAll('.action-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
    }

    // Limpa a classe do card que estava mirando
    if (this.targetingCardElement) {
        this.targetingCardElement.classList.remove('is-targeting');
    }

    // Reseta as variáveis internas
    this.isTargeting = false;
    this.targetingCharacterId = null;
    this.targetingActionType = null;
    this.targetingCardElement = null;
    
    // Limpa a classe do body (muda o cursor de volta)
    document.body.classList.remove('targeting-active');
    
    if (this.popup) {
        this.popup.classList.remove('show');
    }

    // Atualiza o botão de batalha
    checkBattleReady();
}

BattleManager.prototype.isCurrentlyTargeting = function() {
    return this.isTargeting;
}

const BATTLE_MANAGER = new BattleManager(battleMessagePopup);