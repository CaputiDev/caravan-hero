//var globais
window.team = [];
window.enemyTeam = [];
window.playerActions = {};

//importação do personagem
let firstCharData = localStorage.getItem('FirstCharData');
if(firstCharData != null){
    localStorage.setItem(ID_COUNTER_KEY,1);

    firstCharData = JSON.parse(firstCharData);
    let attributes = firstCharData.attributes
    
    const firstChar = new PCharacter(firstCharData.name, attributes);
    firstChar.effects = []; 
    team.push(firstChar);
    console.log(firstChar);
    
    updateSquad(firstChar);
    
} else {
//caso o acesso seja feito sem a criação de um personagem(MODO DEBUG para testes de desenvolvimento)
debugInit();
}

/*
fazer sistema de rodadas

*/
