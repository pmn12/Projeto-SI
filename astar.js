// --- NOVO ARQUIVO: astar.js ---

class AstarSearch {
  constructor(start, goal) {
    this.start = start;
    this.goal = goal;
    
    // A* usa uma Fila de Prioridade ordenada por 'f' (g + h)
    this.frontier = new PriorityQueue((a, b) => a.f - b.f);
    
    // Guarda o menor custo 'g' (real) encontrado até agora
    this.costSoFar = new Map();
    
    // Inicializa a busca
    this.start.g = 0;
    this.start.h = manhattanDistance(this.start, this.goal);
    this.start.f = this.start.g + this.start.h;
    
    this.frontier.enqueue(this.start);
    this.costSoFar.set(posToString(this.start), 0);
    
    this.status = 'SEARCHING';
    this.path = [];
  }

  step() {
    if (this.status !== 'SEARCHING') return;

    if (this.frontier.isEmpty()) {
      this.status = 'FAILED';
      console.log("A* Falhou: Fronteira vazia.");
      return;
    }

    // 1. Pega o nó de menor custo 'f' (melhor estimativa)
    let current = this.frontier.dequeue();

    // 2. Checa se é o objetivo
    if (current.x === this.goal.x && current.y === this.goal.y) {
      this.status = 'FOUND';
      this.path = reconstructPath(current);
      console.log("A* Encontrou o caminho!");
      return;
    }

    // 3. Pega os vizinhos
    let neighbors = getNeighbors(current);
    
    for (let neighbor of neighbors) {
      // 4. Calcula o novo custo 'g' (real) para este vizinho
      let newCostG = current.g + getCellCost(neighbor.x, neighbor.y);
      let neighborKey = posToString(neighbor);
      
      // 5. Se nunca vimos OU achamos um caminho mais barato...
      if (!this.costSoFar.has(neighborKey) || newCostG < this.costSoFar.get(neighborKey)) {
        this.costSoFar.set(neighborKey, newCostG); // Atualiza o custo
        
        // Atualiza todos os custos do vizinho
        neighbor.g = newCostG;
        neighbor.h = manhattanDistance(neighbor, this.goal);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
        
        this.frontier.enqueue(neighbor); // Adiciona na fronteira
      }
    }
  }
}
