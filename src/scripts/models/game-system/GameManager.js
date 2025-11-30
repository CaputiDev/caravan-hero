//vou usar funcao construtora por conta dos requisitos do professor
function GameManager(){
    this.phase = 1;
    this.round = 1;

    this.enemiesNum =1;
    this.enemiesNumValidation = 10;

    this.baseEnemyStatPool = 1;
}

GameManager.prototype.getRound = function() { return this.round; };
GameManager.prototype.getPhase = function() { return this.phase; };
GameManager.prototype.passRound = function() { this.round++; return this.round};
GameManager.prototype.resetRound = function() { this.round = 1; return this.round};

GameManager.prototype.passPhase = function() { this.phase++; this.round = 1; return this.phase};

GameManager.prototype.getEnemyStatPool = function() {

    return this.baseEnemyStatPool + ((this.phase - 1) * 2);
}

GameManager.prototype.getEnemysNum = function(){
    return this.enemiesNum;
}

GameManager.prototype.increaseEnemysNum = function(){
    this.enemiesNum ++;
    return this.enemiesNum;
}

GameManager.prototype.getEnemiesNumValidation = function(){
    return this.enemiesNumValidation;
}

GameManager.prototype.increaseEnemiesNumValidation = function(){
    this.enemiesNumValidation *= 2;
    return this.enemiesNumValidation;
}



const GAME_MANAGER = new GameManager();