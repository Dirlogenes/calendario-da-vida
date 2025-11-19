// ==========================================
// 1. CONSTANTES E DADOS
// ==========================================

const LISTA_ADJETIVOS = [
    'Abençoada', 'Abundante', 'Agradável', 'Alegre', 'Amável', 'Animada', 'Apaixonante', 'Aventureira',
    'Bela', 'Bendita', 'Boa', 'Brilhante', 'Calma', 'Cativante', 'Cheia', 'Colorida', 'Confortável',
    'Construtiva', 'Criativa', 'Curiosa', 'Delicada', 'Deslumbrante', 'Divertida', 'Divina', 'Doce',
    'Encantada', 'Engraçada', 'Ensolarada', 'Equilibrada', 'Espetacular', 'Estimulante', 'Excelente',
    'Extraordinária', 'Fabulosa', 'Fantástica', 'Feliz', 'Fértil', 'Festiva', 'Formidável', 'Generosa',
    'Gentil', 'Gloriosa', 'Gratificante', 'Harmoniosa', 'Honesta', 'Incrível', 'Inspiradora', 'Intensa',
    'Interessante', 'Justa', 'Leve', 'Linda', 'Livre', 'Luminosa', 'Mágica', 'Magnífica', 'Maravilhosa',
    'Memorável', 'Nova', 'Óptima', 'Pacífica', 'Perfeita', 'Plena', 'Positiva', 'Preciosa', 'Privilegiada',
    'Produtiva', 'Próspera', 'Radiante', 'Realizada', 'Renovada', 'Rica', 'Saborosa', 'Sagrada', 'Santa',
    'Satisfatória', 'Saudável', 'Segura', 'Serena', 'Simples', 'Sincera', 'Singular', 'Suave', 'Sublime',
    'Surpreendente', 'Tranquila', 'Transformadora', 'Única', 'Valiosa', 'Verdadeira', 'Vibrante', 'Vitoriosa',
    'Ácida', 'Agitada', 'Amarga', 'Árdua', 'Breve', 'Caótica', 'Cansativa', 'Complexa', 'Complicada',
    'Confusa', 'Corrida', 'Desafiadora', 'Difícil', 'Dolorosa', 'Dura', 'Efêmera', 'Estressante', 'Exigente',
    'Experimental', 'Fugaz', 'Humana', 'Imprevisível', 'Inconstante', 'Intensa', 'Louca', 'Melancólica',
    'Misteriosa', 'Monótona', 'Mundana', 'Passageira', 'Rápida', 'Real', 'Rotineira', 'Subjetiva', 'Tumultuada'
];

const FRASES_LOADING = [
    "Hey ChatGPT write some jokes here 😂",
    "Calma aí, tô fazendo Cálculos...",
    "Está preparado para a crise existencial?",
    "Se quiser ir pegar uma água, eu te espero...",
    "Certeza que não quer ir buscar água?",
    "É sempre bom se hidratar. Mas ok. Minha parte eu fiz.",
    "Está pronto! Vamos lá..."
];

const TIMELINES_DEF = {
    childhood: { id: 'childhood', label: "Infância (0-11)", color: "bg-[#00E5FF]", start: 0, end: 11, desc: "Infância: dos 0 aos 11 anos. O lugar nostálgico." },
    adolescence: { id: 'adolescence', label: "Adolescência (12-17)", color: "bg-[#FF00CC]", start: 12, end: 17, desc: "Fase cheia de hormônios e incertezas." },
    adulthood: { id: 'adulthood', label: "Fase Adulta (18-59)", color: "bg-[#00CC66]", start: 18, end: 59, desc: "O auge da vida humana (e dos boletos)." },
    elderly: { id: 'elderly', label: "Terceira Idade (60+)", color: "bg-[#6600CC]", start: 60, end: 122, desc: "A fase das 'vagas preferenciais'." },
    school: { id: 'school', label: "Ensino Fundamental", color: "bg-[#FF9900]", start: 6, end: 14, desc: "A Odisseia educacional." },
    highschool: { id: 'highschool', label: "Ensino Médio", color: "bg-[#3366FF]", start: 15, end: 17, desc: "Expectativa vs Realidade." },
    college: { id: 'college', label: "Ensino Superior", color: "bg-[#FFCC00]", start: 18, end: 22, desc: "Média de 5 anos (Fonte: INEP)." },
};

// ==========================================
// 2. ESTADO GLOBAL
// ==========================================

let state = {
    screen: 'onboarding', // 'onboarding', 'loading', 'result'
    step: 0,
    viewMode: 'years', // 'years', 'months', 'weeks'
    clipAtDeath: false,
    zoom: 1,
    formData: { 
        name: '', 
        birthDate: '', 
        workYears: '', 
        deathAge: '', 
        lifeAdjective: '' 
    },
    tempAdjectives: []
};

const app = document.getElementById('app');
const tooltipContainer = document.getElementById('tooltip-container');
const tooltipContent = document.getElementById('tooltip-content');

// ==========================================
// 3. LÓGICA MATEMÁTICA (REGRA 48 & ESTATÍSTICAS)
// ==========================================

function getWeekIndex48(day) {
    if (day <= 7) return 0;
    if (day <= 14) return 1;
    if (day <= 22) return 2;
    return 3;
}

function calculateBlocksFromBirth(targetDate, birthDate) {
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();
    const targetWeek = getWeekIndex48(targetDay);

    const diffMonths = (targetYear - birthYear) * 12 + (targetMonth - birthMonth);
    return (diffMonths * 4) + targetWeek;
}

function blockToDateInfo48(blockIndex, birthDate) {
    const lifeYearIndex = Math.floor(blockIndex / 48);
    const remainingBlocks = blockIndex % 48;
    const monthsSinceBirthMonth = Math.floor(remainingBlocks / 4);
    
    const d = new Date(birthDate);
    d.setFullYear(birthDate.getFullYear() + lifeYearIndex);
    d.setMonth(birthDate.getMonth() + monthsSinceBirthMonth);
    
    const monthName = d.toLocaleString('pt-BR', { month: 'long' });
    const labelDate = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${d.getFullYear()}`;
    
    return { labelDate, weekOfLife: blockIndex };
}

function calculateStats(birthYear, currentAge, deathAge) {
    const yearsLeft = Math.max(0, deathAge - currentAge);
    const currentYear = new Date().getFullYear();
    const deathYear = currentYear + yearsLeft;
    
    let elections = 0, copas = 0, olympics = 0;
    for (let y = 2026; y <= deathYear; y += 4) elections++;
    for (let y = 2026; y <= deathYear; y += 4) copas++;
    for (let y = 2028; y <= deathYear; y += 4) olympics++;
    
    const solarEclipses = [2045, 2046, 2075, 2125, 2186].filter(y => y > currentYear && y <= deathYear).length;
    const totalLunarEclipses = Math.floor(yearsLeft / 2.5);
    const books = Math.ceil(yearsLeft * 2.5);
    const births = Math.floor(yearsLeft * 2500000).toLocaleString('pt-BR');
    
    return { elections, copas, olympics, solarEclipses, totalLunarEclipses, books, births };
}

function getLifeData() {
    const [day, month, year] = state.formData.birthDate.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day, 12, 0, 0);
    const today = new Date();
    
    let ageYears = today.getFullYear() - year;
    if (today.getMonth() < (month - 1) || (today.getMonth() === (month - 1) && today.getDate() < day)) ageYears--;
    const currentAge = Math.max(0, ageYears);
    const deathAgeInt = parseInt(state.formData.deathAge);

    let totalBlocks, livedBlocks, blocksPerRow, multiplier;
    let offsetNewYear = -1; // -1 significa que não vamos desenhar linha de ano novo

    if (state.viewMode === 'years') {
        blocksPerRow = 10;
        multiplier = 1;
        livedBlocks = currentAge;
        totalBlocks = state.clipAtDeath ? deathAgeInt + 1 : 123;

    } else if (state.viewMode === 'months') {
        blocksPerRow = 12;
        multiplier = 12;
        livedBlocks = (currentAge * 12) + (today.getMonth() - (month - 1));
        offsetNewYear = (12 - (month - 1)) % 12;
        
        if (state.clipAtDeath) {
            // Até Dezembro do ano da morte
            const blocksToDeathYear = deathAgeInt * 12;
            const monthsToDec = (11 - (month - 1));
            totalBlocks = blocksToDeathYear + monthsToDec + 2; // + margem
        } else {
            totalBlocks = 123 * 12;
        }

    } else { // WEEKS (Regra 48)
        blocksPerRow = 48;
        multiplier = 48;
        livedBlocks = calculateBlocksFromBirth(today, birthDate);
        offsetNewYear = ((12 - (month - 1)) % 12) * 4; 

        if (state.clipAtDeath) {
            const deathDate = new Date(year + deathAgeInt, 11, 28);
            totalBlocks = calculateBlocksFromBirth(deathDate, birthDate) + 1;
        } else {
            totalBlocks = 123 * 48;
        }
    }

    return { 
        birthDate, birthYear: year, currentAge, deathAgeInt,
        totalBlocks, livedBlocks, blocksPerRow, multiplier, offsetNewYear 
    };
}

// ==========================================
// 4. FUNÇÕES DE RENDERIZAÇÃO (TELAS)
// ==========================================

function render() {
    // Atualiza ícones após qualquer renderização
    requestAnimationFrame(() => lucide.createIcons());
    
    if (state.screen === 'onboarding') return renderOnboarding();
    if (state.screen === 'loading') return renderLoading();
    if (state.screen === 'result') return renderCalendar();
}

// --- TELA 1: ONBOARDING ---

function renderOnboarding() {
    if (state.step === 0 && !state.hasStarted) {
        app.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full p-6 font-sans text-gray-800 animate-fade-in bg-white">
            <div class="max-w-2xl text-center space-y-8">
                <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">Olá você aí :)</h1>
                <p class="text-xl md:text-2xl text-gray-600 leading-relaxed">Espero que esteja preparado para colocar toda a sua vida em perspectiva e <span class="line-through decoration-red-500 decoration-2">muito provavelmente</span> ter uma mini crise existencial.</p>
                <p class="text-lg text-gray-500 mt-4">Pois é meu amigo, é nisso que dá parar para pensar sobre a vida. Então continue por sua conta em risco!</p>
                <button onclick="startOnboarding()" class="mt-8 px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-xl">Começar!</button>
            </div>
            <div class="fixed bottom-4 text-sm text-gray-400 text-center">
                <p>Feito por @dirlogenes e Gemini.</p>
            </div>
        </div>`;
        return;
    }

    const questions = [
        { q: "Qual o seu nome?", cap: "Eu poderia te chamar de 'meu bem', mas você ainda nem pagou um drink.", field: "name", type: "text", ph: "Meu Bem da Silva" },
        { q: "Qual sua data de nascimento?", cap: `Relaxa ${state.formData.name.split(' ')[0]}, prometo que não vou julgar seu signo.`, field: "birthDate", type: "text", ph: "DD/MM/AAAA" },
        { q: "Há quantos anos você já trabalha?", cap: "Se nunca trabalhou, digite 0.", field: "workYears", type: "number", ph: "0" },
        { q: "Com quantos anos você gostaria de ir de arrasta?", cap: "Verbete: ir de base; abraçar o capeta.", field: "deathAge", type: "number", ph: "90" },
        { q: "Defina sua vida em um adjetivo:", cap: "Singular e feminino (Ex: Caótica)", field: "lifeAdjective", type: "text", ph: "Caótica" }
    ];

    const curr = questions[state.step];
    const progress = ((state.step + 1) / 5) * 100;
    const deathMsg = state.step === 3 ? getDeathMessage(state.formData.deathAge) : "";
    
    // Lógica para sugestões de adjetivos
    let suggestionsHTML = "";
    if (state.step === 4 && state.tempAdjectives.length > 0) {
        suggestionsHTML = `<div class="mt-4 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            ${state.tempAdjectives.map(adj => 
                `<button onclick="fillAdjective('${adj}')" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors">${adj}</button>`
            ).join('')}
        </div>`;
    }

    app.innerHTML = `
    <div class="min-h-screen bg-white flex flex-col animate-slide-up">
        <div class="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto">
            <div class="w-full space-y-6">
                <div class="flex flex-col mb-4">
                    <div class="flex items-center text-gray-400 text-sm font-medium uppercase tracking-widest">
                        <span class="text-green-500 mr-2">${state.step + 1}</span> <i data-lucide="arrow-right" class="w-3 h-3 mx-2"></i> <span>5</span>
                    </div>
                    <div class="w-12 h-1 bg-gray-200 mt-1 rounded-full overflow-hidden">
                        <div class="h-full bg-green-500 transition-all duration-500" style="width: ${progress}%"></div>
                    </div>
                </div>

                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">${curr.q}</h2>
                <div class="text-lg text-gray-500 mb-8 font-light">${curr.cap}</div>
                
                <input type="${curr.type}" 
                       class="w-full text-3xl md:text-4xl border-b-2 border-gray-300 focus:border-gray-900 outline-none py-2 bg-transparent text-gray-800" 
                       placeholder="${curr.ph}" 
                       value="${state.formData[curr.field]}"
                       oninput="handleInput('${curr.field}', this.value)"
                       onkeydown="if(event.key === 'Enter') nextStep()"
                       id="inputField"
                       autofocus>
                
                ${state.step === 3 && deathMsg ? `<div class="mt-4 p-3 bg-gray-50 border-l-4 border-indigo-500 text-indigo-700 animate-fade-in">${deathMsg}</div>` : ''}
                ${suggestionsHTML}

                <div id="errorMsg" class="flex items-center text-red-500 mt-2 hidden">
                    <i data-lucide="alert-circle" class="w-4 h-4 mr-2"></i><span class="text-sm font-medium" id="errorText"></span>
                </div>

                <div class="pt-8">
                    <button onclick="nextStep()" class="group flex items-center px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all">
                        <span class="mr-2 font-medium">Próxima</span>
                        <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>`;
    
    setTimeout(() => {
        const el = document.getElementById('inputField');
        if(el) el.focus();
    }, 100);
}

// --- TELA 2: LOADING ---

function renderLoading() {
    let msgIndex = 0;
    
    // Função interna para atualizar o texto
    const updateMsg = () => {
        const msgEl = document.getElementById('loadingMsg');
        if (msgEl && msgIndex < FRASES_LOADING.length) {
            msgEl.innerText = FRASES_LOADING[msgIndex];
            msgEl.classList.remove('animate-zoom-in');
            void msgEl.offsetWidth; // trigger reflow
            msgEl.classList.add('animate-zoom-in');
            msgIndex++;
            if(msgIndex < FRASES_LOADING.length) {
                setTimeout(updateMsg, 2500);
            } else {
                setTimeout(() => {
                    state.screen = 'result';
                    render();
                }, 2000);
            }
        }
    };

    app.innerHTML = `
    <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <i data-lucide="loader-2" class="w-12 h-12 animate-spin text-green-400 mb-8"></i>
        <div class="h-24 flex items-center justify-center">
            <p id="loadingMsg" class="text-xl md:text-2xl font-light animate-zoom-in">Iniciando...</p>
        </div>
    </div>`;

    setTimeout(updateMsg, 100);
}

// --- TELA 3: CALENDÁRIO (RESULTADO) ---

function renderCalendar() {
    const data = getLifeData();
    
    // Dimensões e Zoom
    const baseWidth = state.viewMode === 'years' ? 600 : state.viewMode === 'months' ? 1000 : 1200;
    const rowGap = 60;
    const totalRows = Math.ceil(data.totalBlocks / data.blocksPerRow);
    
    // Construir Grid HTML
    let gridHTML = '';
    
    // Marcos Importantes
    const markers = [
        { year: 0, icon: "⭐", label: "Nascimento" },
        { year: 18, icon: "🔞", label: "Maioridade" },
        { year: 54, icon: "📉", label: "Nigéria (54)" },
        { year: 60, icon: "👵", label: "Idoso (60)" },
        { year: 65, icon: "👴", label: "Aposentadoria" },
        { year: data.deathAgeInt, icon: "⚰️", label: "Fim" }
    ];
    if (2061 - data.birthYear > 0) markers.push({ year: 2061 - data.birthYear, icon: "☄️", label: "Halley" });

    for (let i = 0; i < data.totalBlocks; i++) {
        // Cálculos de Estilo
        const isLived = i <= data.livedBlocks;
        const colIndex = i % data.blocksPerRow;
        const isBirthdayCol = state.viewMode !== 'years' && colIndex === 0;
        const isNewYearCol = state.viewMode !== 'years' && colIndex === data.offsetNewYear;
        
        // Definir Cor e Borda
        let bg = isLived ? 'bg-[#a0a0a0]' : 'bg-white';
        let border = 'border border-gray-400';
        let opacity = 'opacity-100';

        if (isBirthdayCol) {
            bg = isLived ? 'bg-gray-600' : 'bg-white';
            border = 'border-2 border-gray-900';
        } else if (isNewYearCol) {
            bg = isLived ? 'bg-gray-400' : 'bg-white';
            border = 'border-l-2 border-blue-400';
        }

        // Transparência pós-morte (se não cortado)
        const deathBlockIndex = data.deathAgeInt * data.multiplier + (data.multiplier - 1);
        if (!state.clipAtDeath && i > deathBlockIndex) {
            bg = 'bg-white';
            opacity = 'opacity-30';
        }

        // Ícones
        let content = '';
        const ageAtBlock = Math.floor(i / data.multiplier);
        
        // Verifica ícones
        markers.forEach(m => {
            let show = false;
            if (state.viewMode === 'years' && m.year === ageAtBlock) show = true;
            else if (m.year === ageAtBlock && colIndex === 0) show = true; // Mostra no aniversário
            // Morte especial na última semana
            if (m.label === "Fim" && state.viewMode === 'weeks' && m.year === ageAtBlock && colIndex === 47) show = true;
            if (show) content = `<span class="flex items-center justify-center w-full h-full leading-none select-none z-10 ${state.viewMode==='years'?'text-2xl':'text-[10px]'}">${m.icon}</span>`;
        });
        
        if (i === data.livedBlocks) content = `<span class="flex items-center justify-center w-full h-full leading-none select-none z-10 text-sm">ℹ️</span>`;

        gridHTML += `
            <div class="relative aspect-square ${bg} ${border} ${opacity} transition-colors hover:bg-yellow-100 z-20"
                 onmouseenter="showTooltip(event, ${i})"
                 onmouseleave="hideTooltip()">
                ${content}
            </div>
        `;
    }

    app.innerHTML = `
    <div class="flex flex-col h-screen bg-gray-50" onclick="hideTooltip()">
        <div class="bg-white shadow-sm z-30 p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0" onclick="event.stopPropagation()">
            <h1 class="text-2xl font-bold text-gray-800">A <span class="text-indigo-600 italic lowercase">${state.formData.lifeAdjective}</span> vida de <span class="text-indigo-600">${state.formData.name.split(' ')[0]}</span></h1>
            
            <div class="flex flex-col items-center gap-2">
                <div class="bg-gray-100 p-1 rounded-lg flex text-sm">
                    <button onclick="setMode('years')" class="px-4 py-1 rounded-md transition-all ${state.viewMode === 'years' ? 'bg-white shadow font-bold' : 'text-gray-500'}">Anos</button>
                    <button onclick="setMode('months')" class="px-4 py-1 rounded-md transition-all ${state.viewMode === 'months' ? 'bg-white shadow font-bold' : 'text-gray-500'}">Meses</button>
                    <button onclick="setMode('weeks')" class="px-4 py-1 rounded-md transition-all ${state.viewMode === 'weeks' ? 'bg-white shadow font-bold' : 'text-gray-500'}">Semanas</button>
                </div>
                <label class="flex items-center cursor-pointer text-xs text-gray-600 gap-2 select-none">
                    <input type="checkbox" class="accent-black" ${state.clipAtDeath ? 'checked' : ''} onchange="toggleClip(this.checked)"> Encerrar no fim
                </label>
            </div>

            <div class="flex gap-2 items-center">
                <div class="flex bg-gray-100 rounded-lg mr-2">
                    <button onclick="adjustZoom(-0.1)" class="p-2 hover:bg-gray-200 rounded-l-lg"><i data-lucide="zoom-out" class="w-4 h-4"></i></button>
                    <div class="px-2 py-2 text-xs font-mono text-gray-500 border-l border-r border-gray-200 flex items-center">${Math.round(state.zoom * 100)}%</div>
                    <button onclick="adjustZoom(0.1)" class="p-2 hover:bg-gray-200 rounded-r-lg"><i data-lucide="zoom-in" class="w-4 h-4"></i></button>
                </div>
                <button onclick="resetApp()" class="p-2 hover:bg-gray-100 rounded-full" title="Reiniciar"><i data-lucide="rotate-ccw" class="w-5 h-5"></i></button>
                <button onclick="window.print()" class="p-2 hover:bg-gray-100 rounded-full" title="Imprimir"><i data-lucide="printer" class="w-5 h-5"></i></button>
            </div>
        </div>

        <div class="flex-1 overflow-auto relative bg-gray-50 p-10 custom-scrollbar flex justify-center" onclick="hideTooltip()">
            <div style="width: ${baseWidth * state.zoom}px; min-height: ${(totalRows * (baseWidth/data.blocksPerRow + 60)) * state.zoom}px; position: relative;">
                <div style="transform: scale(${state.zoom}); transform-origin: top left; width: ${baseWidth}px; position: absolute; top: 0; left: 0;"> 
                    
                    <div class="grid" style="grid-template-columns: repeat(${data.blocksPerRow}, minmax(0, 1fr)); gap: 4px; row-gap: 60px;">
                        ${gridHTML}
                    </div>

                    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
                        ${renderTimelinesHTML(data, baseWidth)}
                    </div>

                </div>
            </div>
        </div>
        
        <div class="bg-white p-2 text-center text-xs text-gray-400 shrink-0 border-t">
            Feito por @dirlogenes e Gemini.
        </div>
    </div>
    `;
}

// Gera o HTML das barras de timeline coloridas
function renderTimelinesHTML(data, containerWidth) {
    let html = '';
    const gap = 4;
    const colWidth = (containerWidth - (data.blocksPerRow - 1) * gap) / data.blocksPerRow;
    const blockHeight = colWidth;
    const rowGap = 60;
    const totalRows = Math.ceil(data.totalBlocks / data.blocksPerRow);

    // Define as timelines dinâmicas (sono, telas)
    const deathAge = data.deathAgeInt;
    const currentAge = data.currentAge;
    const yearsLeft = Math.max(0, deathAge - currentAge);
    
    const timelines = [
        TIMELINES_DEF.childhood, TIMELINES_DEF.school,
        TIMELINES_DEF.adolescence, TIMELINES_DEF.highschool,
        TIMELINES_DEF.college, TIMELINES_DEF.adulthood, 
        { ...TIMELINES_DEF.elderly, end: deathAge },
        { id: 'sleep', label: "Sono", color: "bg-blue-900", start: 0, end: Math.floor(currentAge/3), desc: "Tempo dormindo (Passado)" },
        { id: 'screens', label: "Telas", color: "bg-red-600", start: currentAge, end: Math.min(deathAge, currentAge + Math.floor(yearsLeft * 0.4)), desc: "Tempo em telas (Futuro)" }
    ];

    // Loop complexo para desenhar linhas através das quebras de linha do grid
    for (let r = 0; r < totalRows; r++) {
        const rowStart = r * data.blocksPerRow;
        const rowEnd = (r + 1) * data.blocksPerRow - 1;
        
        let rowTimelines = timelines.filter(t => {
            const tStart = t.start * data.multiplier;
            const tEnd = (t.end + 1) * data.multiplier - 1;
            // Se clipAtDeath, não desenha além
            if (state.clipAtDeath && tStart >= data.totalBlocks) return false;
            return tStart <= rowEnd && tEnd >= rowStart;
        }).map(t => {
            const tStart = t.start * data.multiplier;
            const tEnd = (t.end + 1) * data.multiplier - 1;
            const segStart = Math.max(tStart, rowStart);
            const segEnd = Math.min(tEnd, rowEnd);
            const finalEnd = Math.min(segEnd, data.totalBlocks - 1); // Clip visual
            
            return { ...t, colStart: segStart % data.blocksPerRow, colEnd: finalEnd % data.blocksPerRow };
        });

        // Organizar para não sobrepor (lanes)
        rowTimelines.sort((a,b) => a.colStart - b.colStart);
        let lanes = [];
        rowTimelines.forEach(seg => {
            let placed = false;
            for(let i=0; i<lanes.length; i++) {
                if(seg.colStart > lanes[i]) {
                    seg.lane = i; lanes[i] = seg.colEnd; placed = true; break;
                }
            }
            if(!placed) { seg.lane = lanes.length; lanes.push(seg.colEnd); }
        });

        rowTimelines.forEach(seg => {
            const left = seg.colStart * (colWidth + gap);
            const width = ((seg.colEnd - seg.colStart + 1) * colWidth) + ((seg.colEnd - seg.colStart) * gap);
            const top = (r * (blockHeight + rowGap)) + blockHeight + 6 + (seg.lane * 8);
            
            html += `<div class="absolute h-1.5 rounded-full ${seg.color} opacity-80 pointer-events-auto cursor-help hover:brightness-125" 
                          style="left: ${left}px; width: ${width}px; top: ${top}px;"
                          title="${seg.label}: ${seg.desc}"></div>`;
        });
    }
    return html;
}

// ==========================================
// 5. CONTROLADORES DE AÇÃO (UI HANDLERS)
// ==========================================

window.startOnboarding = () => {
    state.hasStarted = true;
    render();
};

window.handleInput = (field, value) => {
    if (field === 'birthDate') {
        value = value.replace(/\D/g, '');
        if (value.length > 2) value = value.slice(0,2) + '/' + value.slice(2);
        if (value.length > 5) value = value.slice(0,5) + '/' + value.slice(5,9);
        value = value.slice(0, 10);
    }
    if (field === 'lifeAdjective') {
        state.tempAdjectives = value.length > 0 
            ? LISTA_ADJETIVOS.filter(a => a.toLowerCase().startsWith(value.toLowerCase())).slice(0, 6) 
            : [];
        render(); 
        // Hack: manter foco
        setTimeout(() => {
            const el = document.getElementById('inputField');
            if(el) { el.focus(); el.value = value; }
        }, 0);
    }
    state.formData[field] = value;
};

window.fillAdjective = (adj) => {
    state.formData.lifeAdjective = adj;
    state.tempAdjectives = [];
    render();
};

window.nextStep = () => {
    const s = state.step;
    const f = state.formData;
    let err = '';

    if (s === 0 && f.name.length < 2) err = "Nome muito curto.";
    if (s === 1) {
        if(f.birthDate.length !== 10) err = "Data inválida.";
        else {
            const [d,m,y] = f.birthDate.split('/').map(Number);
            if(y > new Date().getFullYear()) err = "Você veio do futuro?";
            if(y < 1900) err = "Você é um vampiro?";
        }
    }
    if (s === 3) {
        const age = parseInt(f.deathAge);
        const birthY = parseInt(f.birthDate.split('/')[2]);
        const currAge = new Date().getFullYear() - birthY;
        if(age <= currAge) err = "Você planeja morrer no passado?";
    }
    if (s === 4 && f.lifeAdjective.length < 3) err = "Escolha um adjetivo.";

    if (err) {
        const el = document.getElementById('errorMsg');
        document.getElementById('errorText').innerText = err;
        el.classList.remove('hidden');
        return;
    }

    if (state.step < 4) {
        state.step++;
        state.tempAdjectives = [];
        render();
    } else {
        state.screen = 'loading';
        render();
    }
};

// Funções do Calendário
window.setMode = (m) => { state.viewMode = m; state.zoom = m==='years'?1:0.8; render(); };
window.toggleClip = (c) => { state.clipAtDeath = c; render(); };
window.adjustZoom = (delta) => { state.zoom = Math.max(0.2, Math.min(3, state.zoom + delta)); render(); };
window.resetApp = () => { state.screen = 'onboarding'; state.step = 0; state.hasStarted = false; state.formData = {name:'', birthDate:'', workYears:'', deathAge:'', lifeAdjective:''}; render(); };

// Tooltips
window.showTooltip = (e, index) => {
    const data = getLifeData();
    let title, sub;
    
    if (state.viewMode === 'weeks') {
        const info = blockToDateInfo48(index, data.birthDate);
        title = `Semana ${index} de Vida`;
        sub = info.labelDate;
    } else if (state.viewMode === 'months') {
        const y = data.birthYear + Math.floor(index/12);
        title = `${Math.floor(index/12)} Anos`;
        sub = `Mês ${index%12 + 1} de ${y}`;
    } else {
        title = `${index} Anos`;
        sub = data.birthYear + index;
    }

    // Estatísticas no tooltip "Hoje"
    let statsHTML = "";
    if (index === data.livedBlocks) {
        const s = calculateStats(data.birthYear, data.currentAge, data.deathAgeInt);
        statsHTML = `
        <div class="mt-2 pt-2 border-t border-gray-700 text-xs space-y-1">
            <p class="font-bold text-yellow-400">Futuro Estimado:</p>
            <p>🗳️ ${s.elections} Eleições</p>
            <p>⚽ ${s.copas} Copas</p>
            <p>☀️ ${s.solarEclipses} Eclipses Solares</p>
            <p>📚 ~${s.books} Livros para ler</p>
        </div>`;
    }

    tooltipContent.innerHTML = `
        <div class="font-bold text-base">${title}</div>
        <div class="text-gray-400 mb-1">${sub}</div>
        ${statsHTML}
    `;
    
    tooltipContainer.classList.remove('hidden', 'opacity-0');
    tooltipContainer.classList.add('opacity-100');
    
    // Posicionar
    const x = e.clientX;
    const y = e.clientY;
    const rect = tooltipContent.getBoundingClientRect();
    
    // Ajuste para não sair da tela
    let left = x - rect.width / 2;
    let top = y - rect.height - 15;
    
    if (left < 10) left = 10;
    if (left + rect.width > window.innerWidth) left = window.innerWidth - rect.width - 10;
    if (top < 10) top = y + 20;

    tooltipContainer.style.left = `${left}px`;
    tooltipContainer.style.top = `${top}px`;
};

window.hideTooltip = () => {
    tooltipContainer.classList.add('opacity-0');
    setTimeout(() => tooltipContainer.classList.add('hidden'), 200);
};

// Utilitário de mensagem de morte
function getDeathMessage(age) {
    const a = parseInt(age);
    if (a === 27) return "Clube dos 27? Rock'n roll.";
    if (a > 100) return "O próprio Matusalém!";
    if (a < 60) return "Tão cedo?";
    return "Boa meta.";
}

// Iniciar
render();
