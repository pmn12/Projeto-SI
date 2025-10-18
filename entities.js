// --- FUNÇÃO PARA ENCONTRAR POSIÇÃO VÁLIDA ---
function findValidPosition() {
  let pos;
  let valid = false;
  
  do {
    let x = floor(random(COLS));
    let y = floor(random(ROWS));
    
    // Verifica se a célula NÃO é um obstáculo
    // (Também verifica se o grid já existe, só por segurança)
    if (grid[x] && grid[x][y] !== OBSTACLE) {
      valid = true;
      pos = createVector(x, y); 
    }
  } while (!valid); 
  
  return pos;
}

// --- FUNÇÃO PARA DESENHAR O AGENTE ---
function drawAgent() {
  if (!agent || !imgAgent) return; 

  let cx = (agent.x + 0.5) * cellWidth;
  let cy = (agent.y + 0.5) * cellHeight;

  image(imgAgent, cx, cy, cellWidth * 0.8, cellHeight * 0.8);
}

// --- FUNÇÃO PARA DESENHAR A COMIDA ---
function drawFood() {
  if (!food || !imgFood) return; 

  let cx = (food.x + 0.5) * cellWidth;
  let cy = (food.y + 0.5) * cellHeight;

  image(imgFood, cx, cy, cellWidth * 0.6, cellHeight * 0.6);
}
