// --- FUNÇÃO PARA GERAR O MAPA ALEATÓRIO ---
function generateRandomMap() {
  // Inicializa o array do grid
  grid = new Array(COLS);
  for (let i = 0; i < COLS; i++) {
    grid[i] = new Array(ROWS);
  }

  // Preenche cada célula com um tipo de terreno aleatório
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      let r = random(1); 

      if (r < 0.15) { 
        grid[i][j] = OBSTACLE;
      } else if (r < 0.35) { 
        grid[i][j] = TERRAIN_HIGH_COST;
      } else if (r < 0.60) { 
        grid[i][j] = TERRAIN_MEDIUM_COST;
      } else { 
        grid[i][j] = TERRAIN_LOW_COST;
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
          fill(240, 230, 140); // Amarelo (Areia)
          break;
        case TERRAIN_MEDIUM_COST:
          fill(139, 69, 19);  // Marrom (Atoleiro)
          break;
        case TERRAIN_HIGH_COST:
          fill(70, 130, 180);  // Azul (Água)
          break;
        case OBSTACLE:
          fill(0,0,0); // Cinza (Obstáculo)
          break;
      }

      stroke(40); 
      rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
    }
  }
}
