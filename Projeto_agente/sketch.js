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

// *** ALTERADO: ***
// Por enquanto, teremos apenas um tipo de terreno.
const TERRAIN_DEFAULT = 0;

// --- FUNÇÃO DE SETUP DO P5.JS ---
// É executada apenas uma vez, no início.
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  // Calcula o tamanho de cada célula
  cellWidth = CANVAS_WIDTH / COLS;
  cellHeight = CANVAS_HEIGHT / ROWS;

  // *** ALTERADO: ***
  // Chamamos a nova função que cria um grid uniforme.
  initializeGrid();
}

// --- FUNÇÃO DE DRAW DO P5.JS ---
// É executada em loop, desenhando cada frame.
function draw() {
  background(51); // Fundo escuro
  
  // Desenha o grid na tela
  drawGrid();
}

// --- FUNÇÃO PARA CRIAR O GRID UNIFORME ---
// *** ALTERADO: Esta função substitui a 'generateRandomMap' ***
function initializeGrid() {
  // Inicializa o array do grid
  grid = new Array(COLS);
  for (let i = 0; i < COLS; i++) {
    grid[i] = new Array(ROWS);
  }

  // Preenche cada célula com o mesmo tipo de terreno
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      grid[i][j] = TERRAIN_DEFAULT;
    }
  }
}

// --- FUNÇÃO PARA DESENHAR O GRID NA TELA ---
function drawGrid() {
  // Percorre todas as células do grid
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      
      // *** ALTERADO: ***
      // Definimos uma cor única para todas as células.
      // Um cinza claro é uma boa cor base.
      fill(200); 

      // Mantemos a borda para visualizar a grade
      stroke(40); 
      rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
    }
  }
}
