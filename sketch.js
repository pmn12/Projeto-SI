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
let currentSearch = null; // Guarda a instância da classe de busca (ex: new BfsSearch(...))
let currentAlgorithm = 'BFS'; // Algoritmo padrão selecionado
let gameState = 'IDLE';      // Estado atual (IDLE, SEARCHING, MOVING)

// Variáveis para guardar os botões da UI
let btnBFS, btnDFS, btnUCS, btnGreedy, btnAstar;
let btnStart;


// --- FUNÇÃO PRELOAD DO P5.JS ---
// (Carrega as imagens antes do programa começar)
function preload() {
  imgAgent = loadImage('agent.png');
  imgFood = loadImage('food.png');
}

// --- FUNÇÃO DE SETUP DO P5.JS ---
// (Executada uma vez no início)
function setup() {
  
frameRate(30);
  
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  imageMode(CENTER); // Facilita desenhar imagens pelo centro

  // Calcula o tamanho das células com base nas configs
  cellWidth = CANVAS_WIDTH / COLS;
  cellHeight = CANVAS_HEIGHT / ROWS;

  // Chama a função que cria nossa UI (botões)
  createUI();

  // Gera o mapa inicial
  generateNewWorld();
}

// --- FUNÇÃO DE DRAW DO P5.JS ---
// (Executada 60x por segundo em loop)
// --- FUNÇÃO DE DRAW DO P5.JS ---
function draw() {
  background(51); 
  
  // 1. Desenha o grid (terrenos)
  drawGrid();
  
  // 2. LÓGICA DE ANIMAÇÃO DA BUSCA
  if (gameState === 'SEARCHING' && currentSearch) {
    // 2a. Executa UM passo do algoritmo
    currentSearch.step(); 

    // 2b. Verifica se a busca terminou
    if (currentSearch.status === 'FOUND') {
      gameState = 'MOVING';
      console.log("Caminho encontrado!");
    } else if (currentSearch.status === 'FAILED') {
      gameState = 'IDLE';
      console.log("Não foi possível encontrar um caminho!");
    }
  }
  
  // 3. DESENHA A VISUALIZAÇÃO (VISITADOS / FRONTEIRA)
  // *** MUDANÇA: Movido para fora do if(SEARCHING) ***
  // Agora a "trilha" de visitados não vai sumir
  if (currentSearch) {
    drawSearchVisualization();
  }
  
  // 4. DESENHA O CAMINHO FINAL
  // (Só desenha se a busca achou e está no estado 'MOVING')
  if (gameState === 'MOVING' && currentSearch && currentSearch.path) {
    drawFinalPath(currentSearch.path); // Nova função!
  }
  
  // 5. Desenha a comida e o agente por cima de tudo
  drawFood();
  drawAgent();
}

// --- FUNÇÃO DE INTERAÇÃO (teclado) ---
function keyPressed() {
  // Se pressionar qualquer tecla, gera um novo mundo e reseta tudo
  generateNewWorld();
}

// --- FUNÇÃO PARA CRIAR A UI (BOTÕES) ---
// (Esta é a função que você não achou)
function createUI() {
  // Cria os botões de seleção de algoritmo
  btnBFS = createButton('Busca em Largura (BFS)');
  btnDFS = createButton('Busca em Profundidade (DFS)');
  btnUCS = createButton('Custo Uniforme (UCS)');
  btnGreedy = createButton('Gulosa');
  btnAstar = createButton('A* (A-Estrela)');
  
  // Diz aos botões para entrarem na div <div id="controls">
  btnBFS.parent('controls');
  btnDFS.parent('controls');
  btnUCS.parent('controls');
  btnGreedy.parent('controls');
  btnAstar.parent('controls');

  // Agrupa os botões de algoritmo em um array para facilitar
  let algoButtons = [btnBFS, btnDFS, btnUCS, btnGreedy, btnAstar];

  // Vincula a função de callback a cada botão
  btnBFS.mousePressed(() => selectAlgorithm('BFS', btnBFS, algoButtons));
  btnDFS.mousePressed(() => selectAlgorithm('DFS', btnDFS, algoButtons));
  btnUCS.mousePressed(() => selectAlgorithm('UCS', btnUCS, algoButtons));
  btnGreedy.mousePressed(() => selectAlgorithm('Gulosa', btnGreedy, algoButtons));
  btnAstar.mousePressed(() => selectAlgorithm('A*', btnAstar, algoButtons));

  // Botão principal para iniciar a busca
  btnStart = createButton('INICIAR BUSCA');
  btnStart.parent('controls'); // Também entra na div 'controls'
  btnStart.mousePressed(startSearch);
  
  // Seleciona o BFS como padrão visualmente (adiciona a classe CSS 'active')
  btnBFS.addClass('active'); 
}

// --- FUNÇÃO CHAMADA PELOS BOTÕES DE ALGORITMO ---
function selectAlgorithm(algo, clickedButton, allButtons) {
  // Não deixa trocar o algoritmo se a busca estiver em andamento
  if (gameState === 'SEARCHING') return; 

  currentAlgorithm = algo;
  console.log("Algoritmo selecionado:", currentAlgorithm);

  // Feedback visual: Remove a classe 'active' de todos os botões
  for (let btn of allButtons) {
    btn.removeClass('active');
  }
  // Adiciona a classe 'active' apenas no botão que foi clicado
  clickedButton.addClass('active');
}

// --- FUNÇÃO CHAMADA PELO BOTÃO "INICIAR BUSCA" ---
// --- FUNÇÃO CHAMADA PELO BOTÃO "INICIAR BUSCA" ---
function startSearch() {
  // Só inicia se estiver ocioso ('IDLE')
  if (gameState === 'IDLE') {
    
    // 1. Criar os Nós (agora funciona, pois 'utils.js' está carregado)
    let startNode = new Node(agent.x, agent.y);
    let goalNode = new Node(food.x, food.y);
    
    // 2. CONEXÃO DOS ALGORITMOS (Agora com todos DESCOMENTADOS)
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
    
    // 3. Muda o estado para 'SEARCHING'
    if (currentSearch) {
      gameState = 'SEARCHING';
      console.log(`Iniciando busca com ${currentAlgorithm}!`);
    }
  }
}
// --- FUNÇÃO PARA GERAR O MUNDO E RESETAR ---
function generateNewWorld() {
  generateRandomMap(); // (Função do grid.js)
  agent = findValidPosition(); // (Função do entities.js)
  food = findValidPosition(); // (Função do entities.js)
  
  gameState = 'IDLE'; // Reseta o estado
  currentSearch = null; // Limpa a busca anterior
  
  console.log("Novo mapa gerado. Selecione um algoritmo.");
}

// --- FUNÇÃO PARA DESENHAR A ANIMAÇÃO DA BUSCA ---
// (Esta é a tarefa da Pessoa 2, mas deixamos um placeholder)
// --- FUNÇÃO PARA DESENHAR A ANIMAÇÃO DA BUSCA ---
function drawSearchVisualization() {
  if (!currentSearch) return; 

  // 1. Desenha os nós VISITADOS (Sempre, após a busca iniciar)
  fill(0, 255, 255, 100); // Ciano semi-transparente
  noStroke();
  if (currentSearch.visited && currentSearch.visited instanceof Set) {
    for (let node of currentSearch.visited) {
      rect(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight);
    }
  }

  // 2. Desenha a FRONTEIRA (Apenas DURANTE a busca)
  // *** MUDANÇA: Adicionado "gameState === 'SEARCHING'" ***
  if (gameState === 'SEARCHING' && currentSearch.frontier) {
    fill(0, 255, 0, 150); // Verde semi-transparente
    noStroke();
    
    // Suporta Fila (BFS/DFS) e Fila de Prioridade (outros)
    let frontierArray = Array.isArray(currentSearch.frontier) ? currentSearch.frontier : currentSearch.frontier.items;
    
    if (frontierArray) {
      for (let node of frontierArray) {
        rect(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight);
      }
    }
  }
}

// --- NOVA FUNÇÃO PARA DESENHAR O CAMINHO FINAL ---
function drawFinalPath(path) {
  // Desenha uma linha amarela grossa no centro das células do caminho
  stroke(255, 255, 0); // Amarelo
  strokeWeight(4);
  noFill();
  
  // Começa a desenhar a linha
  beginShape();
  for (let node of path) {
    // Calcula o centro da célula
    let cx = (node.x + 0.5) * cellWidth;
    let cy = (node.y + 0.5) * cellHeight;
    // Adiciona um vértice da linha nesse centro
    vertex(cx, cy);
  }
  endShape();
}
function handleAgentMovement() {
  // ... (código para verificar o fim do caminho) ...

  let nextNode = currentPath[pathIndex + 1];
  let cost = getCellCost(nextNode.x, nextNode.y); // Pega o custo do terreno

  // --- A VELOCIDADE É DEFINIDA AQUI ---
  
  // 1. Define o ATRASO (delay) em milissegundos
  let delay = 1000; // 100ms para Custo Baixo (areia)
  if (cost === 5) { // 400ms para Custo Médio (atoleiro)
    delay = 4000; 
  } else if (cost === 10) { // 800ms para Custo Alto (água)
    delay = 8000;
  }
  // ------------------------------------

  // 2. Verifica se o tempo (millis()) passou do atraso
  if (millis() - movementTimer > delay) {
    // 3. Se passou, move o agente
    pathIndex++;
    let newPosNode = currentPath[pathIndex];
    agent.x = newPosNode.x;
    agent.y = newPosNode.y;
    movementTimer = millis(); // Reseta o timer
  }
}
