// --- VARIÁVEIS DE ESTADO GLOBAIS ---
let grid = [];
let agent;
let food;

// Variáveis para as imagens
let imgAgent;
let imgFood;

// Variáveis de dimensão (calculadas no setup)
let cellWidth;
let cellHeight;

// Variáveis para gerenciar o estado
let currentSearch = null; 
let currentAlgorithm = 'BFS'; 
let gameState = 'IDLE';      
let isPaused = false;

// Variáveis para guardar os botões da UI
let btnBFS, btnDFS, btnUCS, btnGreedy, btnAstar;
let btnPlayPause, btnNewMap;

// Variáveis para controle de velocidade
let searchSpeed = 1;
let btnSpeed1x, btnSpeed2x, btnSpeed3x;

// --- VARIÁVEIS DO MOVIMENTO DO AGENTE ---
let currentPath = []; // Array de Nós do caminho encontrado
let pathIndex = 0;    // Em qual nó do caminho o agente está
let movementTimer = 0; // Timer para controlar a velocidade de movimento
let collectionTimer = 0; // Timer para o delay de coleta de 10s

// NOVO: Variável para guardar nosso elemento <p> de status
let statusDisplay;

// NOVO: Variáveis para o log de mensagens
let messageLog = [];
const MAX_LOG_LINES = 3;

// --- VARIÁVEIS DE MÉTRICAS ---
let metrics = {
  nodesVisited: 0,
  frontierSize: 0,
  pathCost: 0,
  pathLength: 0,
  searchTime: 0,
  foodCollected: 0,
  searchStartTime: 0
};

// --- VARIÁVEIS PARA SLIDERS ---
let obstacleSlider, waterSlider, mudSlider;

// --- VARIÁVEIS PARA ANIMAÇÕES ---
let foodCollectionAnimation = false;
let foodCollectionTimer = 0;

// --- VARIÁVEIS PARA AVISOS VISUAIS ---
let hasPendingChanges = false;

// --- VARIÁVEIS PARA ABAS E MODAL ---
let currentTab = 'single';
let debounceTimer = null;
let comparisonResults = [];

// --- VARIÁVEIS PARA COMPARATIVO ---
let isRunningComparison = false;
let comparisonAlgorithms = ['BFS', 'DFS', 'UCS', 'Gulosa', 'A*'];
let comparisonPaths = {}; // Armazena os caminhos de cada algoritmo
let currentComparisonAlgorithm = null;
let comparisonAnimationId = null;

// --- FUNÇÃO PRELOAD DO P5.JS ---
function preload() {
  imgAgent = loadImage('agent.png');
  imgFood = loadImage('food.png');
}

// --- FUNÇÃO DE SETUP DO P5.JS ---
/**
 * Configuração inicial do P5.js
 * Cria o canvas, calcula dimensões das células e inicializa o mundo
 */
function setup() {
  let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent('main-container');
  imageMode(CENTER); 

  cellWidth = CANVAS_WIDTH / COLS;
  cellHeight = CANVAS_HEIGHT / ROWS;

  createUI();
  generateNewWorld();
}

/**
 * Loop principal de renderização do P5.js
 * Desenha o grid, visualizações de busca, caminhos e entidades
 */
function draw() {
  background(51); 
  
  // 1. Desenha o grid (terrenos)
  drawGrid();
  
  // 2. LÓGICA DE ANIMAÇÃO DA BUSCA
  // Controle de velocidade dinâmico
  let frameSkip = searchSpeed === 1 ? 4 : searchSpeed === 2 ? 2 : 1;
  
  if (gameState === 'SEARCHING' && currentSearch && (frameCount % frameSkip === 0)) {    

  currentSearch.step(); 
    
    // Atualiza métricas durante a busca
    calculateSearchMetrics();

    // Verifica se a busca terminou
    if (currentSearch.status === 'FOUND' && gameState === 'SEARCHING') {
      // Muda o estado para evitar múltiplas execuções
      gameState = 'COLLECTING';
      
      // Define o caminho final encontrado
      currentPath = currentSearch.path;
      pathIndex = 0;
      
      // Calcula métricas finais
      calculateSearchMetrics();
      
      // Coleta a comida
      collectFood();
      
    } else if (currentSearch.status === 'FAILED') {
      gameState = 'IDLE';
      updatePlayPauseButton('▶️ INICIAR BUSCA', false);
      updateStatusMessage("Falha na busca: Não foi possível encontrar um caminho!");
    }
  }
  
  // 3. DESENHA A VISUALIZAÇÃO (VISITADOS / FRONTEIRA)
  if (currentSearch) {
    drawSearchVisualization();
  }
  
  // 4. LÓGICA REMOVIDA - O jogo agora finaliza ao encontrar a comida
  
  // 6. DESENHA O CAMINHO FINAL
  if (currentPath.length > 0) {
    drawFinalPath(currentPath); 
  }
  
  // 7. Desenha a comida e o agente
  if (food) {
  drawFood(); 
  }
  drawAgent();
  
  // 8. Atualiza métricas no dashboard
  updateMetrics();
}

// --- FUNÇÃO DE INTERAÇÃO (teclado) ---

/**
 * Encontra uma posição válida para a comida que tenha caminho até o agente
 * @returns {Object} Posição {x, y} da comida com caminho garantido
 */
function findValidFoodPosition() {
  let maxAttempts = 100; // Limite de tentativas para evitar loop infinito
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    let foodPos = findValidPosition();
    
    // Verifica se existe caminho do agente até a comida
    if (hasValidPath(agent, foodPos)) {
      return foodPos;
    }
    
    attempts++;
  }
  
  // Se não conseguir encontrar uma posição válida, retorna uma posição aleatória
  console.warn('Não foi possível encontrar posição com caminho válido, usando posição aleatória');
  return findValidPosition();
}

/**
 * Verifica se existe um caminho válido entre dois pontos usando BFS
 * @param {Object} start - Posição inicial {x, y}
 * @param {Object} goal - Posição final {x, y}
 * @returns {boolean} True se existe caminho, false caso contrário
 */
function hasValidPath(start, goal) {
  // Usa BFS simples para verificar conectividade
  let visited = new Set();
  let queue = [start];
  visited.add(`${start.x},${start.y}`);
  
  while (queue.length > 0) {
    let current = queue.shift();
    
    // Se chegou ao objetivo, existe caminho
    if (current.x === goal.x && current.y === goal.y) {
      return true;
    }
    
    // Verifica vizinhos (4 direções)
    let neighbors = [
      {x: current.x + 1, y: current.y},
      {x: current.x - 1, y: current.y},
      {x: current.x, y: current.y + 1},
      {x: current.x, y: current.y - 1}
    ];
    
    for (let neighbor of neighbors) {
      let key = `${neighbor.x},${neighbor.y}`;
      
      // Verifica se está dentro dos limites e não foi visitado
      if (neighbor.x >= 0 && neighbor.x < COLS && 
          neighbor.y >= 0 && neighbor.y < ROWS && 
          !visited.has(key)) {
        
        // Verifica se não é obstáculo
        if (grid[neighbor.x][neighbor.y] !== OBSTACLE) {
          visited.add(key);
          queue.push(neighbor);
        }
      }
    }
  }
  
  return false;
}

// --- FUNÇÃO PARA COLETAR COMIDA ---
function collectFood() {
  // Verifica se já está coletando para evitar múltiplas execuções
  if (gameState !== 'COLLECTING') return;
  
  // Incrementa contador de comidas coletadas
  metrics.foodCollected++;
  
  // Ativa animação de coleta
  foodCollectionAnimation = true;
  foodCollectionTimer = millis();
  
  // Remove a comida do ambiente
  food = null;
  
  // Atualiza status
  updateStatusMessage(`🍎 Comida coletada! Total: ${metrics.foodCollected}`);
  
  // Reinicia o mapa e gera nova comida após um delay maior para mostrar o caminho
  setTimeout(() => {
    resetMapAndGenerateNewFood();
  }, 3000); // Aumentei o delay para 3s para mostrar o caminho
}

// --- FUNÇÃO PARA RESETAR MAPA E GERAR NOVA COMIDA ---
function resetMapAndGenerateNewFood() {
  // Limpa completamente o estado anterior
  currentPath = [];
  pathIndex = 0;
  currentSearch = null;
  
  // Limpa visualização anterior
  if (window.originalGrid) {
    window.originalGrid = null;
  }
  
  // Gera novo mapa
  generateRandomMap();
  
  // Gera nova posição para o agente
  agent = findValidPosition();
  
  // Gera nova comida com caminho válido garantido
  food = findValidFoodPosition();
  
  // Reseta estado da busca
  gameState = 'IDLE';
  
  // Reseta métricas de busca (mas mantém comidas coletadas)
  metrics.nodesVisited = 0;
  metrics.frontierSize = 0;
  metrics.pathCost = 0;
  metrics.pathLength = 0;
  metrics.searchTime = 0;
  
  // Para animação de coleta
  foodCollectionAnimation = false;
  foodCollectionTimer = 0;
  
  // Atualiza botão
  updatePlayPauseButton('▶️ INICIAR BUSCA', false);
  
  updateStatusMessage("Novo mapa gerado! Reiniciando busca automaticamente...");
  
  // Reinicia a busca automaticamente após um pequeno delay
  setTimeout(() => {
    if (currentAlgorithm && gameState === 'IDLE') {
      startSearch();
    }
  }, 1000);
}

// --- FUNÇÃO PARA REINICIAR BUSCA ---
function resetForNewSearch() {
  // Gera nova comida com caminho válido garantido
  food = findValidFoodPosition();
  
  // Reseta estado da busca
  gameState = 'IDLE';
  currentSearch = null;
  currentPath = [];
  pathIndex = 0;
  
  // Reseta métricas de busca (mas mantém comidas coletadas)
  metrics.nodesVisited = 0;
  metrics.frontierSize = 0;
  metrics.pathCost = 0;
  metrics.pathLength = 0;
  metrics.searchTime = 0;
  
  // Para animação de coleta
  foodCollectionAnimation = false;
  foodCollectionTimer = 0;
  
  // Atualiza botão
  updatePlayPauseButton('▶️ INICIAR BUSCA', false);
  
  updateStatusMessage("Nova comida gerada! Selecione um algoritmo e inicie a busca.");
}

// --- FUNÇÃO PARA CRIAR A UI (BOTÕES) ---
function createUI() {
  // Cria seções organizadas em ordem lógica
  createMapControlsSection();
  createAlgorithmSection();
  createSearchControlsSection();
  createTabControls();
  createModalControls();
  
  // Cria o parágrafo de status
  statusDisplay = createP('Carregando...');
  statusDisplay.id('status-message');
  statusDisplay.parent('message-container');
  messageLog = ['Carregando...'];
  
  // Inicializa os sliders de configuração
  setupTerrainSliders();
}

// --- FUNÇÃO PARA CRIAR SEÇÃO DE ALGORITMOS ---
function createAlgorithmSection() {
  // Cria container para algoritmos
  let algoSection = createDiv();
  algoSection.addClass('control-section');
  algoSection.parent('controls');
  
  // Título da seção
  let title = createP('🧠 Algoritmo de Busca');
  title.addClass('control-section-title');
  title.parent(algoSection);
  
  // Container dos botões em grid
  let algoContainer = createDiv();
  algoContainer.addClass('algorithm-group');
  algoContainer.parent(algoSection);
  
  // Cria os botões de seleção de algoritmo com nomes mais descritivos
  btnBFS = createButton('BFS - Largura');
  btnDFS = createButton('DFS - Profundidade');
  btnUCS = createButton('UCS - Custo Uniforme');
  btnGreedy = createButton('Gulosa - Heurística');
  btnAstar = createButton('A* - A-Estrela');
  
  // Define o 'pai' (o container de algoritmos)
  btnBFS.parent(algoContainer);
  btnDFS.parent(algoContainer);
  btnUCS.parent(algoContainer);
  btnGreedy.parent(algoContainer);
  btnAstar.parent(algoContainer);

  // Agrupa os botões de algoritmo
  let algoButtons = [btnBFS, btnDFS, btnUCS, btnGreedy, btnAstar];

  // Vincula as funções de callback
  btnBFS.mousePressed(() => selectAlgorithm('BFS', btnBFS, algoButtons));
  btnDFS.mousePressed(() => selectAlgorithm('DFS', btnDFS, algoButtons));
  btnUCS.mousePressed(() => selectAlgorithm('UCS', btnUCS, algoButtons));
  btnGreedy.mousePressed(() => selectAlgorithm('Gulosa', btnGreedy, algoButtons));
  btnAstar.mousePressed(() => selectAlgorithm('A*', btnAstar, algoButtons));
  
  // Ativa o BFS por padrão
  btnBFS.addClass('active'); 
}

// --- FUNÇÃO PARA CRIAR SEÇÃO DE CONTROLES DE BUSCA ---
function createSearchControlsSection() {
  // Cria container para controles de busca
  let searchSection = createDiv();
  searchSection.addClass('control-section');
  searchSection.parent('controls');
  
  // Título da seção
  let title = createP('▶️ Execução da Busca');
  title.addClass('control-section-title');
  title.parent(searchSection);
  
  // Container principal dos controles
  let mainControlsContainer = createDiv();
  mainControlsContainer.addClass('control-group');
  mainControlsContainer.parent(searchSection);
  
  // Botão Play/Pause
  btnPlayPause = createButton('▶️ Iniciar Busca');
  btnPlayPause.parent(mainControlsContainer);
  btnPlayPause.id('play-pause-btn');
  btnPlayPause.mousePressed(togglePlayPause);
  
  // Container para controles de velocidade
  let speedContainer = createDiv();
  speedContainer.addClass('control-group');
  speedContainer.parent(searchSection);
  
  // Título para velocidade
  let speedTitle = createP('Velocidade:');
  speedTitle.style('margin: 5px 0; color: #ccc; font-size: 12px;');
  speedTitle.parent(speedContainer);
  
  // Botões de Velocidade
  btnSpeed1x = createButton('1x');
  btnSpeed1x.parent(speedContainer);
  btnSpeed1x.addClass('speed-btn');
  btnSpeed1x.addClass('active');
  btnSpeed1x.mousePressed(() => setSearchSpeed(1));
  
  btnSpeed2x = createButton('2x');
  btnSpeed2x.parent(speedContainer);
  btnSpeed2x.addClass('speed-btn');
  btnSpeed2x.mousePressed(() => setSearchSpeed(2));
  
  btnSpeed3x = createButton('3x');
  btnSpeed3x.parent(speedContainer);
  btnSpeed3x.addClass('speed-btn');
  btnSpeed3x.mousePressed(() => setSearchSpeed(3));
}

// --- FUNÇÃO PARA CRIAR SEÇÃO DE CONTROLES DE MAPA ---
function createMapControlsSection() {
  // Cria container para controles de mapa
  let mapSection = createDiv();
  mapSection.addClass('control-section');
  mapSection.parent('controls');
  
  // Título da seção
  let title = createP('🗺️ Configuração do Ambiente');
  title.addClass('control-section-title');
  title.parent(mapSection);
  
  // Container dos controles
  let controlsContainer = createDiv();
  controlsContainer.addClass('control-group');
  controlsContainer.parent(mapSection);
  
  // Botão Novo Mapa
  btnNewMap = createButton('Gerar Novo Mapa');
  btnNewMap.parent(controlsContainer);
  btnNewMap.id('new-map-btn');
  btnNewMap.mousePressed(generateNewWorld);
}

// --- FUNÇÃO PARA CRIAR CONTROLES DAS ABAS ---
function createTabControls() {
  // Configura abas
  let tabSingle = document.getElementById('tab-single');
  let tabComparison = document.getElementById('tab-comparison');
  let contentSingle = document.getElementById('content-single');
  let contentComparison = document.getElementById('content-comparison');
  
  if (tabSingle && tabComparison) {
    tabSingle.addEventListener('click', () => switchTab('single'));
    tabComparison.addEventListener('click', () => switchTab('comparison'));
  }
  
  // Configura botões do comparativo
  let btnRunComparison = document.getElementById('btn-run-comparison');
  let btnClearResults = document.getElementById('btn-clear-results');
  
  if (btnRunComparison) {
    btnRunComparison.addEventListener('click', runComparison);
  }
  
  if (btnClearResults) {
    btnClearResults.addEventListener('click', clearComparisonResults);
  }
}

// --- FUNÇÃO PARA CRIAR CONTROLES DO MODAL ---
function createModalControls() {
  let modal = document.getElementById('confirmation-modal');
  let modalConfirm = document.getElementById('modal-confirm');
  let modalCancel = document.getElementById('modal-cancel');
  
  if (modalConfirm) {
    modalConfirm.addEventListener('click', () => hideModal(true));
  }
  
  if (modalCancel) {
    modalCancel.addEventListener('click', () => hideModal(false));
  }
}

// --- FUNÇÃO PARA CONFIGURAR OS SLIDERS DE TERRAIN ---
function setupTerrainSliders() {
  // Configura os sliders existentes no HTML
  obstacleSlider = document.getElementById('obstacle-slider');
  waterSlider = document.getElementById('water-slider');
  mudSlider = document.getElementById('mud-slider');
  
  if (obstacleSlider) {
    obstacleSlider.addEventListener('input', function() {
      updateTerrainConfig('obstacle', this.value);
    });
  }
  
  if (waterSlider) {
    waterSlider.addEventListener('input', function() {
      updateTerrainConfig('water', this.value);
    });
  }
  
  if (mudSlider) {
    mudSlider.addEventListener('input', function() {
      updateTerrainConfig('mud', this.value);
    });
  }
  
  // Atualiza a UI inicial
  updateTerrainUI();
}

// --- FUNÇÃO PARA ATUALIZAR MÉTRICAS NO DASHBOARD ---
function updateMetrics() {
  // Atualiza algoritmo atual
  const currentAlgorithmEl = document.getElementById('current-algorithm');
  if (currentAlgorithmEl) {
    currentAlgorithmEl.textContent = currentAlgorithm;
  }
  
  // Atualiza status
  const currentStatusEl = document.getElementById('current-status');
  if (currentStatusEl) {
    let statusText = '';
    switch(gameState) {
      case 'IDLE': statusText = 'Aguardando'; break;
      case 'SEARCHING': statusText = 'Buscando...'; break;
      case 'PAUSED': statusText = 'Pausado'; break;
      case 'FINISHED': statusText = 'Finalizado'; break;
      case 'COLLECTING': statusText = 'Coletando'; break;
      case 'MOVING': statusText = 'Movendo'; break;
      default: statusText = 'Desconhecido';
    }
    currentStatusEl.textContent = statusText;
  }
  
  // Atualiza nós visitados
  const nodesVisitedEl = document.getElementById('nodes-visited');
  if (nodesVisitedEl) {
    nodesVisitedEl.textContent = metrics.nodesVisited;
  }
  
  // Atualiza tamanho da fronteira
  const frontierSizeEl = document.getElementById('frontier-size');
  if (frontierSizeEl) {
    frontierSizeEl.textContent = metrics.frontierSize;
  }
  
  // Atualiza custo do caminho
  const pathCostEl = document.getElementById('path-cost');
  if (pathCostEl) {
    pathCostEl.textContent = metrics.pathCost;
  }
  
  // Atualiza comprimento do caminho
  const pathLengthEl = document.getElementById('path-length');
  if (pathLengthEl) {
    pathLengthEl.textContent = metrics.pathLength;
  }
  
  // Atualiza tempo de busca (formatado em segundos com 2 casas decimais)
  const searchTimeEl = document.getElementById('search-time');
  if (searchTimeEl) {
    let timeInSeconds = (metrics.searchTime / 1000).toFixed(2);
    searchTimeEl.textContent = timeInSeconds + 's';
  }
  
  // Atualiza comidas coletadas
  const foodCollectedEl = document.getElementById('food-collected');
  if (foodCollectedEl) {
    foodCollectedEl.textContent = metrics.foodCollected;
  }
}

// --- FUNÇÃO PARA CALCULAR MÉTRICAS DA BUSCA ---
function calculateSearchMetrics() {
  if (!currentSearch) return;
  
  // Calcula nós visitados
  if (currentSearch.visited && currentSearch.visited instanceof Set) {
    metrics.nodesVisited = currentSearch.visited.size;
  } else if (currentSearch.costSoFar && currentSearch.costSoFar instanceof Map) {
    metrics.nodesVisited = currentSearch.costSoFar.size;
  }
  
  // Calcula tamanho da fronteira
  if (currentSearch.frontier) {
    if (Array.isArray(currentSearch.frontier)) {
      metrics.frontierSize = currentSearch.frontier.length;
    } else if (currentSearch.frontier.items) {
      metrics.frontierSize = currentSearch.frontier.items.length;
    }
  }
  
  // Calcula custo e comprimento do caminho
  if (currentPath && currentPath.length > 0) {
    metrics.pathLength = currentPath.length;
    metrics.pathCost = calculatePathCost(currentPath);
  }
  
  // Calcula tempo de busca
  if (gameState === 'SEARCHING' && metrics.searchStartTime > 0) {
    metrics.searchTime = millis() - metrics.searchStartTime;
  }
}

// --- FUNÇÃO PARA CALCULAR CUSTO TOTAL DO CAMINHO ---
function calculatePathCost(path) {
  let totalCost = 0;
  for (let i = 0; i < path.length - 1; i++) {
    let node = path[i];
    totalCost += getCellCost(node.x, node.y);
  }
  return totalCost;
}

// --- FUNÇÃO PARA ALTERNAR PLAY/PAUSE ---
function togglePlayPause() {
  if (gameState === 'IDLE' || gameState === 'PAUSED') {
    // Iniciar ou continuar busca
    if (!currentSearch) {
      startSearch();
      updatePlayPauseButton('⏸️ PAUSAR BUSCA', false);
    } else {
      gameState = 'SEARCHING';
      isPaused = false;
      updatePlayPauseButton('⏸️ PAUSAR BUSCA', false);
      updateStatusMessage('Busca retomada.');
    }
  } else if (gameState === 'SEARCHING') {
    // Pausar busca
    gameState = 'PAUSED';
    isPaused = true;
    updatePlayPauseButton('▶️ CONTINUAR BUSCA', false);
    updateStatusMessage('Busca pausada.');
  }
}

// --- FUNÇÃO PARA ATUALIZAR TEXTO E ESTADO DO BOTÃO PLAY/PAUSE ---
function updatePlayPauseButton(text, disabled) {
  if (btnPlayPause) {
    btnPlayPause.html(text);
    if (disabled) {
      btnPlayPause.attribute('disabled', '');
    } else {
      btnPlayPause.removeAttribute('disabled');
    }
  }
}

// --- FUNÇÃO PARA DEFINIR VELOCIDADE DA BUSCA ---
function setSearchSpeed(speed) {
  searchSpeed = speed;
  
  // Remove classe active de todos os botões de velocidade
  btnSpeed1x.removeClass('active');
  btnSpeed2x.removeClass('active');
  btnSpeed3x.removeClass('active');
  
  // Adiciona classe active ao botão selecionado
  if (speed === 1) btnSpeed1x.addClass('active');
  else if (speed === 2) btnSpeed2x.addClass('active');
  else if (speed === 3) btnSpeed3x.addClass('active');
  
  updateStatusMessage(`Velocidade alterada para ${speed}x.`);
}

// --- FUNÇÃO PARA DESTACAR O BOTÃO NOVO MAPA ---
function highlightNewMapButton() {
  if (btnNewMap) {
    btnNewMap.addClass('pending-changes');
  }
}

// --- FUNÇÃO PARA REMOVER DESTAQUE DO BOTÃO NOVO MAPA ---
function unhighlightNewMapButton() {
  if (btnNewMap) {
    btnNewMap.removeClass('pending-changes');
  }
}

// --- FUNÇÕES PARA GERENCIAR ABAS ---
function switchTab(tabName) {
  // Remove active de todas as abas
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  // Ativa a aba selecionada
  document.getElementById(`tab-${tabName}`).classList.add('active');
  document.getElementById(`content-${tabName}`).classList.add('active');
  
  // Controla visibilidade do dashboard
  const dashboard = document.getElementById('dashboard');
  if (tabName === 'comparison') {
    dashboard.style.display = 'none';
    document.body.classList.add('tab-comparison-active');
  } else {
    dashboard.style.display = 'block';
    document.body.classList.remove('tab-comparison-active');
  }
  
  currentTab = tabName;
}

// --- FUNÇÕES PARA GERENCIAR MODAL ---
function showModal(title, message, onConfirm, onCancel) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-message').textContent = message;
  document.getElementById('confirmation-modal').style.display = 'block';
  
  // Mostra ou esconde o botão cancelar dependendo se há callback
  const cancelButton = document.getElementById('modal-cancel');
  if (onCancel === null || onCancel === undefined) {
    cancelButton.style.display = 'none';
  } else {
    cancelButton.style.display = 'inline-block';
  }
  
  // Armazena callbacks
  window.modalConfirmCallback = onConfirm;
  window.modalCancelCallback = onCancel;
}

function hideModal(confirmed) {
  document.getElementById('confirmation-modal').style.display = 'none';
  
  if (confirmed && window.modalConfirmCallback) {
    window.modalConfirmCallback();
  } else if (!confirmed && window.modalCancelCallback) {
    window.modalCancelCallback();
  }
  
  window.modalConfirmCallback = null;
  window.modalCancelCallback = null;
}

// --- FUNÇÕES PARA COMPARATIVO ---
async function runComparison() {
  if (isRunningComparison) return;
  
  isRunningComparison = true;
  const btnRun = document.getElementById('btn-run-comparison');
  btnRun.textContent = '⏳ Executando...';
  btnRun.disabled = true;
  
  comparisonResults = [];
  comparisonPaths = {};
  
  // Limpa visualizações anteriores
  currentPath = [];
  currentSearch = null;
  if (window.originalGrid) {
    window.originalGrid = null;
  }
  
  // Limpa a visualização de caminhos anteriores
  const visualizationDiv = document.getElementById('path-visualization');
  if (visualizationDiv) {
    visualizationDiv.innerHTML = '<p style="color: #ccc; margin: 0;">Clique em "Ver Caminho" em qualquer algoritmo para visualizar seu caminho no grid.</p>';
  }
  
  // Salva configurações atuais
  let originalAlgorithm = currentAlgorithm;
  let originalSpeed = searchSpeed;
  
  // Gera UM mapa completamente novo para todos os algoritmos
  generateRandomMap();
  
  // Salva uma cópia IMUTÁVEL do mapa original para usar em todos os algoritmos
  let originalGrid = grid.map(row => [...row]);
  
  let startPos = findValidPosition();
  let goalPos = findValidFoodPosition(); // Usa a função que garante caminho válido
  
  // Define as posições no ambiente para visualização
  agent = {x: startPos.x, y: startPos.y};
  food = {x: goalPos.x, y: goalPos.y};
  
  // Inicia animação de loading
  startComparisonAnimation();
  
  // Executa cada algoritmo no MESMO mapa (cópia imutável)
  for (let algo of comparisonAlgorithms) {
    await runSingleComparisonOnMap(algo, startPos, goalPos, originalGrid);
  }
  
  // Para animação de loading
  stopComparisonAnimation();
  
  // Restaura o grid original completamente limpo para visualização
  grid = originalGrid.map(row => [...row]);
  agent = {x: startPos.x, y: startPos.y};
  food = {x: goalPos.x, y: goalPos.y};
  
  // Salva o grid original limpo globalmente para uso nas visualizações
  window.originalGrid = originalGrid.map(row => [...row]);
  window.comparisonStartPos = {x: startPos.x, y: startPos.y};
  window.comparisonGoalPos = {x: goalPos.x, y: goalPos.y};
  
  // Restaura configurações
  currentAlgorithm = originalAlgorithm;
  searchSpeed = originalSpeed;
  
  // Exibe resultados
  displayComparisonResults();
  
  // Restaura botão
  btnRun.textContent = '🚀 Executar Comparativo';
  btnRun.disabled = false;
  isRunningComparison = false;
}

/**
 * Executa um algoritmo de busca específico no mapa do comparativo
 * @param {string} algorithm - Nome do algoritmo ('BFS', 'DFS', 'UCS', 'Gulosa', 'A*')
 * @param {Object} startPos - Posição inicial {x, y}
 * @param {Object} goalPos - Posição final {x, y}
 * @param {Array} originalGrid - Grid original com obstáculos fixos
 * @returns {Promise} Promise que resolve quando a busca termina
 */
async function runSingleComparisonOnMap(algorithm, startPos, goalPos, originalGrid) {
  return new Promise((resolve) => {
    // Cria instância do algoritmo com as posições fixas
    let startNode = new Node(startPos.x, startPos.y);
    let goalNode = new Node(goalPos.x, goalPos.y);
    
    let searchInstance;
    switch (algorithm) {
      case 'BFS': searchInstance = new BfsSearch(startNode, goalNode); break;
      case 'DFS': searchInstance = new DfsSearch(startNode, goalNode); break;
      case 'UCS': searchInstance = new UcsSearch(startNode, goalNode); break;
      case 'Gulosa': searchInstance = new GreedySearch(startNode, goalNode); break;
      case 'A*': searchInstance = new AstarSearch(startNode, goalNode); break;
    }
    
    let startTime = millis();
    let nodesVisited = 0;
    let frontierSize = 0;
    let pathCost = 0;
    let pathLength = 0;
    let success = false;
    let visitedNodes = [];
    let frontierNodes = [];
    
    // Executa busca até encontrar resultado
    let stepCount = 0;
    const maxSteps = 10000; // Limite de segurança
    
    function runStep() {
      if (searchInstance.status === 'SEARCHING' && stepCount < maxSteps) {
        searchInstance.step();
        stepCount++;
        
        // Captura nós visitados e fronteira para visualização
        if (searchInstance.visited && searchInstance.visited instanceof Set) {
          nodesVisited = searchInstance.visited.size;
          visitedNodes = Array.from(searchInstance.visited).map(node => ({x: node.x, y: node.y}));
        } else if (searchInstance.costSoFar && searchInstance.costSoFar instanceof Map) {
          nodesVisited = searchInstance.costSoFar.size;
          visitedNodes = Array.from(searchInstance.costSoFar.keys()).map(node => ({x: node.x, y: node.y}));
        }
        
        if (searchInstance.frontier) {
          if (Array.isArray(searchInstance.frontier)) {
            frontierSize = searchInstance.frontier.length;
            frontierNodes = searchInstance.frontier.map(node => ({x: node.x, y: node.y}));
          } else if (searchInstance.frontier.items) {
            frontierSize = searchInstance.frontier.items.length;
            frontierNodes = searchInstance.frontier.items.map(node => ({x: node.x, y: node.y}));
          }
        }
        
        if (searchInstance.status === 'FOUND') {
          success = true;
          pathLength = searchInstance.path.length;
          pathCost = calculatePathCost(searchInstance.path);
          
          // Armazena o caminho encontrado
          comparisonPaths[algorithm] = {
            path: searchInstance.path.map(node => ({x: node.x, y: node.y})),
            visited: visitedNodes,
            frontier: frontierNodes,
            start: {x: startPos.x, y: startPos.y},
            goal: {x: goalPos.x, y: goalPos.y}
          };
        }
        
        setTimeout(runStep, 1); // Pequeno delay para não travar o browser
      } else {
        let endTime = millis();
        let searchTime = endTime - startTime;
        
        comparisonResults.push({
          algorithm: algorithm,
          success: success,
          nodesVisited: nodesVisited,
          frontierSize: frontierSize,
          pathCost: pathCost,
          pathLength: pathLength,
          searchTime: searchTime
        });
        
        resolve();
      }
    }
    
    runStep();
  });
}


function displayComparisonResults() {
  const resultsContainer = document.getElementById('comparison-results');
  
  if (comparisonResults.length === 0) {
    resultsContainer.innerHTML = '<p>Nenhum resultado disponível.</p>';
    return;
  }
  
  let html = '<div class="control-section"><div class="control-section-title">📊 Resultados do Comparativo</div>';
  html += '<table class="comparison-table">';
  html += '<thead><tr><th>Algoritmo</th><th>Sucesso</th><th>Nós Visitados</th><th>Custo</th><th>Comprimento</th><th>Tempo (s)</th><th>Visualização</th></tr></thead>';
  html += '<tbody>';
  
  // Encontra melhores resultados
  let bestNodes = Math.min(...comparisonResults.filter(r => r.success).map(r => r.nodesVisited));
  let bestCost = Math.min(...comparisonResults.filter(r => r.success).map(r => r.pathCost));
  let bestTime = Math.min(...comparisonResults.filter(r => r.success).map(r => r.searchTime));
  
  comparisonResults.forEach(result => {
    let successText = result.success ? '✅' : '❌';
    let timeText = (result.searchTime / 1000).toFixed(2);
    
    let nodesClass = (result.success && result.nodesVisited === bestNodes) ? 'best-result' : '';
    let costClass = (result.success && result.pathCost === bestCost) ? 'best-result' : '';
    let timeClass = (result.success && result.searchTime === bestTime) ? 'best-result' : '';
    
    // Botão para visualizar caminho
    let visualizeButton = result.success ? 
      `<button class="btn-secondary" onclick="showAlgorithmPath('${result.algorithm}')" style="font-size: 12px; padding: 4px 8px;">Ver Caminho</button>` : 
      '<span style="color: #666;">-</span>';
    
    html += `<tr>
      <td>${result.algorithm}</td>
      <td>${successText}</td>
      <td class="${nodesClass}">${result.nodesVisited}</td>
      <td class="${costClass}">${result.pathCost}</td>
      <td>${result.pathLength}</td>
      <td class="${timeClass}">${timeText}</td>
      <td>${visualizeButton}</td>
    </tr>`;
  });
  
  html += '</tbody></table></div>';
  
  // Adiciona seção de visualização dos caminhos
  html += '<div class="control-section" style="margin-top: 20px;"><div class="control-section-title">🗺️ Visualização dos Caminhos</div>';
  html += '<div id="path-visualization" style="text-align: center; padding: 20px; background-color: #1a1a1a; border-radius: 8px; margin-top: 10px;">';
  html += '<p style="color: #ccc; margin: 0;">Clique em "Ver Caminho" em qualquer algoritmo para visualizar seu caminho no grid.</p>';
  html += '</div></div>';
  
  resultsContainer.innerHTML = html;
}

function clearComparisonResults() {
  comparisonResults = [];
  comparisonPaths = {};
  document.getElementById('comparison-results').innerHTML = '';
}

// --- FUNÇÃO PARA MOSTRAR CAMINHO DO ALGORITMO ---
window.showAlgorithmPath = function(algorithm) {
  if (!comparisonPaths[algorithm]) {
    console.log('Caminho não encontrado para', algorithm);
    return;
  }
  
  currentComparisonAlgorithm = algorithm;
  const pathData = comparisonPaths[algorithm];
  
  
  // Atualiza o grid com o caminho do algoritmo
  updateGridWithPath(pathData);
  
  // Atualiza a mensagem de visualização
  const visualizationDiv = document.getElementById('path-visualization');
  if (visualizationDiv) {
    let visitedCount = pathData.visited ? pathData.visited.length : 0;
    let pathCost = pathData.path ? calculatePathCostFromNodes(pathData.path) : 0;
    let pathLength = pathData.path ? pathData.path.length : 0;
    
    visualizationDiv.innerHTML = `
      <h4 style="color: #4CAF50; margin: 0 0 10px 0;">Caminho do ${algorithm}</h4>
      <p style="color: #ccc; margin: 0 0 10px 0;">
        Nós Visitados: ${visitedCount} | 
        Custo: ${pathCost} | 
        Comprimento: ${pathLength}
      </p>
      <button class="btn-secondary" onclick="clearPathVisualization()" style="font-size: 12px; padding: 4px 8px;">🗑️ Limpar Visualização</button>
    `;
  }
}

// --- FUNÇÃO PARA ATUALIZAR O GRID COM O CAMINHO ---
function updateGridWithPath(pathData) {
  // NÃO modifica o grid global - apenas define variáveis para visualização
  if (!window.originalGrid) {
    console.warn('window.originalGrid não encontrado!');
    return;
  }
  
  // Restaura o grid original SEMPRE antes de aplicar visualizações
  grid = window.originalGrid.map(row => [...row]);
  
  // Define posições do agente e comida
  if (pathData.start) {
    agent = pathData.start;
  }
  if (pathData.goal) {
    food = pathData.goal;
  }
  
  // Define o caminho final para ser desenhado
  if (pathData.path && pathData.path.length > 0) {
    currentPath = pathData.path.map(node => {
      if (node instanceof Node) {
        return node;
      } else {
        return new Node(node.x, node.y);
      }
    });
  } else {
    currentPath = [];
  }
  
  // Armazena dados de visualização para desenho
  window.currentPathData = {
    visited: pathData.visited || [],
    frontier: pathData.frontier || []
  };
}

// --- FUNÇÃO PARA LIMPAR VISUALIZAÇÃO ---
window.clearPathVisualization = function() {
  if (window.originalGrid) {
    grid = window.originalGrid.map(row => [...row]);
  }
  
  currentPath = [];
  currentComparisonAlgorithm = null;
  window.currentPathData = null; // Limpa dados de visualização do comparativo
  
  const visualizationDiv = document.getElementById('path-visualization');
  if (visualizationDiv) {
    visualizationDiv.innerHTML = '<p style="color: #ccc; margin: 0;">Clique em "Ver Caminho" em qualquer algoritmo para visualizar seu caminho no grid.</p>';
  }
}

// --- FUNÇÃO AUXILIAR PARA CALCULAR CUSTO DO CAMINHO ---
function calculatePathCostFromNodes(pathNodes) {
  let totalCost = 0;
  for (let i = 0; i < pathNodes.length - 1; i++) {
    let node = pathNodes[i];
    if (node.x >= 0 && node.x < COLS && node.y >= 0 && node.y < ROWS) {
      let terrainType = window.originalGrid ? window.originalGrid[node.x][node.y] : grid[node.x][node.y];
      switch (terrainType) {
        case TERRAIN_LOW_COST: totalCost += 1; break;
        case TERRAIN_MEDIUM_COST: totalCost += 5; break;
        case TERRAIN_HIGH_COST: totalCost += 10; break;
        default: totalCost += 1; break;
      }
    }
  }
  return totalCost;
}

// --- FUNÇÕES DE ANIMAÇÃO DO COMPARATIVO ---
function startComparisonAnimation() {
  let animationFrame = 0;
  
  function animate() {
    if (isRunningComparison) {
      // Cria efeito de pulsação no grid
      for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
          if (grid[i][j] !== OBSTACLE) {
            // Adiciona efeito visual baseado no frame
            let intensity = sin((animationFrame + i + j) * 0.1) * 0.3 + 0.7;
            // Aplica efeito visual (será implementado no draw)
          }
        }
      }
      
      animationFrame++;
      comparisonAnimationId = requestAnimationFrame(animate);
    }
  }
  
  animate();
}

function stopComparisonAnimation() {
  if (comparisonAnimationId) {
    cancelAnimationFrame(comparisonAnimationId);
    comparisonAnimationId = null;
  }
}

// --- FUNÇÃO CHAMADA PELOS BOTÕES DE ALGORITMO ---
function selectAlgorithm(algo, clickedButton, allButtons) {
  // Se estiver buscando ou pausado, mostra modal informativo
  if (gameState === 'SEARCHING' || gameState === 'PAUSED') {
    showModal(
      'Busca em Andamento',
      'Não é possível trocar de algoritmo durante uma busca. Por favor, gere um novo mapa ou aguarde a conclusão para selecionar outro algoritmo.',
      () => {
        // Apenas fecha o modal
      },
      null // Sem botão de cancelar
    );
    return;
  }

  // Armazena o algoritmo anterior
  let previousAlgorithm = currentAlgorithm;
  let previousButton = allButtons.find(btn => btn.hasClass('active'));

currentAlgorithm = algo;
  
  // Remove classe active de todos os botões
  for (let btn of allButtons) {
    btn.removeClass('active');
  }
  
  // Adiciona classe active ao botão clicado
  clickedButton.addClass('active');

  // Marca que há mudanças pendentes
  hasPendingChanges = true;
  
  // Mostra modal de confirmação
  showModal(
    'Algoritmo Alterado',
    `Você selecionou o algoritmo ${currentAlgorithm}. Clique em "Gerar novo mapa" para aplicar a mudança.`,
    () => {
      updateStatusMessage(`Algoritmo selecionado: ${currentAlgorithm}. Clique em "Gerar novo mapa" para aplicar.`);
      highlightNewMapButton();
    },
    () => {
      // Callback de cancelamento - volta ao estado anterior
      currentAlgorithm = previousAlgorithm;
      if (previousButton) {
        previousButton.addClass('active');
      }
      clickedButton.removeClass('active');
      hasPendingChanges = false;
      unhighlightNewMapButton();
    }
  );
}

// --- FUNÇÃO CHAMADA PELO BOTÃO "INICIAR BUSCA" ---
function startSearch() {
  if (gameState === 'IDLE') {
    
    // Reseta o caminho anterior
    currentPath = []; 
    pathIndex = 0;
    
    // Reseta métricas
    metrics.nodesVisited = 0;
    metrics.frontierSize = 0;
    metrics.pathCost = 0;
    metrics.pathLength = 0;
    metrics.searchTime = 0;
    metrics.searchStartTime = millis();
    
    let startNode = new Node(agent.x, agent.y);
    let goalNode = new Node(food.x, food.y);
    
    // O 'switch' de integração
    switch (currentAlgorithm) {
      case 'BFS':
        currentSearch = new BfsSearch(startNode, goalNode);
        break;
      case 'DFS':
        currentSearch = new DfsSearch(startNode, goalNode);
        break;
      case 'UCS':
        currentSearch = new UcsSearch(startNode, goalNode);
        break;
      case 'Gulosa':
        currentSearch = new GreedySearch(startNode, goalNode);
        break;
      case 'A*':
        currentSearch = new AstarSearch(startNode, goalNode);
        break;
      default:
        console.error("Algoritmo desconhecido:", currentAlgorithm);
        return;
    }
    
    // Inicia a busca
    if (currentSearch) {
      gameState = 'SEARCHING';
      updatePlayPauseButton('⏸️ PAUSAR BUSCA', false);
      updateStatusMessage(`Iniciando busca com ${currentAlgorithm}!`);
    }
  }
}

// --- FUNÇÃO PARA GERAR O MUNDO E RESETAR ---
function generateNewWorld() {
  generateRandomMap(); 
  agent = findValidPosition(); 
  food = findValidPosition(); 
  
  gameState = 'IDLE'; 
  currentSearch = null; 
  isPaused = false;
  
  // Reseta as variáveis de caminho
  messageLog = [];
  pathIndex = 0;
  currentPath = []; // Limpa a linha amarela da busca anterior
  
  // Reseta métricas (mas mantém comidas coletadas)
  metrics.nodesVisited = 0;
  metrics.frontierSize = 0;
  metrics.pathCost = 0;
  metrics.pathLength = 0;
  metrics.searchTime = 0;
  // metrics.foodCollected não é resetado - mantém o total
  
  // Reseta flag de mudanças pendentes
  hasPendingChanges = false;
  
  // Remove destaque do botão novo mapa
  unhighlightNewMapButton();
  
  // Atualiza botão play/pause
  updatePlayPauseButton('▶️ INICIAR BUSCA', false);
  
  updateStatusMessage("Novo mapa gerado. Selecione um algoritmo e inicie a busca.");
}

// --- NOVA FUNÇÃO: ATUALIZA O LOG DE STATUS ---
function updateStatusMessage(newMessage) {
  // 1. Adiciona a nova mensagem ao log
  messageLog.push(newMessage);

  // 2. Se o log tiver mais de 3 linhas, remove a mais antiga
  if (messageLog.length > MAX_LOG_LINES) {
    messageLog.shift(); // Remove o primeiro item (o mais antigo)
  }

  // 3. Constrói a string HTML com quebras de linha
  let htmlString = messageLog.join('<br>');

  // 4. Atualiza o display
  if (statusDisplay) { // Garante que o display já foi criado
    statusDisplay.html(htmlString);
    
    // 5. Adiciona classe especial se for mensagem de finalização
    if (newMessage.includes('🎉') || newMessage.includes('Finalizado')) {
      statusDisplay.addClass('finish-message');
    } else {
      statusDisplay.removeClass('finish-message');
    }
  }
}

// --- FUNÇÃO PARA DESENHAR A ANIMAÇÃO DA BUSCA ---
// --- FUNÇÃO PARA DESENHAR A ANIMAÇÃO DA BUSCA ---
// (VERSÃO CORRIGIDA)
function drawSearchVisualization() {
  // Desenha visualização da busca ativa
  if (currentSearch) {
    drawActiveSearchVisualization();
  }
  
  // Desenha visualização do comparativo
  if (window.currentPathData) {
    drawComparisonVisualization();
  }
}

function drawActiveSearchVisualization() {
  if (!currentSearch) return;

  // 1. Desenha os nós VISITADOS (Ciano)
  fill(0, 255, 255, 100);
  noStroke();

  let visitedKeys;

  if (currentSearch.visited && currentSearch.visited instanceof Set) {
    visitedKeys = currentSearch.visited.keys();
  } 
  else if (currentSearch.costSoFar && currentSearch.costSoFar instanceof Map) {
    visitedKeys = currentSearch.costSoFar.keys();
  }

  if (visitedKeys) {
    for (let key of visitedKeys) {
      let [x, y] = key.split(',').map(Number);
      if (!isNaN(x) && !isNaN(y)) {
        rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  // 2. Desenha a FRONTEIRA (Verde)
  if (gameState === 'SEARCHING' && currentSearch.frontier) {
    fill(0, 255, 17, 100);
    noStroke();
    
    let frontierArray = Array.isArray(currentSearch.frontier) ? currentSearch.frontier : currentSearch.frontier.items;
    
    if (frontierArray) {
      for (let node of frontierArray) {
        rect(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight);
      }
    }
  }
}

function drawComparisonVisualization() {
  if (!window.currentPathData) return;

  // Desenha nós visitados (Ciano)
  if (window.currentPathData.visited && window.currentPathData.visited.length > 0) {
    fill(0, 255, 255, 100);
    noStroke();
    
    for (let node of window.currentPathData.visited) {
      if (node.x >= 0 && node.x < COLS && node.y >= 0 && node.y < ROWS) {
        rect(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  // Desenha fronteira (Verde)
  if (window.currentPathData.frontier && window.currentPathData.frontier.length > 0) {
    fill(0, 255, 17, 100);
    noStroke();
    
    for (let node of window.currentPathData.frontier) {
      if (node.x >= 0 && node.x < COLS && node.y >= 0 && node.y < ROWS) {
        rect(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight);
      }
    }
  }
}

// --- FUNÇÃO PARA DESENHAR O CAMINHO FINAL ---
function drawFinalPath(path) {
  if (!path || path.length === 0) return;
  
  // Desenha linha do caminho
  stroke(255, 255, 0); // Amarelo
  strokeWeight(4);
  noFill();
  
  beginShape();
  for (let node of path) {
    let cx = (node.x + 0.5) * cellWidth;
    let cy = (node.y + 0.5) * cellHeight;
    vertex(cx, cy);
  }
  endShape();
  
  // Desenha pontos do caminho
  fill(255, 255, 0); // Amarelo
  noStroke();
  for (let i = 0; i < path.length; i++) {
    let node = path[i];
    let cx = (node.x + 0.5) * cellWidth;
    let cy = (node.y + 0.5) * cellHeight;
    
    // Tamanho do ponto varia conforme a posição no caminho
    let size = i === 0 ? 8 : (i === path.length - 1 ? 10 : 6);
    ellipse(cx, cy, size, size);
  }
}

// --- FUNÇÃO: CONTROLA O MOVIMENTO DO AGENTE ---
// (Esta função estava faltando no seu arquivo)
// --- FUNÇÃO: CONTROLA O MOVIMENTO DO AGENTE ---
// (Versão corrigida: o delay é pago no terreno ATUAL)
function handleAgentMovement() {
  
  // 1. Pega o nó ONDE O AGENTE ESTÁ AGORA
  let currentNode = currentPath[pathIndex];

  // 2. Pega o CUSTO do terreno ATUAL
  let cost = getCellCost(currentNode.x, currentNode.y);

  // 3. Define o DELAY com base no terreno ATUAL
  // (Sinta-se à vontade para ajustar estes valores)
  let delay = 100; // Custo baixo (areia)
  if (cost === 5) { // Custo médio (atoleiro)
    delay = 500;
  } else if (cost === 10) { // Custo alto (água)
    delay = 1000; // (1 segundo)
  }

  // 4. Verifica se o timer (o tempo de espera no terreno ATUAL) já passou
  if (millis() - movementTimer > delay) {
    
    // 5. O tempo de espera acabou. Vamos ver se já chegamos ao fim.
    if (pathIndex >= currentPath.length - 1) {
      // Se sim, o agente estava esperando no último nó (o da comida).
      // Agora iniciamos o timer de 5s de coleta.
      gameState = 'COLLECTING';
      collectionTimer = millis(); 
      
      // Ativa animação de coleta
      foodCollectionAnimation = true;
      foodCollectionTimer = millis();
      
      // Comida desaparece após um pequeno delay para mostrar a animação
      setTimeout(() => {
        food = null;
        foodCollectionAnimation = false;
      }, 1000);
      
      updateStatusMessage("Comida coletada! Aguardando 5s para a próxima rodada...");
      return;
    }

    // 6. Se não, hora de mover para o PRÓXIMO nó.
    pathIndex++;
    
    // 7. ATUALIZA A POSIÇÃO REAL DO AGENTE (movimento instantâneo)
    let newPosNode = currentPath[pathIndex];
    agent.x = newPosNode.x;
    agent.y = newPosNode.y;
    
    // 8. Reseta o timer. O agente começa a "pagar o pedágio"
    //    do NOVO terreno em que ele acabou de pisar.
    movementTimer = millis();
  }
}

// --- FUNÇÃO: CONTROLA O LOOP DO JOGO ---
// (Esta função também estava faltando)
function handleFoodCollection() {
 updateStatusMessage("Delay acabou! Gerando nova comida e reiniciando a busca!");
  
  // 1. Gera uma nova comida
  food = findValidPosition();
  
  // 2. Reseta o estado
  gameState = 'IDLE'; 
  currentSearch = null;
  currentPath = [];
  pathIndex = 0;
  
  // 3. RECOMEÇA A BUSCA!
  startSearch();
}
