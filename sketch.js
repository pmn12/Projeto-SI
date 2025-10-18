// --- VARIÁVEIS DE ESTADO GLOBAIS ---
let grid = [];
let agent;
let food;
let imgAgent, imgFood;
let cellWidth, cellHeight;

// NOVO: Variáveis de estado da busca
let currentSearch; // Vai guardar a instância da classe de busca
let currentAlgorithm = 'BFS'; // Qual algo está selecionado
let gameState = 'IDLE'; // 'IDLE', 'SEARCHING', 'MOVING'

// ... (preload() continua igual) ...
function preload() {
  imgAgent = loadImage('agent.png');
  imgFood = loadImage('food.png');
}

// --- FUNÇÃO DE SETUP DO P5.JS ---
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  imageMode(CENTER);

  cellWidth = CANVAS_WIDTH / COLS;
  cellHeight = CANVAS_HEIGHT / ROWS;

  // --- NOVO: CRIAR A UI (BOTÕES) ---
  createButton('BFS').mousePressed(() => selectAlgorithm('BFS'));
  createButton('DFS').mousePressed(() => selectAlgorithm('DFS'));
  createButton('UCS').mousePressed(() => selectAlgorithm('UCS'));
  createButton('Gulosa').mousePressed(() => selectAlgorithm('Gulosa'));
  createButton('A*').mousePressed(() => selectAlgorithm('A*'));
  createButton('INICIAR BUSCA').mousePressed(startSearch);
  
  // Gera o mapa inicial
  generateNewWorld();
}

// --- FUNÇÃO DE DRAW DO P5.JS ---
function draw() {
  background(51); 
  drawGrid();
  
  // NOVO: Lógica de animação da busca
  if (gameState === 'SEARCHING' && currentSearch) {
    currentSearch.step(); // Executa UM passo da busca
    
    // Desenha a fronteira e os visitados
    drawSearchVisualization(); 

    // Verifica se a busca terminou
    if (currentSearch.status === 'FOUND') {
      gameState = 'MOVING'; // Próximo estado (Pessoa 4)
      // pathFound = currentSearch.path;
      console.log("Caminho encontrado!");
    } else if (currentSearch.status === 'FAILED') {
      gameState = 'IDLE';
      console.log("Não foi possível encontrar um caminho!");
    }
  }

  // Desenha a comida e o agente por cima de tudo
  drawFood();
  drawAgent();
}

// --- Funções de UI e Estado ---

function selectAlgorithm(algo) {
  currentAlgorithm = algo;
  console.log("Algoritmo selecionado:", algo);
  resetSearch(); // Para o algoritmo atual se um estiver rodando
}

function startSearch() {
  if (gameState === 'SEARCHING') return; // Já está buscando

  // (Aqui vocês precisam da classe Node da Pessoa 1)
  // let startNode = new Node(agent.x, agent.y);
  // let goalNode = new Node(food.x, food.y);
  
  // *** A MÁGICA DA INTEGRAÇÃO ACONTECE AQUI ***
  switch (currentAlgorithm) {
    case 'BFS':
      // currentSearch = new BfsSearch(startNode, goalNode);
      break;
    case 'DFS':
      // currentSearch = new DfsSearch(startNode, goalNode);
      break;
    case 'UCS':
      // currentSearch = new UcsSearch(startNode, goalNode);
      break;
    case 'Gulosa':
      // currentSearch = new GreedySearch(startNode, goalNode);
      break;
    case 'A*':
      // currentSearch = new AstarSearch(startNode, goalNode);
      break;
  }
  
  // Inicia a animação no loop draw()
  gameState = 'SEARCHING';
}

function resetSearch() {
  gameState = 'IDLE';
  currentSearch = null;
}

// --- FUNÇÃO DE INTERAÇÃO ---
function keyPressed() {
  generateNewWorld(); // Gera novo mapa e reseta a busca
}

// Função que gera o mundo e reseta tudo
function generateNewWorld() {
  generateRandomMap();
  agent = findValidPosition();
  food = findValidPosition();
  resetSearch();
  console.log("Novo mapa gerado. Selecione um algoritmo e inicie a busca.");
}

// NOVO: Função para desenhar a animação da busca
function drawSearchVisualization() {
  if (!currentSearch) return;

  // 1. Desenha os nós visitados (ex: ciano)
  fill(0, 255, 255, 100); // Ciano semi-transparente
  noStroke();
  for (let node of currentSearch.visited) {
    rect(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight);
  }

  // 2. Desenha a fronteira (ex: verde)
  fill(0, 255, 0, 150); // Verde semi-transparente
  noStroke();
  for (let node of currentSearch.frontier) {
    rect(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight);
  }
}
