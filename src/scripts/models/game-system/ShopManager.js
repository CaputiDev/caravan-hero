function ShopManager() {
    this.shopInventory = []; 
}


ShopManager.prototype.generateShop = async function() {
    
    this.shopInventory = [];
    
    // Gera 3 mercenários
    for (let i = 0; i < 3; i++) {
        // criacao do mercenario
        const merc = await MERCENARY_GENERATOR.generateMercenary();
        
        // Calcula o preço
        // Preço = Base (25) + (Nível * 25) + (Total de Atributos * 5)
        const totalStats = Object.values(merc.attributes).reduce((a,b)=>a+b, 0);
        merc.cost = 25 + (merc.lvl * 25) + (totalStats * 5);

        this.shopInventory.push(merc);
    }
}

ShopManager.prototype.buyMercenary = function(index) {
    const merc = this.shopInventory[index];
    
    if (!merc) return false;

    if (PLAYER_MANAGER.getGold() < merc.cost) {
        console.warn("Ouro insuficiente!");
        return false;
    }

    if (window.team.length >= MAX_TEAM_SIZE || PLAYER_MANAGER.unlockedSlots <= window.team.length) {
        console.warn("Time cheio!");
        return false;
    }

    // Compra
    PLAYER_MANAGER.minusGold(merc.cost);
    addCharToSquad(merc); 
    
    // Remove da loja
    this.shopInventory.splice(index, 1);
    
    return true;
}

const SHOP_MANAGER = new ShopManager();