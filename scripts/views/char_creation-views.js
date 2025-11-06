    // span dos emojis
    const animationContainer = document.querySelector('.background-animation');
    const numberOfIcons = 12; 
    for (let i = 0; i < numberOfIcons; i++) {
        const iconSpan = document.createElement('span');
        animationContainer.appendChild(iconSpan);
    }

    const step1 = document.getElementById('step-1-name');
    const step2 = document.getElementById('step-2-attributes');
    const charNameInput = document.getElementById('char-name-input');
    const nextStepButton = document.getElementById('next-step-btn');
    const prevStepButton = document.getElementById('prev-step-btn');
    const startButton = document.getElementById('main-start');
    const pointsValueEl = document.getElementById('points-value');

    const vocationNameEl = document.getElementById('vocation-name');
    const vocationTooltipEl = document.getElementById('vocation-tooltip');
    const plusButtons = document.querySelectorAll('.stat-btn.plus');
    const minusButtons = document.querySelectorAll('.stat-btn.minus');
