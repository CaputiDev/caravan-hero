function MercenaryGenerator() {
}

MercenaryGenerator.prototype.generateMercenary = async function() {
    
    //  Define o nível base do mercenário (escala com a fase)
    const currentPhase = GAME_MANAGER.getPhase();

    const { level, tier } = this._calculateLevelAndTier(currentPhase);

    const statPool = 5 + Math.floor(level / 2);

    // Escolhe uma Vocação aleatória
    const vocationKeys = Object.keys(MERCENARY_VOCATIONS);
    const key = vocationKeys[Math.floor(Math.random() * vocationKeys.length)];
    const template = MERCENARY_VOCATIONS[key];

    //  Escolhe um Nome aleatório dinamicamente
    const mercenaryName = await APIConn.getName().call();
    
    //Cria um avatar dinamiacamente
    const mercenaryAvatar = await APIConn.getAvatar().call();

    // Distribui os pontos 
    const attributesArray = this._distributeStatPoints(template.weights, statPool);

    //  Cria a Instância
    const newMerc = new PCharacter(mercenaryName, attributesArray, mercenaryAvatar, level, tier, template.name);

    //  Adiciona Skills Iniciais baseadas na chave da vocação
    this._assignStartingSkills(newMerc, key);

    return newMerc;
}

MercenaryGenerator.prototype._calculateLevelAndTier = function(currentPhase) {
    // parecido com o EnemyGenerator

    // RNG: Variação de -1, 0 ou +1
    const levelVariation = Math.floor(Math.random() * 3) - 1; 

    // Calcula os "pontos de evolução" totais
    let totalEvolutionPoints = currentPhase + levelVariation;

    if (totalEvolutionPoints < 1) {
        totalEvolutionPoints = 1;
    }

    let tier = 1;
    let level = 1;
    let maxLevelForThisTier = 10; 

    // Loop de Rebirth (Cálculo de Tier)
    while (true) {
        if (totalEvolutionPoints <= maxLevelForThisTier) {
            level = totalEvolutionPoints;
            break;
        } else {
            totalEvolutionPoints -= maxLevelForThisTier;
            tier++;
            maxLevelForThisTier += 10; // Próximo tier é mais difícil
        }
    }
    
    return { level, tier };
}

MercenaryGenerator.prototype._distributeStatPoints = function(weights, pool) {
    let attributes = { str: 1, con: 1, agi: 1, int: 1, wis: 1 };
    let totalWeight = 0;
    
    for (const stat in weights) totalWeight += weights[stat];

    let pointsDistributed = 0;
    for (const stat in weights) {
        let points = Math.round(pool * (weights[stat] / totalWeight));
        attributes[stat] += points;
        pointsDistributed += points;
    }
    
    // Ajuste de arredondamento (dá o resto para o stat principal)
    let pointsDiff = pool - pointsDistributed;
    const mainStat = Object.keys(weights).reduce((a, b) => weights[a] > weights[b] ? a : b);
    attributes[mainStat] += pointsDiff;

    return [attributes.str, attributes.con, attributes.agi, attributes.int, attributes.wis];
}

MercenaryGenerator.prototype._assignStartingSkills = function(merc, vocationKey) {
    if (vocationKey === 'mago') {
        merc.skills.push(SKILLS.FIREBALL);
    } 
    else if (vocationKey === 'clerigo') {
        merc.skills.push(SKILLS.HEAL);
    } 
    else if (vocationKey === 'guerreiro' || vocationKey === 'tanque') {
        // skill de 'bater com escudo' ou 'provocar', iria aqui
        // merc.skills.push(SKILLS_CATALOG.SMITE);
    }
    // Adicionar mais lógicas conforme criar mais skills
}

const MERCENARY_GENERATOR = new MercenaryGenerator();