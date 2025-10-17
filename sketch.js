// --- CONFIGURAÇÕES GLOBAIS ---
const COLS = 40;
const ROWS = 30;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

let cellWidth;
let cellHeight;
let grid = [];

// NOVO: Variáveis para o agente e a comida
let agent;
let food;

// Constantes dos tipos de terreno
const TERRAIN_LOW_COST = 0;   // Areia
const TERRAIN_MEDIUM_COST = 1; // Atoleiro
const TERRAIN_HIGH_COST = 2;  // Água
const OBSTACLE = 3;           // Obstáculo

// --- FUNÇÃO DE SETUP DO P5.JS ---
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  cellWidth = CANVAS_WIDTH / COLS;
  cellHeight = CANVAS_HEIGHT / ROWS;

  generateRandomMap();
  
  // NOVO: Posiciona o agente e a comida em locais válidos
  agent = findValidPosition();
  food = findValidPosition();
  
  console.log("Mapa, agente e comida gerados.");
  console.log("Pressione qualquer tecla para gerar um novo mapa.");
}

// --- FUNÇÃO DE DRAW DO P5.JS ---
function draw() {
  background(51); 
  
  // 1. Desenha o grid (terrenos)
  drawGrid();
  
  // NOVO: 2. Desenha a comida por cima do grid
  drawFood();
  
  // NOVO: 3. Desenha o agente por cima do grid
  drawAgent();
}

// --- FUNÇÃO PARA GERAR O MAPA ALEATÓRIO ---
function generateRandomMap() {
  grid = new Array(COLS);
  for (let i = 0; i < COLS; i++) {
    grid[i] = new Array(ROWS);
  }

  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      let r = random(1); 

      if (r < 0.15) { 
        grid[i][j] = OBSTACLE;
      } else if (r < 0.35) { 
        grid[i][j] = TERRAIN_HIGH_COST;
      } else if (r < 0.60) { 
        grid[i][j] = TERRAIN_MEDIUM_COST;
      } else { 
        grid[i][j] = TERRAIN_LOW_COST;
      }
    }
  }
}

// --- FUNÇÃO PARA DESENHAR O GRID NA TELA ---
function drawGrid() {
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      
      let terrainType = grid[i][j];
      switch (terrainType) {
        case TERRAIN_LOW_COST:
          fill(240, 230, 140); // Amarelo (Areia)
          break;
        case TERRAIN_MEDIUM_COST:
          fill(139, 69, 19);  // Marrom (Atoleiro)
          break;
        case TERRAIN_HIGH_COST:
          fill(70, 130, 180);  // Azul (Água)
          break;
        case OBSTACLE:
          fill(105, 105, 105); // Cinza (Obstáculo)
          break;
      }

      stroke(40); 
      rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
    }
  }
}

// --- NOVO: FUNÇÃO PARA ENCONTRAR POSIÇÃO VÁLIDA ---
function findValidPosition() {
  let pos;
  let valid = false;
  
  // Loop 'do...while' garante que vamos tentar até encontrar
  do {
    // Escolhe uma célula aleatória do grid
    let x = floor(random(COLS));
    let y = floor(random(ROWS));
    
    // Verifica se a célula NÃO é um obstáculo
    if (grid[x][y] !== OBSTACLE) {
      valid = true;
      // Salva a posição como um p5.Vector (um objeto {x, y})
      pos = createVector(x, y); 
    }
  } while (!valid); // Continua se a posição não for válida
  
  return pos;
}

// --- NOVO: FUNÇÃO PARA DESENHAR O AGENTE ---
function drawAgent() {
  if (!agent) return; // Não desenha se o agente ainda não foi criado

  // Calcula o centro da célula do agente em pixels
  let cx = (agent.x + 0.5) * cellWidth;
  let cy = (agent.y + 0.5) * cellHeight;

  // Desenha um triângulo (como no seu rascunho)
  fill(50, 50, 50); // Cinza escuro
  stroke(0);
  strokeWeight(1);
  
  let h = cellHeight * 0.6; // Altura do triângulo
  let w = cellWidth * 0.6;  // Largura do triângulo
  
  triangle(
    cx, cy - h / 2,         // Ponto de cima
    cx - w / 2, cy + h / 2, // Ponto de baixo-esquerda
    cx + w / 2, cy + h / 2  // Ponto de baixo-direita
  );
}

// --- NOVO: FUNÇÃO PARA DESENHAR A COMIDA ---
function drawFood() {
  if (!food) return; // Não desenha se a comida ainda não foi criada

  // Calcula o centro da célula da comida em pixels
  let cx = (food.x + 0.5) * cellWidth;
  let cy = (food.y + 0.5) * cellHeight;
  
  // Desenha uma elipse laranja (similar à estrela do rascunho)
  fill(255, 165, 0); // Laranja
  stroke(0);
  strokeWeight(1);

  // Tamanho um pouco menor que a célula
  ellipse(cx, cy, cellWidth * 0.5, cellHeight * 0.5);
}


// --- FUNÇÃO DE INTERAÇÃO ---
function keyPressed() {
  // ALTERADO: Além de gerar o mapa, também reposiciona o agente e a comida
  generateRandomMap();
  agent = findValidPosition();
  food = findValidPosition();
  console.log("Novo mapa, agente e comida gerados!");
}
