class Enemy extends Character{
    constructor(name, [str, con, agi, int, wis], lvl, tier, description = '') {
        super(name, [str, con, agi, int, wis], lvl, tier);
        
        this.xpGiven = lvl * 100 * tier;
        this.description = description;
    }
}