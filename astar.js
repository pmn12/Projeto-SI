// astar.js — A* no teu grid (usa COLS, ROWS, grid, OBSTACLE e os terrenos)

// ---------- Heurísticas ----------
function hManhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// ---------- Util ----------
function inBounds(x, y) {
  return x >= 0 && x < COLS && y >= 0 && y < ROWS;
}
function isPassable(x, y) {
  return inBounds(x, y) && grid[x][y] !== OBSTACLE;
}
function moveCost(to) {
  const t = grid[to.x][to.y];
  if (t === TERRAIN_LOW_COST)   return 1; // areia
  if (t === TERRAIN_MEDIUM_COST)return 2; // atoleiro
  if (t === TERRAIN_HIGH_COST)  return 3; // água
  return 1; // fallback
}

// ---------- A* principal ----------
function aStarGrid(start, goal, { diagonals = false } = {}) {
  const key = (x, y) => `${x},${y}`;
  const unkey = k => {
    const [x, y] = k.split(',').map(Number);
    return { x, y };
  };

  const dirs4 = [[1,0],[-1,0],[0,1],[0,-1]];
  const dirs8 = [...dirs4, [1,1],[1,-1],[-1,1],[-1,-1]];

  const open = new Set();
  const closed = new Set();
  const cameFrom = new Map();
  const g = new Map();
  const f = new Map();

  const sK = key(start.x, start.y);
  const gK = key(goal.x,  goal.y);

  g.set(sK, 0);
  f.set(sK, hManhattan(start, goal));
  open.add(sK);

  while (open.size) {
    // extrai o de menor f (simples e suficiente aqui)
    let curK = null, curF = Infinity;
    for (const k of open) {
      const fk = f.get(k) ?? Infinity;
      if (fk < curF) { curF = fk; curK = k; }
    }

    if (curK === gK) return reconstructPath(curK, cameFrom, unkey);

    open.delete(curK);
    closed.add(curK);

    const { x, y } = unkey(curK);
    const dirs = diagonals ? dirs8 : dirs4;

    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      const nK = key(nx, ny);

      // checa passabilidade + evita cortar quina em diagonal
      if (!isPassable(nx, ny)) continue;
      if (diagonals && Math.abs(dx) + Math.abs(dy) === 2) {
        // se um dos adjacentes ortogonais for parede, não permite diagonal
        if (!isPassable(x + dx, y) || !isPassable(x, y + dy)) continue;
      }
      if (closed.has(nK)) continue;

      const tentativeG = (g.get(curK) ?? Infinity) + moveCost({ x: nx, y: ny });
      if (tentativeG < (g.get(nK) ?? Infinity)) {
        cameFrom.set(nK, curK);
        g.set(nK, tentativeG);
        f.set(nK, tentativeG + hManhattan({ x: nx, y: ny }, goal));
        open.add(nK);
      }
    }
  }
  return null; // sem caminho
}

function reconstructPath(endK, cameFrom, unkey) {
  const out = [];
  let k = endK;
  while (k) {
    out.push(unkey(k));
    k = cameFrom.get(k);
  }
  return out.reverse();
}

// ---------- helper de desenho (opcional) ----------
function drawAStarPath(path) {
  if (!path || !path.length) return;
  noFill();
  stroke(30, 200, 90);
  strokeWeight(Math.min(cellWidth, cellHeight) * 0.35);
  beginShape();
  for (const p of path) {
    vertex((p.x + 0.5) * cellWidth, (p.y + 0.5) * cellHeight);
  }
  endShape();
}
