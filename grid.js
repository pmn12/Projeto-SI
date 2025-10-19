// --- FUNÇÃO PARA GERAR O MAPA ALEATÓRIO ---
function generateRandomMap() {
  // Inicializa o array do grid
  grid = new Array(COLS);
  for (let i = 0; i < COLS; i++) {
    grid[i] = new Array(ROWS);
  }

  // Converte percentuais para valores decimais
  const obstacleThreshold = TERRAIN_CONFIG.obstacle / 100;
  const waterThreshold = obstacleThreshold + (TERRAIN_CONFIG.water / 100);
  const mudThreshold = waterThreshold + (TERRAIN_CONFIG.mud / 100);
  // Areia é o resto (não precisa de threshold)

  // Preenche cada célula com um tipo de terreno aleatório baseado nas configurações
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      let r = random(1); 

      if (r < obstacleThreshold) { 
        grid[i][j] = OBSTACLE;
      } else if (r < waterThreshold) { 
        grid[i][j] = TERRAIN_HIGH_COST; // Água
      } else if (r < mudThreshold) { 
        grid[i][j] = TERRAIN_MEDIUM_COST; // Atoleiro
      } else { 
        grid[i][j] = TERRAIN_LOW_COST; // Areia
      }
    }
  }
}

// --- FUNÇÃO PARA DESENHAR O GRID NA TELA ---
function drawGrid() {
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      
      let terrainType = grid[i][j];
      switch (terrainType) {
        case TERRAIN_LOW_COST:
          fill(244, 228, 193); // Bege claro (Areia) - #f4e4c1
          break;
        case TERRAIN_MEDIUM_COST:
          fill(139, 111, 71);  // Marrom médio (Atoleiro) - #8b6f47
          break;
        case TERRAIN_HIGH_COST:
          fill(91, 155, 213);  // Azul vibrante (Água) - #5b9bd5
          break;
        case OBSTACLE:
          fill(42, 42, 42); // Cinza muito escuro (Obstáculo) - #2a2a2a
          break;
      }

      // Bordas suaves entre células
      stroke(0, 0, 0, 30); // Preto semi-transparente
      strokeWeight(1);
      rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
    }
  }
}
