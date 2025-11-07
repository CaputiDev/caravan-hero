const ID_COUNTER_KEY = 'gameCharacterIdCounter';

function getNextCharacterId() {
    let nextId = localStorage.getItem(ID_COUNTER_KEY);

    if (nextId === null) {
        nextId = 1;
    } else {
        nextId = parseInt(nextId, 10);
    }
    
    localStorage.setItem(ID_COUNTER_KEY, (nextId + 1).toString());

    return nextId;
}
// personagem generico
class Character {
    constructor(name, [str, con, agi, int, wis], lvl = 1, tier = 1) {
        //id universal
        this.id = getNextCharacterId();

        this.name = name;
        this.lvl = lvl;
        this.tier = tier;
        this.class = 'default';

        this.attributes = {
            str: str,
            con: con,
            agi: agi,
            int: int,
            wis: wis
        };
        
        this.modifiers = null; 
        this.stats = null;
        this.effects = [];
        
        this.recalculateAll(); 

        this.currentHP = JSON.parse(JSON.stringify(this.stats.hp));
        this.currentMana = JSON.parse(JSON.stringify(this.stats.mana));
    }

    _calculateStat(modifierName, attributeName) {
        const modifier = this.modifiers[modifierName];
        const attribute = this.attributes[attributeName];
        
        return modifier + (attribute * this.tier);
    }
    
    recalculateAll() {

        this.modifiers = {
            // Força
            "damage": 2 + this.lvl,
            "critical_multiplier": 1 + this.lvl,
            // Agilidade
            "initiative" : 1 + this.lvl,
            "evasion": 0.5 + (this.lvl * 0.5),
            "critical_chance": 0.5 + (this.lvl * 0.5),
            // Constituição
            "hp": 5 + this.lvl,
            "armor": 1 + this.lvl,
            // Inteligência
            "mana": 2 + this.lvl,
            "skill": 1 + this.lvl,
            // Sabedoria
            "magic_resist": 1 + this.lvl,
            "mana_regen": 1 + (this.lvl),
            "hp_regen": 2 + (this.lvl)
        };

        this.stats = {
            // FOR
            "damage": this._calculateStat("damage", "str"),
            "critical_multiplier": Math.floor((this.attributes.str + this.modifiers.critical_multiplier) /2) * this.tier,
            
            // AGI
            "initiative": this._calculateStat("initiative", "agi"),
            "evasion": this._calculateStat("evasion", "agi"),
            "critical_chance": this._calculateStat("critical_chance", "agi"),

            // CON
            "hp": this._calculateStat("hp", "con"),
            "armor": this._calculateStat("armor", "con"),

            // INT
            "mana": this._calculateStat("mana", "int"),
            "skill": this._calculateStat("skill", "int"),

            // SAB
            "magic_resist": this._calculateStat("magic_resist", "wis"),
            "mana_regen": this._calculateStat("mana_regen", "wis"),
            "hp_regen": this._calculateStat("hp_regen", "wis"),
        };
    }
    getAttributes(){
        return [this.str, this.con, this.agi, this.int, this.wis]
    }
    // (Suas funções 'showAttributes' e 'showStats' funcionarão perfeitamente)
    showAttributes() {
        console.log(`--- Atributos de ${this.name} ---`);
        Object.keys(this.attributes).forEach(key => {
            console.log(`${key}: ${this.attributes[key]}`); 
        });
    }

    showStats() {
        console.log(`--- Stats de ${this.name} ---`);
        Object.keys(this.stats).forEach(key => {
            console.log(`${key}: ${this.stats[key]}`); 
        });
    }

    meleeAttack(target) {
        // esquiva
        if (Math.random() * 100 < target.stats.evasion) {
            console.log(`%c${this.name} ataca ${target.name}, mas ${target.name} se esquiva!`, "color: #999; font-style: italic;");
            return 0;
        }

        let damage = this.stats.damage;
        let isCritical = false;

        // critico
        // compara um número aleatório (0-99) com a chance de crítico do atacante
        if (Math.random() * 100 < this.stats.critical_chance) {
            isCritical = true;
            
            damage = this.stats.damage * this.stats.critical_multiplier; 
        }

        // reducao de dano pela armadura
        let finalDamage = damage - target.stats.armor;
        if (finalDamage < 1) finalDamage = 1;

        target.currentHP -= finalDamage;
        
        //DEBUG TEMPORARIO
        if (isCritical) {
            console.log(`%c💥 ATAQUE CRÍTICO! ${this.name} ataca ${target.name} causando ${finalDamage} de dano!`, "color: var(--orange-color); font-weight: bold; font-size: 1.1em;");
        } else {
            console.log(`${this.name} ataca ${target.name} causando ${finalDamage} de dano.`);
        }
        
        return finalDamage;
    }
}
