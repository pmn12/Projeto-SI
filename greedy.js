// --- NOVO ARQUIVO: greedy.js ---

class GreedySearch {
  constructor(start, goal) {
    this.start = start;
    this.goal = goal;
    
    // Gulosa usa uma Fila de Prioridade ordenada por 'h' (heurística)
    this.frontier = new PriorityQueue((a, b) => a.h - b.h);
    this.visited = new Set();
    
    // Inicializa a busca
    this.start.h = manhattanDistance(this.start, this.goal);
    this.frontier.enqueue(this.start);
    this.visited.add(posToString(this.start));
    
    this.status = 'SEARCHING';
    this.path = [];
  }

  step() {
    if (this.status !== 'SEARCHING') return;

    if (this.frontier.isEmpty()) {
      this.status = 'FAILED';
      console.log("Gulosa Falhou: Fronteira vazia.");
      return;
    }

    // 1. Pega o nó de menor custo 'h' (mais próximo do objetivo)
    let current = this.frontier.dequeue();

    // 2. Checa se é o objetivo
    if (current.x === this.goal.x && current.y === this.goal.y) {
      this.status = 'FOUND';
      this.path = reconstructPath(current);
      console.log("Gulosa Encontrou o caminho!");
      return;
    }

    // 3. Pega os vizinhos
    let neighbors = getNeighbors(current);
    
    for (let neighbor of neighbors) {
      let neighborKey = posToString(neighbor);
      
      // 4. Se o vizinho ainda não foi visitado...
      if (!this.visited.has(neighborKey)) {
        this.visited.add(neighborKey);
        // Calcula a heurística 'h' do vizinho
        neighbor.h = manhattanDistance(neighbor, this.goal);
        neighbor.parent = current;
        this.frontier.enqueue(neighbor);
      }
    }
  }
}
