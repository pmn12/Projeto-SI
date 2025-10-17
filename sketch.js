// --- CONFIGURAÇÕES GLOBAIS ---

// Dimensões do grid (quantidade de células)
const COLS = 40;
const ROWS = 30;

// Tamanho da tela em pixels
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// Variáveis para guardar o tamanho de cada célula
let cellWidth;
let cellHeight;

// A estrutura de dados principal: um array 2D para representar o grid
let grid = [];

// Constantes para os tipos de terreno (facilita a leitura do código)
const TERRAIN_LOW_COST = 0;   // Custo baixo (areia)
const TERRAIN_MEDIUM_COST = 1; // Custo médio (atoleiro)
const TERRAIN_HIGH_COST = 2;  // Custo alto (água)
const OBSTACLE = 3;           // Obstáculo

// --- FUNÇÃO DE SETUP DO P5.JS ---
// É executada apenas uma vez, no início.
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  // Calcula o tamanho de cada célula com base no tamanho do canvas e do grid
  cellWidth = CANVAS_WIDTH / COLS;
  cellHeight = CANVAS_HEIGHT / ROWS;

  // Gera o mapa aleatório pela primeira vez
  generateRandomMap();
  
  console.log("Mapa gerado. Pressione qualquer tecla para gerar um novo mapa.");
}

// --- FUNÇÃO DE DRAW DO P5.JS ---
// É executada em loop, desenhando cada frame.
function draw() {
  background(51); // Fundo escuro
  
  // Desenha o grid na tela a cada frame
  drawGrid();
}

// --- FUNÇÃO PARA GERAR O MAPA ALEATÓRIO ---
function generateRandomMap() {
  // Inicializa o array do grid
  grid = new Array(COLS);
  for (let i = 0; i < COLS; i++) {
    grid[i] = new Array(ROWS);
  }

  // Preenche cada célula com um tipo de terreno aleatório
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      let r = random(1); // Gera um número aleatório entre 0 e 1

      // Define as probabilidades de cada terreno aparecer
      if (r < 0.15) { // 15% de chance de ser um obstáculo
        grid[i][j] = OBSTACLE;
      } else if (r < 0.35) { // 20% de chance de ser água
        grid[i][j] = TERRAIN_HIGH_COST;
      } else if (r < 0.60) { // 25% de chance de ser atoleiro
        grid[i][j] = TERRAIN_MEDIUM_COST;
      } else { // 40% de chance de ser areia
        grid[i][j] = TERRAIN_LOW_COST;
      }
    }
  }
}

// --- FUNÇÃO PARA DESENHAR O GRID NA TELA ---
function drawGrid() {
  // Percorre todas as células do grid
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      
      // Define a cor com base no tipo de terreno
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

      // Desenha o retângulo da célula
      stroke(40); // Borda para as células
      rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
    }
  }
}

// --- FUNÇÃO DE INTERAÇÃO ---
// Gera um novo mapa quando qualquer tecla é pressionada
function keyPressed() {
  generateRandomMap();
  console.log("Novo mapa gerado!");
}
