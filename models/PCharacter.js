// essa classe é especifica de personagens jogaveis, não é um personagem genérico.
class PCharacter extends Character {
    constructor(name, attributes, lvl = 1,tier) {
        super(name, attributes, lvl, tier); 

        this.experience = 0;
        this.experienceGap = 100;
        this.inventory = [];
    }

    levelUp() {
        if(this.lvl<=10){
        this.lvl += 1;
        this.recalculateAll();
        this.experienceGap = lvl * 100;
        this.experience = 0;
        return this.lvl;
        }else{
            
        }
    }

}