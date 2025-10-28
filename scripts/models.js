class Character {
    constructor(name, skin, stats) {
        name = this.name;
        skin = this.skin;
        stats = this.stats;
    }

    showStats() {
        Object.keys(this.stats).forEach(key => {
            console.log(`${key}: ${this.stats[key]}`);
        });
    }
}
