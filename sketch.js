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

// Variáveis para guardar os botões da UI
let btnBFS, btnDFS, btnUCS, btnGreedy, btnAstar;
let btnStart;

// --- VARIÁVEIS DO MOVIMENTO DO AGENTE ---
let currentPath = []; // Array de Nós do caminho encontrado
let pathIndex = 0;    // Em qual nó do caminho o agente está
let movementTimer = 0; // Timer para controlar a velocidade de movimento


// --- FUNÇÃO PRELOAD DO P5.JS ---
function preload() {
  imgAgent = loadImage('agent.png');
  imgFood = loadImage('food.png');
}

// --- FUNÇÃO DE SETUP DO P5.JS ---
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  imageMode(CENTER); 

  // Calcula o tamanho das células
  cellWidth = CANVAS_WIDTH / COLS;
  cellHeight = CANVAS_HEIGHT / ROWS;

  // Chama a função que cria nossa UI (botões)
  createUI();

  // Gera o mapa inicial
  generateNewWorld();
}

// --- FUNÇÃO DE DRAW DO P5.JS ---
function draw() {
  background(51); 
  
  // 1. Desenha o grid (terrenos)
  drawGrid();
  
  // 2. LÓGICA DE ANIMAÇÃO DA BUSCA
  if (gameState === 'SEARCHING' && currentSearch) {
    currentSearch.step(); 

    // Verifica se a busca terminou
    if (currentSearch.status === 'FOUND') {
      gameState = 'MOVING';
      
      // Inicializa o movimento
      currentPath = currentSearch.path; // Salva o caminho
      pathIndex = 0; // Começa do primeiro nó (posição inicial)
      movementTimer = millis(); // Reseta o timer de movimento
      
      console.log("Caminho encontrado!");
      
    } else if (currentSearch.status === 'FAILED') {
      gameState = 'IDLE';
      console.log("Não foi possível encontrar um caminho!");
    }
  }
  
  // 3. DESENHA A VISUALIZAÇÃO (VISITADOS / FRONTEIRA)
  if (currentSearch) {
    drawSearchVisualization();
  }
  
  // 4. LÓGICA DE MOVIMENTO DO AGENTE
  if (gameState === 'MOVING' && currentPath.length > 0) {
    handleAgentMovement(); // Chama a função de movimento
  }
  
  // 5. DESENHA O CAMINHO FINAL
  if (currentPath.length > 0) {
    drawFinalPath(currentPath); 
  }
  
  // 6. Desenha a comida e o agente por cima de tudo
  drawFood();
  drawAgent();
}

// --- FUNÇÃO DE INTERAÇÃO (teclado) ---
function keyPressed() {
  generateNewWorld();
}

// --- FUNÇÃO PARA CRIAR A UI (BOTÕES) ---
function createUI() {
  // Cria os botões
  btnBFS = createButton('Busca em Largura (BFS)');
  btnDFS = createButton('Busca em Profundidade (DFS)');
  btnUCS = createButton('Custo Uniforme (UCS)');
  btnGreedy = createButton('Gulosa');
  btnAstar = createButton('A* (A-Estrela)');
  
  // Define o 'pai' (a div #controls)
  btnBFS.parent('controls');
  btnDFS.parent('controls');
  btnUCS.parent('controls');
  btnGreedy.parent('controls');
  btnAstar.parent('controls');

  // Agrupa os botões de algoritmo
  let algoButtons = [btnBFS, btnDFS, btnUCS, btnGreedy, btnAstar];

  // Vincula as funções de callback
  btnBFS.mousePressed(() => selectAlgorithm('BFS', btnBFS, algoButtons));
  btnDFS.mousePressed(() => selectAlgorithm('DFS', btnDFS, algoButtons));
  btnUCS.mousePressed(() => selectAlgorithm('UCS', btnUCS, algoButtons));
  btnGreedy.mousePressed(() => selectAlgorithm('Gulosa', btnGreedy, algoButtons));
  btnAstar.mousePressed(() => selectAlgorithm('A*', btnAstar, algoButtons));

  // Botão Iniciar
  btnStart = createButton('INICIAR BUSCA');
  btnStart.parent('controls');

  btnStart.mousePressed(startSearch);
  
  // Ativa o BFS por padrão
  btnBFS.addClass('active'); 
}

// --- FUNÇÃO CHAMADA PELOS BOTÕES DE ALGORITMO ---
function selectAlgorithm(algo, clickedButton, allButtons) {
  if (gameState === 'SEARCHING') return; 

  currentAlgorithm = algo;
  console.log("Algoritmo selecionado:", currentAlgorithm);

  for (let btn of allButtons) {
    btn.removeClass('active');
  }
  clickedButton.addClass('active');
}

// --- FUNÇÃO CHAMADA PELO BOTÃO "INICIAR BUSCA" ---
function startSearch() {
  if (gameState === 'IDLE') {
    
    // Reseta o caminho anterior
    currentPath = []; 
    pathIndex = 0;
    
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
      console.log(`Iniciando busca com ${currentAlgorithm}!`);
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
  
  // Reseta as variáveis de caminho
  currentPath = [];
  pathIndex = 0;
  
  console.log("Novo mapa gerado. Selecione um algoritmo.");
}

// --- FUNÇÃO PARA DESENHAR A ANIMAÇÃO DA BUSCA ---
function drawSearchVisualization() {
  if (!currentSearch) return;

  // 1. Desenha os nós VISITADOS
  fill(0, 255, 255, 100); 
  noStroke();
  if (currentSearch.visited && currentSearch.visited instanceof Set) {
    for (let node of currentSearch.visited) {
      rect(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight);
    }
  }

  // 2. Desenha a FRONTEIRA (apenas durante a busca)
  if (gameState === 'SEARCHING' && currentSearch.frontier) {
    fill(0, 255, 0, 150); 
    noStroke();
    
    let frontierArray = Array.isArray(currentSearch.frontier) ? currentSearch.frontier : currentSearch.frontier.items;
    
    if (frontierArray) {
      for (let node of frontierArray) {
        rect(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight);
      }
    }
  }
}

// --- FUNÇÃO PARA DESENHAR O CAMINHO FINAL ---
function drawFinalPath(path) {
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
}

// --- FUNÇÃO: CONTROLA O MOVIMENTO DO AGENTE ---
// (Esta função estava faltando no seu arquivo)
function handleAgentMovement() {
  // 1. Verifica se já chegou ao fim do caminho
  if (pathIndex >= currentPath.length - 1) {
    handleFoodCollection();
    return;
  }

  // 2. Pega o PRÓXIMO nó
  let nextNode = currentPath[pathIndex + 1];

  // 3. Pega o CUSTO do terreno
  let cost = getCellCost(nextNode.x, nextNode.y);

  // 4. Define o DELAY (Aumente estes valores para testar)
  let delay = 100; // Custo baixo (areia)
  if (cost === 5) { // Custo médio (atoleiro)
    delay = 500;
  } else if (cost === 10) { // Custo alto (água)
    delay = 1000; // (1 segundo)
  }

  // 5. Verifica se o timer passou do delay
  if (millis() - movementTimer > delay) {
    // 6. Avança para o próximo passo
    pathIndex++;
    
    // 7. ATUALIZA A POSIÇÃO REAL DO AGENTE
    let newPosNode = currentPath[pathIndex];
    agent.x = newPosNode.x;
    agent.y = newPosNode.y;
    
    // 8. Reseta o timer
    movementTimer = millis();
  }
}

// --- FUNÇÃO: CONTROLA O LOOP DO JOGO ---
// (Esta função também estava faltando)
function handleFoodCollection() {
  console.log("Comida coletada!");
  
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
