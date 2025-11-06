const VOCATIONS = {
    default: {
        name: "Aventureiro",
        desc: "Equilibrado. Consegue fazer de tudo um pouco."
    },
    str: {
        name: "Porradeiro",
        desc: "Causa dano físico massivo."
    },
    con: {
        name: "Tanque",
        desc: "Resiste a grandes quantidades de dano."
    },
    agi: {
        name: "Assassino",
        desc: "Ataca primeiro e desvia de golpes."
    },
    int: {
        name: "Especialista",
        desc: "Utiliza magias e habilidades poderosas."
    },
    wis: {
        name: "Sábio",
        desc: "Resiste a magias e regenera mana."
    }
};

const MAX_POINTS = 5;
const MAX_PER_STAT = 5;
const MIN_PER_STAT = 1;
let totalPoints = MAX_POINTS;

const stats = {
    str: 1,
    con: 1,
    agi: 1,
    int: 1,
    wis: 1
};

const valueElements = {
    str: document.getElementById('str-value'),
    con: document.getElementById('con-value'),
    agi: document.getElementById('agi-value'),
    int: document.getElementById('int-value'),
    wis: document.getElementById('wis-value')
};


updateUI();