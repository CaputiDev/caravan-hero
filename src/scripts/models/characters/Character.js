
const ID_COUNTER_KEY_CHARACTER = 'gameCharacterIdCounter';
function getNextCharacterId() {
    let nextId = localStorage.getItem(ID_COUNTER_KEY_CHARACTER);

    if (nextId === null) {
        nextId = 1;
    } else {
        nextId = parseInt(nextId, 10);
    }
    
    localStorage.setItem(ID_COUNTER_KEY_CHARACTER, (nextId + 1).toString());

    return nextId;
}

// personagem generico
class Character {
    constructor(name, attributesInput, avatarObj = null, lvl = 1, tier = 1) {
        //id universal
        this.id = getNextCharacterId();
        
        if (typeof name === "object" && typeof name.name === "object")
            this.name = name.name;
        else
            this.name = name;
        this.name = this.#generateUniqueName(this.name);

        if (avatarObj && typeof avatarObj === "object") {
            if ("picture" in avatarObj && typeof avatarObj.picture === "object") 
                this.avatar = { ...avatarObj.picture };
            else 
                this.avatar = { ...avatarObj };
        } else this.avatar = null;

        this.lvl = lvl;
        this.tier = tier;

        if (Array.isArray(attributesInput)) {
            const [str, con, agi, int, wis] = attributesInput;
            this.attributes = {
                str: str,
                con: con,
                agi: agi,
                int: int,
                wis: wis
            }
        } else if (typeof attributesInput === 'object' && attributesInput !== null) {
            this.attributes = { ...attributesInput }; 
        } else {

            console.error(`Atributos inválidos para ${name}!`, attributesInput);
            this.attributes = { str: 1, con: 1, agi: 1, int: 1, wis: 1 };
        }
        this.modifiers = null; 
        this.stats = null;
        this.effects = [];
        this.skills = [];
        
        this.recalculateAll(); 

        this.currentHP = JSON.parse(JSON.stringify(this.stats.hp));
        this.currentMana = JSON.parse(JSON.stringify(this.stats.mana));
        
        //habilidades passivas, geralmente com relacao a vocacao(alidos) ou classe(time inimigo)
        this.passive_skills = [];
    }
    #generateUniqueName(nameObj, removeChance = 0.25, titleChance = 0.1) {
        if (typeof nameObj === 'string') return capitalizeSmart(nameObj);

        // Garantir strings e trim
        const title = (nameObj.title || '').trim();
        const first = (nameObj.first || '').trim();
        const last = (nameObj.last || '').trim();

        if (!title && !first && !last) return 'Unknown';

        // PARTES INICIAIS
        let parts = [first, last];

        // Adiciona title com chance menor
        if (title && Math.random() < titleChance) parts.unshift(title);

        // Shuffle Fisher–Yates melhorado
        for (let i = parts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [parts[i], parts[j]] = [parts[j], parts[i]];
        }

        // Mix de sílabas se houver first e last
        let mixedFirst = first || last || title;
        if (first && last) {
            const fMid = Math.ceil(first.length / 2);
            const lMid = Math.ceil(last.length / 2);

            const f1 = first.slice(0, fMid);
            const f2 = first.slice(fMid);
            const l1 = last.slice(0, lMid);
            const l2 = last.slice(lMid);

            const syllableOptions = [f1 + l2, l1 + f2, f2 + l1, l2 + f1].filter(Boolean);
            mixedFirst = syllableOptions[Math.floor(Math.random() * syllableOptions.length)] || mixedFirst;
        }

        // Substitui first pelo mix
        parts = parts.map(p => (p === first ? mixedFirst : p));

        // Chance de remover uma parte (se sobrar mais de 1)
        if (Math.random() < removeChance && parts.length > 1) {
            const indexToRemove = Math.floor(Math.random() * parts.length);
            parts.splice(indexToRemove, 1);
        }

        return capitalizeSmart(parts.join(' '));

        // -------------------------
        // Função interna de capitalização inteligente
        // -------------------------
        function capitalizeSmart(str) {
            const exceptions = ["of", "the", "son"];
            return str
                .split(' ')
                .map((word, index) => {
                    const lower = word.toLowerCase();
                    if (index === 0) return lower.charAt(0).toUpperCase() + lower.slice(1);
                    if (exceptions.includes(lower)) return lower;
                    return lower.charAt(0).toUpperCase() + lower.slice(1);
                })
                .join(' ');
        }
    }


    _calculateModifier(weight = 1, op = '*'){

        //comeca fraco e escalona muito late game
            if(op === '*') {
                return weight * this.lvl;

            //comeca mais forte, mas escala menos late game
            } else if(op === '+') {
                return weight + this.lvl;
                
            } else {
                throw new Error('Error: invalid operator');
            }
    }
    _calculateStat(modifierName, attributeConfig , atrWeight = 1, forceInt = true) {
        const modifier = this.modifiers[modifierName];
        let attributeValue = 0;

        if(typeof attributeConfig === 'string'){
            attributeValue = this.attributes[attributeConfig] * atrWeight;
        } else if (typeof attributeConfig === 'object' && attributeConfig !== null){
            let totalValue = 0;
            let totalWeight = 0;

            for (const atr in attributeConfig) {
                const weight = attributeConfig[atr];  
                const atrValue = this.attributes[atr];
                
                if (atrValue !== undefined) {
                    totalValue += atrValue * weight;
                    totalWeight += weight;
                }
            }
            attributeValue = (totalWeight > 0) ? (totalValue / totalWeight) : 0;
        
        } else {
            throw new Error('Tipo de atributo inválido: ' + attributeConfig);
        }

        if(forceInt){return Math.round(modifier + (attributeValue * this.tier))};
        
        return modifier + (attributeValue * this.tier);

    }
    
    recalculateAll() {
        //peso nos stats p/ level
        this.modifiers = {
            // Força
            "damage": this._calculateModifier(2),
            "critical_multiplier": 1 + (this.lvl*0.25), //especifiquei pra equilibrar pois esse stat aqui é bem forte
            // Agilidade
            "initiative" :this._calculateModifier(1),
            "evasion": this._calculateModifier(0.5),
            "critical_chance": this._calculateModifier(1),
            // Constituição
            "hp": this._calculateModifier(5),
            "armor": this._calculateModifier(1),
            // Inteligência
            "mana": this._calculateModifier(2,"+"),
            "skill": this._calculateModifier(1),
            // Sabedoria
            "magic_resist": this._calculateModifier(1),
            "mana_regen": this._calculateModifier(2),
            "hp_regen": this._calculateModifier(2),
        };
        //peso por atributo
        this.stats = {
            // FOR
            "damage": this._calculateStat("damage", "str",2),
            "critical_multiplier": this._calculateStat("critical_multiplier","str",0.25,false),
            
            // AGI
            "initiative": this._calculateStat("initiative", "agi"),
            "evasion": this._calculateStat("evasion", "agi",1.5,false),
            "critical_chance": this._calculateStat("critical_chance", "agi",1.5,false),

            // CON
            "hp": this._calculateStat("hp", "con", 3),
            "armor": this._calculateStat("armor", "con",),

            // INT
            "mana": this._calculateStat("mana", {"int":6,"wis":3},1),
            "skill": this._calculateStat("skill", "int",2),

            // SAB
            "magic_resist": this._calculateStat("magic_resist", "wis"),
            "mana_regen": this._calculateStat("mana_regen", "wis"),
            "hp_regen": this._calculateStat("hp_regen", "wis",5),
        };

        if(this.stats['evasion'] >= 40){
            this.stats['evasion'] = 40;
        }

        if(this.stats['critical_chance'] >= 85){
            this.stats['critical_chance'] = 85
        } 
        if(this.stats['critical_multiplier'] >= 10){
            this.stats['critical_multiplier'] = 10
        }   
    }

    getAttributes(){
        return this.attributes;
    }

    meleeAttack(target) {        
        if(!target || target.currentHP <1 ){return {damage: 0, didEvade: true, isCritical: false , didKill:false }};
        let didKill = false;
        
        // esquiva
        // compara um número aleatório (0-100) com a chance de esquiva do alvo
        if (Math.floor(Math.random() * 101) < target.stats.evasion) {

            return{ damage: 0, didEvade: true, isCritical: false, didKill:false  };
        }

        let damage = this.stats.damage;
        let isCritical = false;

        // critico
        if (Math.floor(Math.random() * 101) < this.stats.critical_chance) {
            isCritical = true;
            
            damage = Math.round(this.stats.damage * this.stats.critical_multiplier); 
        }

        // reducao de dano pela armadura
        let finalDamage = damage - target.stats.armor;
        if (finalDamage < 1) finalDamage = 1;

        if(target.currentHP > finalDamage)target.currentHP -= finalDamage
        else{
            didKill = true;
            target.currentHP = 0;
        }
        return{ damage: finalDamage, didEvade: false, isCritical: isCritical, didKill:didKill };
    }
    rest(){
        //rec. de hp
        if(this.stats.hp_regen < (this.stats.hp - this.currentHP)) this.currentHP += this.stats.hp_regen; else this.currentHP = this.stats.hp;
        //rec de mana
        if(this.stats.mana_regen < (this.stats.mana - this.currentMana)) this.currentMana += this.stats.mana_regen; else this.currentMana = this.stats.mana;
        
    }
}
