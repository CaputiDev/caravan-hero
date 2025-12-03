const startBtn = document.getElementById("start-btn");
    const settingsBtn = document.getElementById("settings-btn");
    const creditsBtn = document.getElementById("credits-btn");
    
    // Botão de Ação
    const resetSaveBtn = document.getElementById("reset-save-btn");
    
    // Botões de Voltar
    const backButtons = document.querySelectorAll(".back-btn");

    // Seções
    const mainNav = document.getElementById("main-nav");
    const settingsSection = document.getElementById("settings-section");
    const creditsSection = document.getElementById("credits-section");

    // Iniciar Jogo
    startBtn.addEventListener("click", function() {
        window.location.href = "./src/pages/char_creation.html";
    });

    // Abrir Configurações
    settingsBtn.addEventListener("click", function() {
        mainNav.classList.add("hidden");
        settingsSection.classList.remove("hidden");
    });

    // Abrir Créditos
    creditsBtn.addEventListener("click", function() {
        mainNav.classList.add("hidden");
        creditsSection.classList.remove("hidden");
    });

    // Voltar para o Menu Principal (Funciona para ambos os botões de voltar)
    backButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            // Pega o ID da seção atual através do atributo data-target
            const sectionId = this.getAttribute("data-target");
            const currentSection = document.getElementById(sectionId);
            
            // Esconde a seção atual e mostra o menu
            currentSection.classList.add("hidden");
            mainNav.classList.remove("hidden");
        });
    });

    // Lógica de Resetar Progresso 
    resetSaveBtn.addEventListener("click", function() {
        const btn = this;
        
        // ESTADO 1: Primeiro Clique (Pedir Confirmação
        if (btn.dataset.confirming !== 'true') {
            
            // Salva o texto original
            btn.dataset.originalText = btn.textContent;
            
            // Muda o visual e o texto
            btn.textContent = "Tem certeza? (Clique de novo)";
            btn.dataset.confirming = 'true';
            btn.classList.add('confirm-state');
            
            // Timer de segurança (Reseta se não clicar em 2s)
            if (btn.dataset.timeoutId) clearTimeout(Number(btn.dataset.timeoutId));
            
            const timeoutId = setTimeout(() => {
                btn.textContent = btn.dataset.originalText;
                btn.dataset.confirming = 'false';
                btn.classList.remove('confirm-state');
            }, 2000);
            
            btn.dataset.timeoutId = String(timeoutId);
            
            return;
        }

        // ESTADO 2: Segundo Clique (Executar Limpeza) ---
        if (btn.dataset.confirming === 'true') {
            localStorage.clear();

            // Feedback Visual de Sucesso
            btn.textContent = "Dados Apagados!";
            btn.classList.remove('confirm-state');
            btn.disabled = true;
            
            // Restaura o botão depois de um tempo (opcional)
            setTimeout(() => {
                btn.textContent = btn.dataset.originalText || "Apagar Progresso";
                btn.disabled = false;
                btn.dataset.confirming = 'false';
            }, 2000);
            
        }
    });