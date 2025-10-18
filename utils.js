// --- NOVO ARQUIVO: utils.js ---
// (Contém as classes e funções que todos os algoritmos usam)

/**
 * Classe que representa um Nó (ou Célula) na busca.
 * Armazena sua posição, quem o 'chamou' (parent) e os custos G, H e F.
 */
class Node {
  constructor(x, y) {
    this.x = x; // Posição (coluna) no grid
    this.y = y; // Posição (linha) no grid
    
    this.parent = null; // O 'Node' de onde viemos para chegar aqui
    
    this.g = 0; // Custo REAL do início até este nó
    this.h = 0; // Custo da HEURÍSTICA deste nó até o objetivo
    this.f = 0; // Custo TOTAL (g + h)
  }
}

/**
 * Uma Fila de Prioridade simples.
 * Usada pelo UCS, Gulosa e A*.
 * O construtor recebe uma função que compara dois nós.
 */
class PriorityQueue {
  constructor(comparator) {
    this.items = [];
    this.comparator = comparator; // ex: (a, b) => a.f - b.f
  }

  // Adiciona um nó à fila
  enqueue(node) {
    this.items.push(node);
  }

  // Remove e retorna o nó de MENOR prioridade
  dequeue() {
    // Ordena a fila com base no comparador
    // (Mais simples de entender, embora não seja a mais performática)
    this.items.sort(this.comparator);
    
    // Remove e retorna o primeiro item (menor prioridade)
    return this.items.shift();
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}

/**
 * Função auxiliar para gerar a chave de um nó (ex: "10,5")
 * Usado para o Set de 'visitados', pois objetos {x:1, y:1} não são
 * iguais a outros objetos {x:1, y:1} em JavaScript.
 */
function posToString(node) {
  return `${node.x},${node.y}`;
}

/**
 * Reconstrói o caminho final seguindo os 'parents'
 * do nó objetivo de volta até o nó inicial.
 */
function reconstructPath(node) {
  let path = [];
  let current = node;
  while (current) {
    path.unshift(current); // Adiciona no início do array
    current = current.parent;
  }
  return path;
}

/**
 * Retorna o custo de energia para entrar em uma célula.
 * Lê o 'grid' global e usa as constantes do 'config.js'.
 */
function getCellCost(x, y) {
  // Checa se está fora dos limites
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
    return Infinity;
  }
  
  let terrainType = grid[x][y];
  
  switch (terrainType) {
    case TERRAIN_LOW_COST:    return 1;
    case TERRAIN_MEDIUM_COST: return 5;
    case TERRAIN_HIGH_COST:   return 10;
    case OBSTACLE:            return Infinity; // Obstáculo (preto)
    default:                  return Infinity;
  }
}

/**
 * Encontra os vizinhos válidos de um nó (cima, baixo, esquerda, direita).
 * Retorna um array de 'Node' vizinhos.
 */
function getNeighbors(node) {
  let neighbors = [];
  let { x, y } = node;
  
  // Lista de movimentos: [dx, dy]
  const directions = [
    [0, -1], // Cima
    [1, 0],  // Direita
    [0, 1],  // Baixo
    [-1, 0]  // Esquerda
  ];

  for (let [dx, dy] of directions) {
    let newX = x + dx;
    let newY = y + dy;
    
    // Verifica se o vizinho é válido (dentro do grid e não é obstáculo)
    if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS && getCellCost(newX, newY) !== Infinity) {
      // Se for válido, cria um novo nó para ele
      neighbors.push(new Node(newX, newY));
    }
  }
  return neighbors;
}

/**
 * Calcula a Distância de Manhattan (heurística).
 * É a distância em x + a distância em y.
 */
function manhattanDistance(a, b) {
  let dx = abs(a.x - b.x);
  let dy = abs(a.y - b.y);
  return dx + dy;
}
