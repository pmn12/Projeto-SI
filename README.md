# 🤖 Agente Coletor - Visualização de Algoritmos de Busca

<div align="center">

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0-brightgreen.svg)

**Projeto acadêmico desenvolvido para a disciplina de Sistemas Inteligentes**

[🚀 Demo Online](https://pmn12.github.io/Projeto-SI/) | [📖 Documentação](#-funcionalidades) | [👥 Equipe](#-integrantes-do-grupo)

</div>

## 👥 Integrantes do Grupo

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/aacs2">
        <img src="https://avatars.githubusercontent.com/u/3958845?v=4" width="80px;" alt="Abhner Adriel"/><br>
        <b>Abhner Adriel</b>
      </a>
      <br>
      <code>aacs2</code>
    </td>
    <td align="center">
      <a href="https://github.com/joaohenriquebrs">
        <img src="https://avatars.githubusercontent.com/u/83253838?v=4" width="80px;" alt="João Henrique Portela"/><br>
        <b>João Henrique Portela</b>
      </a>
      <br>
      <code>jhpbs</code>
    </td>
    <td align="center">
      <a href="https://github.com/brenorev">
        <img src="https://avatars.githubusercontent.com/u/84048306?v=4" width="80px;" alt="Breno Silva"/><br>
        <b>Breno Silva</b>
      </a>
      <br>
      <code>bsxs</code>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/M1NHOCON">
        <img src="https://avatars.githubusercontent.com/u/114231746?v=4" width="80px;" alt="Vinícius dos Santos"/><br>
        <b>Vinícius dos Santos</b>
      </a>
      <br>
      <code>vsf2</code>
    </td>
    <td align="center">
      <a href="https://github.com/pmn12">
        <img src="https://avatars.githubusercontent.com/u/29960868?v=4" width="80px;" alt="Paulo Messias do Nascimento"/><br>
        <b>Paulo Messias do Nascimento</b>
      </a>
      <br>
      <code>pmn</code>
    </td>
    <td></td>
  </tr>
</table>

---

## 📋 Sobre o Projeto

Este projeto simula um **agente coletor inteligente** em um ambiente 2D (grid) gerado aleatoriamente. O agente deve encontrar o caminho mais eficiente para coletar alimentos, navegando por diferentes tipos de terrenos com custos variados, utilizando **algoritmos clássicos de busca e técnicas evolutivas** de IA.

O sistema oferece uma **visualização interativa** e **comparação de performance** entre **6 algoritmos de busca diferentes** (incluindo o inovador Algoritmo Genético), permitindo análise detalhada de métricas como nós visitados, custo do caminho e tempo de execução.

---

## 🚀 Como Executar

### 🌐 Acesso Online
O projeto está hospedado no GitHub Pages e pode ser acessado diretamente:

**🔗 [https://pmn12.github.io/Projeto-SI/](https://pmn12.github.io/Projeto-SI/)**

### 💻 Execução Local
```bash
# Clone o repositório
git clone https://github.com/pmn12/Projeto-SI.git

# Navegue até a pasta
cd Projeto-SI

# Abra o arquivo index.html em seu navegador
# Ou use um servidor local (recomendado)
python -m http.server 8000
# Acesse: http://localhost:8000
```

---

## ✨ Funcionalidades

### 🎮 **Modo Busca Individual**
- **Seleção de Algoritmos**: Escolha entre 6 algoritmos de busca (incluindo AG)
- **Visualização em Tempo Real**: Animação passo a passo da execução
- **Controle de Velocidade**: 1x, 2x ou 3x de velocidade
- **Dashboard de Métricas**: Visualize em tempo real:
  - 📊 Nós visitados
  - 🎯 Tamanho da fronteira
  - 💰 Custo total do caminho
  - 📏 Comprimento do caminho
  - ⏱️ Tempo de busca
  - 🍎 Comidas coletadas

### 📊 **Modo Comparativo** (⭐ Novo!)
- **Execução Simultânea**: Rode todos os algoritmos no mesmo mapa
- **Comparação Justa**: Mesmo ambiente, mesma posição inicial e objetivo
- **Análise de Performance**: Tabela comparativa com todas as métricas
- **Identificação Automática**: Destaque dos melhores algoritmos

### 🗺️ **Geração de Mapas Inteligente**
- **Mapas Aleatórios**: Geração procedural com seed controlada
- **Configuração Personalizável**: Ajuste proporções de terrenos via sliders
- **Validação de Caminhos**: Garante que toda comida tenha caminho válido
- **4 Tipos de Terrenos**:
  - 🟡 **Areia** (Amarelo Claro): Custo 1
  - 🟤 **Atoleiro** (Marrom): Custo 5
  - 🔵 **Água** (Azul): Custo 10
  - ⬛ **Obstáculo** (Preto): Intransponível

### 🔄 **Sistema de Jogo Automático**
- **Ciclo Contínuo**: Após coletar comida, gera novo mapa automaticamente
- **Reset Inteligente**: Mantém contador de comidas coletadas
- **Animação de Coleta**: Feedback visual ao alcançar objetivo

---

## 🎨 Visualização da Busca

Sistema de cores intuitivo para acompanhar a execução dos algoritmos:

| Cor | Significado | Descrição |
|-----|-------------|-----------|
| 🔵 **Ciano** | Nós Visitados | Células já exploradas pelo algoritmo |
| 🟢 **Verde** | Fronteira | Células descobertas mas não exploradas |
| 🟡 **Amarelo** | Caminho Final | Caminho ótimo encontrado |
| 🔴 **Vermelho** | Agente | Posição atual do agente |
| 🍎 **Verde** | Comida | Objetivo a ser alcançado |

---

## 🧠 Algoritmos Implementados

### 1. **BFS (Busca em Largura)**
- ✅ Completo e ótimo (sem custos)
- 📦 Usa fila (FIFO)
- 🎯 Encontra o caminho mais curto em número de passos

### 2. **DFS (Busca em Profundidade)**
- ⚠️ Completo mas não ótimo
- 📚 Usa pilha (LIFO)
- 🔍 Explora profundamente antes de retroceder

### 3. **UCS (Busca de Custo Uniforme)**
- ✅ Completo e ótimo
- 💰 Considera custos dos terrenos
- 📊 Usa fila de prioridade por custo acumulado

### 4. **Greedy (Busca Gulosa)**
- ⚡ Rápida mas não ótima
- 🎯 Usa heurística (Distância de Manhattan)
- 📈 Fila de prioridade por distância estimada

### 5. **A\* (A-Estrela)**
- ⭐ Completo e ótimo
- 🧮 Combina custo real + heurística: `f(n) = g(n) + h(n)`
- 🏆 Melhor equilíbrio entre eficiência e otimalidade

### 6. **AG (Algoritmo Genético)**
- 🧬 Baseado em evolução natural
- 🎲 Usa população de soluções que evoluem ao longo de gerações
- 🔄 Operadores genéticos: Seleção, Crossover, Mutação, Elitismo
- 📊 Função de fitness multiobjetivo
- ⚠️ Não garante solução ótima, mas explora amplamente o espaço de busca

**Heurística Utilizada:** Distância de Manhattan
```javascript
h(n) = |x₁ - x₂| + |y₁ - y₂|
```

#### **Como o AG Funciona:**

**Representação (Cromossomo):**
- Cada indivíduo é uma sequência de 150 ações (Norte, Sul, Leste, Oeste, Diagonais)
- População de 150 indivíduos evoluindo por até 300 gerações

**Função de Fitness:**
```javascript
Se coletou comida:
  fitness = 1000 + (eficiência × 100) - (custo × 0.1) - (passos × 0.01)
Senão:
  fitness = max(0, 999 - (distância × 10) - (custo × 0.1) - (passos × 0.01))
```

**Operadores Genéticos:**
- **Seleção**: Torneio de 3 indivíduos
- **Elitismo**: 10% dos melhores passam direto para próxima geração
- **Crossover**: Ponto único com taxa de 85%
- **Mutação**: Uniforme com taxa de 15%

**Parâmetros:**
- Tamanho da População: 150
- Número de Gerações: 300
- Taxa de Crossover: 85%
- Taxa de Mutação: 15%
- Taxa de Elitismo: 10%
- Tamanho do Cromossomo: 150 ações

---

## 🎯 Interface do Usuário

### **Controles Disponíveis**

#### 🔍 Busca Individual
- **Seleção de Algoritmo**: 6 botões para escolha rápida (BFS, DFS, UCS, Gulosa, A*, AG)
- **Controles de Busca**:
  - ▶️ Iniciar/⏸️ Pausar
  - ⏩ Velocidades: 1x, 2x, 3x
- **Configuração de Mapa**:
  - 🔄 Gerar Novo Mapa
  - 🎚️ Sliders para ajustar terrenos

#### 📊 Comparativo
- **Executar Comparativo**: Roda todos os algoritmos
- **Limpar Resultados**: Reseta a tabela
- **Ver Caminho**: Visualiza caminho individual de cada algoritmo
- **Tabela de Resultados**: Métricas completas e comparação

### **Modal de Avisos**
- Notifica quando algoritmo é alterado durante busca
- Opções: Confirmar ou Cancelar alteração
- Previne mudanças acidentais

---

## 📊 Métricas de Performance

O sistema coleta e exibe métricas detalhadas:

| Métrica | Descrição | Uso |
|---------|-----------|-----|
| **Nós Visitados** | Total de células exploradas (AG: gerações × população) | Eficiência espacial |
| **Custo Total** | Soma dos custos dos terrenos | Qualidade da solução |
| **Comprimento** | Número de passos no caminho | Distância percorrida |
| **Tempo de Busca** | Duração em segundos | Eficiência temporal |
| **Taxa de Sucesso** | Se encontrou solução | Completude |

**Nota sobre AG:** Para o Algoritmo Genético, "Nós Visitados" representa o total de indivíduos avaliados (gerações × tamanho da população), refletindo o esforço computacional para encontrar a solução.

### 🏆 Identificação do Melhor
No modo comparativo, o sistema automaticamente destaca:
- 🟢 **Verde**: Menor número de nós visitados
- 🟢 **Verde**: Menor custo total
- 🟢 **Verde**: Menor tempo de execução

---

## 🛠️ Tecnologias Utilizadas

<div align="center">

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black) | ES6+ | Lógica principal |
| ![P5.js](https://img.shields.io/badge/-P5.js-ED225D?logo=p5.js&logoColor=white) | 1.7.0 | Visualização e canvas |
| ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white) | 5 | Estrutura |
| ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white) | 3 | Estilização |

</div>

### 📁 Estrutura de Arquivos
```
Projeto-SI/
├── index.html              # Interface principal
├── sketch.js               # Lógica principal e visualização
├── config.js               # Configurações globais
├── grid.js                 # Geração e renderização do grid
├── entities.js             # Entidades (agente, comida)
├── utils.js                # Funções utilitárias
├── bfs.js                  # Implementação BFS
├── dfs.js                  # Implementação DFS
├── ucs.js                  # Implementação UCS
├── greedy.js               # Implementação Greedy
├── astar.js                # Implementação A*
├── genetic-algorithm.js    # Implementação AG ⭐ NOVO
├── agent.png               # Sprite do agente
└── food.png                # Sprite da comida
```

---

## 🎓 Conceitos de IA Aplicados

### **Busca em Espaço de Estados**
- Representação do problema como grafo
- Estado: posição (x, y) no grid
- Ações: mover para células adjacentes (cima, baixo, esquerda, direita)
- Objetivo: alcançar a posição da comida

### **Estruturas de Dados**
- **Set**: Controle de nós visitados
- **Fila**: BFS (FIFO)
- **Pilha**: DFS (LIFO)
- **Fila de Prioridade**: UCS, Greedy, A* (ordenação por prioridade)
- **População de Indivíduos**: AG (array de cromossomos)

### **Heurísticas**
- Função admissível (nunca superestima)
- Distância de Manhattan para grid 4-conectado
- Consistência garantida

### **Computação Evolutiva**
- **Representação genética**: Cromossomos como sequências de ações
- **Função de fitness multiobjetivo**: Avalia qualidade da solução
- **Operadores evolutivos**: Seleção, crossover, mutação, elitismo
- **Convergência adaptativa**: Exploração vs. exploitação do espaço de busca

---

## 📈 Casos de Uso

### 🎯 **Educacional**
- Visualizar diferenças entre algoritmos de busca clássicos e evolutivos
- Compreender trade-offs entre tempo e qualidade
- Analisar impacto de heurísticas vs. evolução de soluções
- Comparar abordagens determinísticas (A*, BFS) vs. estocásticas (AG)

### 🔬 **Análise Comparativa**
- Comparar performance em diferentes cenários
- Identificar algoritmo ideal para cada situação
- Estudar comportamento em mapas complexos
- Avaliar convergência do AG vs. garantias de algoritmos clássicos

### 🎮 **Demonstração**
- Apresentações de conceitos de IA
- Workshops e tutoriais
- Material didático interativo

---

## 🧬 Destaque: Algoritmo Genético (AG)

O **Algoritmo Genético** foi implementado como uma extensão inovadora ao projeto, trazendo uma abordagem completamente diferente dos algoritmos clássicos de busca:

### **🎯 Características Únicas:**

**Abordagem Evolutiva:**
- Ao invés de explorar sistematicamente o espaço de estados, o AG evolui uma população de soluções
- Simula processos de seleção natural: sobrevivência dos mais aptos
- Cada geração melhora progressivamente em direção à solução ótima

**Exploração do Espaço de Busca:**
- **Algoritmos Clássicos**: Exploração determinística, ordem definida
- **AG**: Exploração estocástica, múltiplas soluções simultâneas

**Trade-offs:**
- ✅ **Vantagem**: Explora amplamente o espaço de busca, pode encontrar soluções criativas
- ✅ **Vantagem**: Robusto em cenários complexos com múltiplos objetivos
- ❌ **Desvantagem**: Mais lento (avalia ~45.000 indivíduos em média)
- ❌ **Desvantagem**: Não garante solução ótima

### **📊 Comparação Típica de Performance:**

| Algoritmo | Nós Visitados | Tempo (s) | Garantia de Otimalidade |
|-----------|---------------|-----------|------------------------|
| A* | ~200-300 | 0.8-1.2 | ✅ Sim |
| BFS | ~200-250 | 1.0-1.5 | ✅ Sim (sem custos) |
| Gulosa | ~40-60 | 0.05-0.10 | ❌ Não |
| **AG** | **~45.000** | **2.0-3.0** | ❌ Não |

**Por que usar AG então?**
- Demonstração educacional de computação evolutiva
- Comparação de paradigmas: busca determinística vs. estocástica
- Aplicações em problemas onde algoritmos clássicos não funcionam bem
- Fundamento para técnicas mais avançadas (NEAT, Genetic Programming)

### **🔬 Implementação Técnica:**

O AG foi integrado ao sistema mantendo a mesma interface dos outros algoritmos:
- Classe `AgSearch` para compatibilidade com o loop de animação
- Visualização em tempo real do progresso evolutivo
- Métricas adaptadas (gerações × população = nós visitados)
- Sistema de fitness rigoroso (só reporta sucesso se realmente coletou a comida)

**Arquivo:** `genetic-algorithm.js` (461 linhas)
- Classes: `IndividuoAG`, `AlgoritmoGenetico`, `AgSearch`
- Operadores completos: seleção por torneio, crossover de ponto único, mutação uniforme, elitismo
- Função de fitness multiobjetivo balanceando coleta, custo, eficiência e distância

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos na disciplina de **Sistemas Inteligentes**.
