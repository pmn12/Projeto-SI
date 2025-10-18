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

  // Chama as funções dos outros arquivos
  generateRandomMap();
  agent = findValidPosition();
  food = findValidPosition();
  
  console.log("Mapa, agente e comida gerados.");
  console.log("Pressione qualquer tecla para gerar um novo mapa.");
}

// --- FUNÇÃO DE DRAW DO P5.JS ---
function draw() {
  background(51); 
  
  // Chama as funções de desenho
  drawGrid();
  drawFood();
  drawAgent();
}

// --- FUNÇÃO DE INTERAÇÃO ---
function keyPressed() {
  generateRandomMap();
  agent = findValidPosition();
  food = findValidPosition();
  console.log("Novo mapa, agente e comida gerados!");
}
