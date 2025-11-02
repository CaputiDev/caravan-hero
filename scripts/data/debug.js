//arquivo temporario de testes

function debugInit(){

    localStorage.setItem(ID_COUNTER_KEY,1);
    localStorage.removeItem('FirstCharData');
    console.warn(`Falha ao carregar dados. Criando time de DEBUG com 6 membros.`);

    window.team = [
        new PCharacter('Guerreiro', {"atk": 3, "con": 2, "int": 1}),
        new PCharacter('Mago', {"atk": 1, "con": 2, "int": 3}),
        new PCharacter('Ladino', {"atk": 3, "con": 2, "int": 1}),
        new PCharacter('Clérigo', {"atk": 1, "con": 2, "int": 3}),
        new PCharacter('Tanque', {"atk": 2, "con": 3, "int": 1}),
        new PCharacter('Arqueiro', {"atk": 3, "con": 2, "int": 1})
    ];
    console.log(`DEBUG: Criação de time padrão para testes de desenvolvimento:`);

    window.team.forEach(character => {
    character.effects = [
            // efeitos ativos
            { name: 'Buff de Ataque', icon: '⚔️', duration: 3 },
            { name: 'Envenenado', icon: '☠️', duration: 2 },
            // efeito inativo(nao aparece)
            { name: 'Escudo', icon: '🛡️', duration: 0 } 
        ];
    updateSquad(character);
    })


    window.enemyTeam = [
        new Enemy('Goblin', {"atk": 2, "con": 1, "int": 0}, 1, 1, "Fraco contra fogo. Rápido."),
        new Enemy('Lobo', {"atk": 3, "con": 1, "int": 0}, 1, 1,"Ataca em bando. Alto dano."),
        new Enemy('Berga Boy',{"atk": 3, "con": 1, "int": 0}, 1, 1, 'Ama bergamotas.')
    ];

    window.enemyTeam.forEach(enemy => {
        UpdateEnemySquad(enemy); 
    });
};

//DEBUG
console.log(window.team);
console.log(window.enemyTeam);



PLAYER_MANAGER.addGold(100);
roundNumber.textContent = GAME_MANAGER.getRound();
phaseNumber.textContent = GAME_MANAGER.getPhase();
goldAmount.textContent = PLAYER_MANAGER.getGold();

