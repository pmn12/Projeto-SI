// --- NOVO ARQUIVO: ucs.js ---

class UcsSearch {
  constructor(start, goal) {
    this.start = start;
    this.goal = goal;
    
    // UCS usa uma Fila de Prioridade ordenada por 'g' (custo real)
    this.frontier = new PriorityQueue((a, b) => a.g - b.g);
    
    // Guarda o menor custo 'g' encontrado até agora para cada nó
    this.costSoFar = new Map();
    
    // Inicializa a busca
    this.start.g = 0;
    this.frontier.enqueue(this.start);
    this.costSoFar.set(posToString(this.start), 0);
    
    this.status = 'SEARCHING';
    this.path = [];
  }

  step() {
    if (this.status !== 'SEARCHING') return;

    if (this.frontier.isEmpty()) {
      this.status = 'FAILED';
      console.log("UCS Falhou: Fronteira vazia.");
      return;
    }

    // 1. Pega o nó de menor custo 'g' da fila
    let current = this.frontier.dequeue();

    // 2. Checa se é o objetivo
    if (current.x === this.goal.x && current.y === this.goal.y) {
      this.status = 'FOUND';
      this.path = reconstructPath(current);
      console.log("UCS Encontrou o caminho!");
      return;
    }

    // 3. Pega os vizinhos
    let neighbors = getNeighbors(current);
    
    for (let neighbor of neighbors) {
      // 4. Calcula o novo custo 'g' para chegar a este vizinho
      let newCostG = current.g + getCellCost(neighbor.x, neighbor.y);
      let neighborKey = posToString(neighbor);
      
      // 5. Se nunca vimos esse vizinho OU achamos um caminho mais barato...
      if (!this.costSoFar.has(neighborKey) || newCostG < this.costSoFar.get(neighborKey)) {
        this.costSoFar.set(neighborKey, newCostG); // Atualiza o custo
        neighbor.g = newCostG;
        neighbor.parent = current;
        this.frontier.enqueue(neighbor); // Adiciona na fronteira
      }
    }
  }
}
