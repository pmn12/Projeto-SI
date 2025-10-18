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
let collectionTimer = 0; // Timer para o delay de coleta de 10s

// NOVO: Variável para guardar nosso elemento <p> de status
let statusDisplay;

// NOVO: Variáveis para o log de mensagens
let messageLog = [];
const MAX_LOG_LINES = 3;

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
// --- FUNÇÃO DE DRAW DO P5.JS ---
function draw() {
  background(51); 
  
  // 1. Desenha o grid (terrenos)
  drawGrid();
  
  // 2. LÓGICA DE ANIMAÇÃO DA BUSCA
if (gameState === 'SEARCHING' && currentSearch && (frameCount % 3 === 0)) {    
    // *** CORREÇÃO: DESCOMENTE ESTA LINHA ***
    currentSearch.step(); 

    // Verifica se a busca terminou
    if (currentSearch.status === 'FOUND') {
      gameState = 'MOVING';
      
      // Inicializa o movimento
      currentPath = currentSearch.path; // Salva o caminho
      pathIndex = 0; // Começa do primeiro nó (posição inicial)
      movementTimer = millis(); // Reseta o timer de movimento
      
      statusDisplay.html("Caminho encontrado! Movendo o agente...");
      
    } else if (currentSearch.status === 'FAILED') {
      gameState = 'IDLE';
      updateStatusMessage("Falha na busca: Não foi possível encontrar um caminho!");
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
  
  // 5. NOVO: LÓGICA DE DELAY DE 10 SEGUNDOS
  if (gameState === 'COLLECTING') {
    // Agente fica parado enquanto o timer roda
    if (millis() - collectionTimer > 5000) {
      // O delay acabou! Inicia a próxima rodada.
      handleFoodCollection(); 
    }
  }
  
  // 6. DESENHA O CAMINHO FINAL
  if (currentPath.length > 0) {
    drawFinalPath(currentPath); 
  }
  
  // 7. Desenha a comida e o agente
  drawFood(); 
  drawAgent();
}

// --- FUNÇÃO DE INTERAÇÃO (teclado) ---
function keyPressed() {
  generateNewWorld();
}

// --- FUNÇÃO PARA CRIAR A UI (BOTÕES) ---
// --- FUNÇÃO PARA CRIAR A UI (BOTÕES) ---
// --- FUNÇÃO PARA CRIAR A UI (BOTÕES) ---
function createUI() {
  // Cria os botões de seleção de algoritmo
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

  // --- O CÓDIGO QUE ESTÁ FALTANDO É ESTE ---
  // Cria o parágrafo de status
  statusDisplay = createP('Carregando...'); // Cria um <p> com texto inicial
  statusDisplay.id('status-message'); // Dá a ele o ID "status-message" (para o CSS)
  statusDisplay.parent('message-container'); // Coloca ele dentro da div <div id="message-container">
  messageLog = ['Carregando...'];
}

// --- FUNÇÃO CHAMADA PELOS BOTÕES DE ALGORITMO ---
function selectAlgorithm(algo, clickedButton, allButtons) {
  if (gameState === 'SEARCHING') return; 

currentAlgorithm = algo;
  
  // *** CORREÇÃO 1: Junte a mensagem em uma única string ***
  updateStatusMessage(`Algoritmo selecionado: ${currentAlgorithm}.`);

  for (let btn of allButtons) {
    btn.removeClass('active');
  }
  clickedButton.addClass('active');

  statusDisplay = createP('Carregando...'); // Cria um <p> com texto inicial
  statusDisplay.id('status-message'); // Dá a ele o ID "status-message"
  statusDisplay.parent('message-container'); // Coloca ele dentro da div que criamos
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
  
  // Reseta as variáveis de caminho
  messageLog = [];
  pathIndex = 0;
  currentPath = []; // Limpa a linha amarela da busca anterior
  
updateStatusMessage("Novo mapa gerado. Selecione um algoritmo.");}

// --- NOVA FUNÇÃO: ATUALIZA O LOG DE STATUS ---
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
    
    // *** CORREÇÃO: Chame .html() e não a si mesma ***
    statusDisplay.html(htmlString);
  }
}

// --- FUNÇÃO PARA DESENHAR A ANIMAÇÃO DA BUSCA ---
// --- FUNÇÃO PARA DESENHAR A ANIMAÇÃO DA BUSCA ---
// (VERSÃO CORRIGIDA)
function drawSearchVisualization() {
  if (!currentSearch) return;

  // 1. Desenha os nós VISITADOS (Ciano)
  fill(0, 255, 255, 100); // Ciano semi-transparente
  noStroke();

  let visitedKeys;

  // Checa se 'visited' é um Set (usado por BFS, DFS, Gulosa)
  if (currentSearch.visited && currentSearch.visited instanceof Set) {
    visitedKeys = currentSearch.visited.keys();
  } 
  // Checa se 'costSoFar' é um Map (usado por A*, UCS)
  else if (currentSearch.costSoFar && currentSearch.costSoFar instanceof Map) {
    visitedKeys = currentSearch.costSoFar.keys();
  }

  // Se encontramos uma lista de chaves (ex: "10,5", "11,5"), desenha-as
  if (visitedKeys) {
    for (let key of visitedKeys) {
      
      // *** ESTA É A CORREÇÃO ***
      // Converte o texto "x,y" de volta para números
      let [x, y] = key.split(',').map(Number); // ex: "10,5" -> [10, 5]
      
      if (!isNaN(x) && !isNaN(y)) {
        rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  // 2. Desenha a FRONTEIRA (Verde)
  // (Esta parte já estava correta)
  if (gameState === 'SEARCHING' && currentSearch.frontier) {
    fill(0, 255, 0, 100); // Verde semi-transparente
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
      // Agora iniciamos o timer de 10s de coleta.
      gameState = 'COLLECTING';
      collectionTimer = millis(); 
      food = null; // Comida desaparece
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
