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
function draw() {
  background(51); // Limpa a tela
  
  // 1. Desenha o grid (terrenos)
  drawGrid();
  
  // 2. LÓGICA DE ANIMAÇÃO DA BUSCA
  if (gameState === 'SEARCHING' && currentSearch) {
    // 2a. Executa UM passo do algoritmo
    currentSearch.step(); 

    // 2b. Desenha a visualização (fronteira e visitados)
    drawSearchVisualization(); 

    // 2c. Verifica se a busca terminou
    if (currentSearch.status === 'FOUND') {
      gameState = 'MOVING'; // Próximo estado (Pessoa 4)
      console.log("Caminho encontrado!");
      // Futuramente, chamaremos drawPath(currentSearch.path) aqui
    } else if (currentSearch.status === 'FAILED') {
      gameState = 'IDLE';
      console.log("Não foi possível encontrar um caminho!");
    }
  }
  
  // 3. Desenha a comida e o agente por cima de tudo
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
function startSearch() {
  // Só inicia se estiver ocioso ('IDLE')
  if (gameState === 'IDLE') {
    
    // 1. Criar os Nós (depende da Pessoa 1 - Classe 'Node')
    // Se a classe 'Node' ainda não existir no utils.js, isso dará erro.
    let startNode = new Node(agent.x, agent.y);
    let goalNode = new Node(food.x, food.y);
    
    // 2. CONEXÃO DOS ALGORITMOS (O "switch" da integração)
    // (Depende das Pessoas 2, 3, 4 entregarem suas classes de busca)
    switch (currentAlgorithm) {
      case 'BFS':
        currentSearch = new BfsSearch(startNode, goalNode);
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
      default:
        console.error("Algoritmo desconhecido:", currentAlgorithm);
        return;
    }
    
    // 3. Muda o estado para 'SEARCHING', ativando a animação no loop draw()
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
function drawSearchVisualization() {
  if (!currentSearch) return; // Não faz nada se não houver busca

  // 1. Desenha os nós VISITADOS
  fill(0, 255, 255, 100); // Ciano semi-transparente
  noStroke();
  
  // (Verifica se 'visited' existe e é um Set, como planejado)
  if (currentSearch.visited && currentSearch.visited instanceof Set) {
    for (let node of currentSearch.visited) {
      rect(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight);
    }
  }

  // 2. Desenha a FRONTEIRA
  fill(0, 255, 0, 150); // Verde semi-transparente
  noStroke();
  
  // (Verifica se 'frontier' existe e é um Array, como planejado)
  if (currentSearch.frontier && Array.isArray(currentSearch.frontier)) {
    for (let node of currentSearch.frontier) {
      rect(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight);
    }
  }
}
