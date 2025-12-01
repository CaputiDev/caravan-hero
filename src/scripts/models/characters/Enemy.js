class Enemy extends Character {
    constructor(name, attributesInput, avatarObj, lvl, tier, description = '', enemyclass = 'default') {
        super(name, attributesInput, avatarObj, lvl, tier);
        
        this.xpGiven = lvl * 100 * tier;

        this.description = description;

        this.class = enemyclass;
        
    }
}