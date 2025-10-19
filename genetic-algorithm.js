/**
 * Exemplo de Implementação de Algoritmo Genético para Agente Coletor
 * Este arquivo demonstra como integrar AG ao sistema existente
 */

// Constantes para ações
const ACOES = {
  0: 'NORTE',    // ↑
  1: 'SUL',      // ↓
  2: 'LESTE',    // →
  3: 'OESTE',    // ←
  4: 'NORTE_LESTE',   // ↗
  5: 'NORTE_OESTE',   // ↖
  6: 'SUL_LESTE',     // ↘
  7: 'SUL_OESTE'      // ↙
};

/**
 * Classe que representa um indivíduo no Algoritmo Genético
 */
class IndividuoAG {
  constructor(tamanhoCromossomo = 100) {
    this.cromossomo = this.gerarCromossomoAleatorio(tamanhoCromossomo);
    this.fitness = 0;
    this.caminhoValido = false;
    this.comidaColetada = false;
    this.custoTotal = 0;
    this.passosUtilizados = 0;
    this.distanciaFinal = 0;
  }
  
  /**
   * Gera um cromossomo aleatório
   */
  gerarCromossomoAleatorio(tamanho) {
    return Array.from({length: tamanho}, () => 
      Math.floor(Math.random() * Object.keys(ACOES).length)
    );
  }
  
  /**
   * Cria uma cópia do indivíduo
   */
  clonar() {
    const clone = new IndividuoAG(this.cromossomo.length);
    clone.cromossomo = [...this.cromossomo];
    clone.fitness = this.fitness;
    clone.caminhoValido = this.caminhoValido;
    clone.comidaColetada = this.comidaColetada;
    clone.custoTotal = this.custoTotal;
    clone.passosUtilizados = this.passosUtilizados;
    clone.distanciaFinal = this.distanciaFinal;
    return clone;
  }
}

/**
 * Classe principal do Algoritmo Genético
 */
class AlgoritmoGenetico {
  constructor(configuracao = {}) {
    this.tamanhoPopulacao = configuracao.tamanhoPopulacao || 100;
    this.numeroGeracoes = configuracao.numeroGeracoes || 200;
    this.taxaCrossover = configuracao.taxaCrossover || 0.8;
    this.taxaMutacao = configuracao.taxaMutacao || 0.1;
    this.tamanhoCromossomo = configuracao.tamanhoCromossomo || 100;
    this.taxaElitismo = configuracao.taxaElitismo || 0.1;
    this.tamanhoTorneio = configuracao.tamanhoTorneio || 3;
    
    this.populacao = [];
    this.melhorIndividuo = null;
    this.historicoFitness = [];
    this.executando = false;
  }
  
  /**
   * Inicializa a população aleatória
   */
  inicializarPopulacao() {
    this.populacao = [];
    for (let i = 0; i < this.tamanhoPopulacao; i++) {
      this.populacao.push(new IndividuoAG(this.tamanhoCromossomo));
    }
  }
  
  /**
   * Executa uma ação e retorna nova posição
   */
  executarAcao(posicao, acao) {
    const novaPosicao = {...posicao};
    
    switch(acao) {
      case 0: // NORTE
        novaPosicao.y -= 1;
        break;
      case 1: // SUL
        novaPosicao.y += 1;
        break;
      case 2: // LESTE
        novaPosicao.x += 1;
        break;
      case 3: // OESTE
        novaPosicao.x -= 1;
        break;
      case 4: // NORTE_LESTE
        novaPosicao.y -= 1;
        novaPosicao.x += 1;
        break;
      case 5: // NORTE_OESTE
        novaPosicao.y -= 1;
        novaPosicao.x -= 1;
        break;
      case 6: // SUL_LESTE
        novaPosicao.y += 1;
        novaPosicao.x += 1;
        break;
      case 7: // SUL_OESTE
        novaPosicao.y += 1;
        novaPosicao.x -= 1;
        break;
    }
    
    return novaPosicao;
  }
  
  /**
   * Verifica se uma posição é válida no grid
   */
  posicaoValida(posicao, grid) {
    return posicao.x >= 0 && posicao.x < grid.length && 
           posicao.y >= 0 && posicao.y < grid[0].length &&
           grid[posicao.x][posicao.y] !== 'OBSTACLE';
  }
  
  /**
   * Obtém o custo de um terreno
   */
  obterCustoTerreno(grid, posicao) {
    const terreno = grid[posicao.x][posicao.y];
    switch(terreno) {
      case 'TERRAIN_LOW_COST': return 1;
      case 'TERRAIN_MEDIUM_COST': return 5;
      case 'TERRAIN_HIGH_COST': return 10;
      default: return 1;
    }
  }
  
  /**
   * Calcula distância de Manhattan entre duas posições
   */
  calcularDistancia(pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }
  
  /**
   * Avalia o fitness de um indivíduo
   */
  calcularFitness(individuo, grid, posicaoInicial, posicaoComida) {
    let posicaoAtual = {...posicaoInicial};
    let custoTotal = 0;
    let passosUtilizados = 0;
    let comidaColetada = false;
    let posicoesVisitadas = new Set();
    
    // Simula a execução do cromossomo
    for (let i = 0; i < individuo.cromossomo.length; i++) {
      const acao = individuo.cromossomo[i];
      const novaPosicao = this.executarAcao(posicaoAtual, acao);
      
      // Verifica se a ação é válida
      if (this.posicaoValida(novaPosicao, grid)) {
        posicaoAtual = novaPosicao;
        passosUtilizados++;
        
        // Calcula custo do terreno
        const custoTerreno = this.obterCustoTerreno(grid, novaPosicao);
        custoTotal += custoTerreno;
        
        // Verifica se coletou a comida
        if (posicaoAtual.x === posicaoComida.x && posicaoAtual.y === posicaoComida.y) {
          comidaColetada = true;
          break;
        }
        
        // Penaliza visitar a mesma posição
        const chavePosicao = `${posicaoAtual.x},${posicaoAtual.y}`;
        if (posicoesVisitadas.has(chavePosicao)) {
          custoTotal += 0.5; // Penalidade por repetição
        }
        posicoesVisitadas.add(chavePosicao);
      } else {
        custoTotal += 10; // Penalidade alta por ação inválida
      }
    }
    
    // Calcula fitness baseado em múltiplos critérios
    let fitness = 0;
    
    // 1. Recompensa por coletar a comida (peso alto)
    if (comidaColetada) {
      fitness = 1000; // Base se coletou
      
      // Bônus por eficiência (menos passos para coletar)
      const eficiencia = 1 / (passosUtilizados + 1);
      fitness += eficiencia * 100;
      
      // Penaliza custo total (peso médio)
      fitness -= custoTotal * 0.1;
      
      // Penaliza número de passos (peso baixo)
      fitness -= passosUtilizados * 0.01;
    } else {
      // Se NÃO coletou, fitness baseado na distância (máximo 999)
      const distanciaFinal = this.calcularDistancia(posicaoAtual, posicaoComida);
      fitness = Math.max(0, 999 - distanciaFinal * 10 - custoTotal * 0.1 - passosUtilizados * 0.01);
    }
    
    // Atualiza propriedades do indivíduo
    individuo.fitness = fitness;
    individuo.comidaColetada = comidaColetada;
    individuo.custoTotal = custoTotal;
    individuo.passosUtilizados = passosUtilizados;
    individuo.distanciaFinal = this.calcularDistancia(posicaoAtual, posicaoComida);
    
    return individuo.fitness;
  }
  
  /**
   * Avalia toda a população
   */
  avaliarPopulacao(grid, posicaoInicial, posicaoComida) {
    for (let individuo of this.populacao) {
      this.calcularFitness(individuo, grid, posicaoInicial, posicaoComida);
    }
    
    // Ordena por fitness (maior primeiro)
    this.populacao.sort((a, b) => b.fitness - a.fitness);
    
    // Atualiza melhor indivíduo
    if (!this.melhorIndividuo || 
        this.populacao[0].fitness > this.melhorIndividuo.fitness) {
      this.melhorIndividuo = this.populacao[0].clonar();
    }
  }
  
  /**
   * Seleção por torneio
   */
  selecaoTorneio() {
    const torneio = [];
    for (let j = 0; j < this.tamanhoTorneio; j++) {
      const indice = Math.floor(Math.random() * this.populacao.length);
      torneio.push(this.populacao[indice]);
    }
    
    // Seleciona o melhor do torneio
    return torneio.reduce((melhor, atual) => 
      atual.fitness > melhor.fitness ? atual : melhor
    );
  }
  
  /**
   * Crossover de ponto único
   */
  crossover(pai1, pai2) {
    if (Math.random() > this.taxaCrossover) {
      return [pai1.clonar(), pai2.clonar()];
    }
    
    const pontoCorte = Math.floor(Math.random() * pai1.cromossomo.length);
    
    const filho1 = new IndividuoAG();
    const filho2 = new IndividuoAG();
    
    // Cria os filhos trocando as partes dos cromossomos
    filho1.cromossomo = [
      ...pai1.cromossomo.slice(0, pontoCorte),
      ...pai2.cromossomo.slice(pontoCorte)
    ];
    
    filho2.cromossomo = [
      ...pai2.cromossomo.slice(0, pontoCorte),
      ...pai1.cromossomo.slice(pontoCorte)
    ];
    
    return [filho1, filho2];
  }
  
  /**
   * Mutação uniforme
   */
  mutacao(individuo) {
    for (let i = 0; i < individuo.cromossomo.length; i++) {
      if (Math.random() < this.taxaMutacao) {
        individuo.cromossomo[i] = Math.floor(Math.random() * Object.keys(ACOES).length);
      }
    }
    return individuo;
  }
  
  /**
   * Seleciona elite da população
   */
  selecionarElite() {
    const numeroElite = Math.floor(this.tamanhoPopulacao * this.taxaElitismo);
    return this.populacao.slice(0, numeroElite).map(ind => ind.clonar());
  }
  
  /**
   * Gera nova geração
   */
  gerarNovaGeracao() {
    const novaPopulacao = [];
    
    // 1. Mantém elite
    const elite = this.selecionarElite();
    novaPopulacao.push(...elite);
    
    // 2. Gera filhos através de crossover e mutação
    while (novaPopulacao.length < this.tamanhoPopulacao) {
      // Seleciona pais
      const pai1 = this.selecaoTorneio();
      const pai2 = this.selecaoTorneio();
      
      // Crossover
      const [filho1, filho2] = this.crossover(pai1, pai2);
      
      // Mutação
      this.mutacao(filho1);
      this.mutacao(filho2);
      
      novaPopulacao.push(filho1, filho2);
    }
    
    // Ajusta tamanho da população
    this.populacao = novaPopulacao.slice(0, this.tamanhoPopulacao);
  }
  
  /**
   * Executa o algoritmo genético
   * @param {boolean} forcarTodasGeracoes - Se true, executa todas as gerações mesmo após encontrar solução
   */
  async executar(grid, posicaoInicial, posicaoComida, callback = null, forcarTodasGeracoes = false) {
    console.log("🧬 Iniciando Algoritmo Genético...");
    this.executando = true;
    
    // 1. Inicializa população
    this.inicializarPopulacao();
    
    // 2. Loop principal
    for (let geracao = 0; geracao < this.numeroGeracoes; geracao++) {
      // Avalia população
      this.avaliarPopulacao(grid, posicaoInicial, posicaoComida);
      
      // Registra estatísticas
      const fitnessMedio = this.populacao.reduce((sum, ind) => sum + ind.fitness, 0) / this.populacao.length;
      const melhorFitness = this.populacao[0].fitness;
      
      this.historicoFitness.push({
        geracao,
        melhor: melhorFitness,
        medio: fitnessMedio,
        pior: this.populacao[this.populacao.length - 1].fitness
      });
      
      // Callback para atualização da UI
      if (callback) {
        callback({
          geracao,
          melhorFitness,
          fitnessMedio,
          melhorIndividuo: this.melhorIndividuo
        });
      }
      
      // Log de progresso
      if (geracao % 20 === 0) {
        console.log(`Geração ${geracao}: Melhor = ${melhorFitness.toFixed(2)}, Médio = ${fitnessMedio.toFixed(2)}`);
      }
      
      // Gera nova população
      this.gerarNovaGeracao();
      
      // Critério de parada - SÓ para se realmente coletou a comida
      if (!forcarTodasGeracoes && this.melhorIndividuo && this.melhorIndividuo.comidaColetada) {
        console.log(`🎯 Solução encontrada na geração ${geracao}!`);
        console.log(`Fitness: ${melhorFitness.toFixed(2)}, Passos: ${this.melhorIndividuo.passosUtilizados}`);
        break;
      }
      
      // Pequeno delay para não travar o browser
      if (geracao % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    
    // Avalia população final
    this.avaliarPopulacao(grid, posicaoInicial, posicaoComida);
    
    this.executando = false;
    console.log("✅ Algoritmo Genético concluído!");
    
    return this.melhorIndividuo;
  }
  
  /**
   * Converte cromossomo em caminho para visualização
   */
  converterCromossomoParaCaminho(cromossomo, posicaoInicial, grid) {
    const caminho = [posicaoInicial];
    let posicaoAtual = {...posicaoInicial};
    
    for (let acao of cromossomo) {
      const novaPosicao = this.executarAcao(posicaoAtual, acao);
      
      if (this.posicaoValida(novaPosicao, grid)) {
        caminho.push(novaPosicao);
        posicaoAtual = novaPosicao;
      }
    }
    
    return caminho;
  }
  
  /**
   * Obtém estatísticas da execução
   */
  obterEstatisticas() {
    return {
      melhorIndividuo: this.melhorIndividuo,
      historicoFitness: this.historicoFitness,
      executando: this.executando,
      convergiu: this.melhorIndividuo && this.melhorIndividuo.fitness > 1000
    };
  }
}

/**
 * Função para integrar com o sistema existente
 */
function criarAlgoritmoGenetico() {
  const configuracao = {
    tamanhoPopulacao: 150,        // Aumentado para mais diversidade
    numeroGeracoes: 300,           // Aumentado para mais tempo de evolução
    taxaCrossover: 0.85,          // Aumentado para mais mistura
    taxaMutacao: 0.15,            // Aumentado para mais exploração
    tamanhoCromossomo: 150,       // Aumentado para caminhos mais longos
    taxaElitismo: 0.1,
    tamanhoTorneio: 3
  };
  
  return new AlgoritmoGenetico(configuracao);
}

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.AlgoritmoGenetico = AlgoritmoGenetico;
  window.criarAlgoritmoGenetico = criarAlgoritmoGenetico;
  window.ACOES = ACOES;
}
