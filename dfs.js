// --- NOVO ARQUIVO: dfs.js ---

class DfsSearch {
  constructor(start, goal) {
    this.start = start;
    this.goal = goal;
    
    // Para DFS, a fronteira é uma PILHA (LIFO - Last-In, First-Out)
    this.frontier = []; 
    this.visited = new Set();
    
    this.frontier.push(start);
    this.visited.add(posToString(start));
    
    this.status = 'SEARCHING';
    this.path = [];
  }

  step() {
    if (this.status !== 'SEARCHING') return;

    if (this.frontier.length === 0) {
      this.status = 'FAILED';
      console.log("DFS Falhou: Fronteira vazia.");
      return;
    }

    // 2. Tira o próximo nó da PILHA (LIFO -> .pop())
    // A única diferença real para o BFS está nesta linha!
    let current = this.frontier.pop();

    // 3. Checa se é o objetivo
    if (current.x === this.goal.x && current.y === this.goal.y) {
      this.status = 'FOUND';
      this.path = reconstructPath(current);
      console.log("DFS Encontrou o caminho!");
      return;
    }

    // 4. Pega os vizinhos
    let neighbors = getNeighbors(current);
    
    for (let neighbor of neighbors) {
      let neighborKey = posToString(neighbor);
      
      // 5. Se o vizinho ainda não foi visitado...
      if (!this.visited.has(neighborKey)) {
        this.visited.add(neighborKey);
        neighbor.parent = current;
        this.frontier.push(neighbor);
      }
    }
  }
}
