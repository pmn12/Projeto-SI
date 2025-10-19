// --- CONFIGURAÇÕES GLOBAIS ---
const COLS = 30;
const ROWS = 22;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// Constantes dos tipos de terreno
const TERRAIN_LOW_COST = 0;   // Areia
const TERRAIN_MEDIUM_COST = 1; // Atoleiro
const TERRAIN_HIGH_COST = 2;  // Água
const OBSTACLE = 3;           // Obstáculo

// --- CONFIGURAÇÕES DE GERAÇÃO DE MAPA ---
// Proporções configuráveis dos terrenos (valores em percentual)
let TERRAIN_CONFIG = {
  obstacle: 15,    // % de obstáculos (0-30)
  water: 20,       // % de água (0-50)
  mud: 25,         // % de atoleiro (0-50)
  sand: 40         // % de areia (calculado automaticamente)
};

// Função para validar e ajustar configurações de terreno
function validateTerrainConfig() {
  const total = TERRAIN_CONFIG.obstacle + TERRAIN_CONFIG.water + TERRAIN_CONFIG.mud;
  
  if (total > 100) {
    // Ajusta proporcionalmente se exceder 100%
    const factor = 100 / total;
    TERRAIN_CONFIG.obstacle = Math.floor(TERRAIN_CONFIG.obstacle * factor);
    TERRAIN_CONFIG.water = Math.floor(TERRAIN_CONFIG.water * factor);
    TERRAIN_CONFIG.mud = Math.floor(TERRAIN_CONFIG.mud * factor);
  }
  
  // Calcula areia automaticamente
  TERRAIN_CONFIG.sand = 100 - (TERRAIN_CONFIG.obstacle + TERRAIN_CONFIG.water + TERRAIN_CONFIG.mud);
}

// Função para atualizar configuração de terreno
function updateTerrainConfig(terrain, value) {
  TERRAIN_CONFIG[terrain] = parseInt(value);
  validateTerrainConfig();
  
  // Atualiza a interface
  updateTerrainUI();
  
  // Implementa debounce para mostrar modal
  if (typeof debounceTimer !== 'undefined') {
    clearTimeout(debounceTimer);
  }
  
  if (typeof hasPendingChanges !== 'undefined') {
    hasPendingChanges = true;
    
    // Debounce de 1 segundo para mostrar modal
    if (typeof debounceTimer !== 'undefined') {
      debounceTimer = setTimeout(() => {
        if (typeof showModal !== 'undefined') {
          showModal(
            'Configuração Alterada',
            `Você alterou a configuração de ${terrain}. Clique em "Gerar novo mapa" para aplicar as mudanças.`,
            () => {
              if (typeof updateStatusMessage !== 'undefined') {
                updateStatusMessage(`Configuração de ${terrain} alterada. Clique em "Gerar novo mapa" para aplicar.`);
              }
              if (typeof highlightNewMapButton !== 'undefined') {
                highlightNewMapButton();
              }
            }
          );
        }
      }, 1000);
    }
  }
}

// Função para atualizar a UI das configurações
function updateTerrainUI() {
  const obstacleValue = document.getElementById('obstacle-value');
  const waterValue = document.getElementById('water-value');
  const mudValue = document.getElementById('mud-value');
  const sandValue = document.getElementById('sand-value');
  
  const obstacleProgress = document.getElementById('obstacle-progress');
  const waterProgress = document.getElementById('water-progress');
  const mudProgress = document.getElementById('mud-progress');
  
  if (obstacleValue) {
    obstacleValue.textContent = TERRAIN_CONFIG.obstacle + '%';
    obstacleProgress.style.width = TERRAIN_CONFIG.obstacle + '%';
  }
  
  if (waterValue) {
    waterValue.textContent = TERRAIN_CONFIG.water + '%';
    waterProgress.style.width = TERRAIN_CONFIG.water + '%';
  }
  
  if (mudValue) {
    mudValue.textContent = TERRAIN_CONFIG.mud + '%';
    mudProgress.style.width = TERRAIN_CONFIG.mud + '%';
  }
  
  if (sandValue) {
    sandValue.textContent = TERRAIN_CONFIG.sand + '%';
  }
}