// --- NOVO ARQUIVO: bfs.js ---

class BfsSearch {
  constructor(start, goal) {
    this.start = start;
    this.goal = goal;
    
    // Para BFS, a fronteira é uma FILA (FIFO - First-In, First-Out)
    this.frontier = []; 
    this.visited = new Set(); // Guarda chaves "x,y" de nós visitados
    
    // Inicializa a busca
    this.frontier.push(start);
    this.visited.add(posToString(start));
    
    this.status = 'SEARCHING';
    this.path = [];
  }

  // Executa UM passo da busca
  step() {
    if (this.status !== 'SEARCHING') return;

    // 1. Verifica se a fronteira está vazia
    if (this.frontier.length === 0) {
      this.status = 'FAILED';
      console.log("BFS Falhou: Fronteira vazia.");
      return;
    }

    // 2. Tira o próximo nó da FILA (FIFO -> .shift())
    let current = this.frontier.shift();

    // 3. Checa se é o objetivo
    if (current.x === this.goal.x && current.y === this.goal.y) {
      this.status = 'FOUND';
      this.path = reconstructPath(current);
      console.log("BFS Encontrou o caminho!");
      return;
    }

    // 4. Pega os vizinhos
    let neighbors = getNeighbors(current);
    
    for (let neighbor of neighbors) {
      let neighborKey = posToString(neighbor);
      
      // 5. Se o vizinho ainda não foi visitado...
      if (!this.visited.has(neighborKey)) {
        this.visited.add(neighborKey); // Marca como visitado
        neighbor.parent = current;     // Define o caminho de volta
        this.frontier.push(neighbor);  // Adiciona na fronteira
      }
    }
  }
}
