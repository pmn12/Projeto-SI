                          🤖 Agente Coletor - Visualização de Algoritmos de Busca

Projeto acadêmico desenvolvido para a disciplina de Sistemas Inteligentes, focado na implementação e visualização de algoritmos de busca.

O programa simula um agente coletor em um ambiente 2D (grid) gerado aleatoriamente. Este ambiente possui quatro tipos de terrenos (custo baixo, médio, alto e obstáculos), e o agente deve encontrar o caminho mais eficiente para coletar a comida, com base no algoritmo selecionado.

                                          🚀 Como Executar

O projeto está hospedado no GitHub Pages e pode ser acessado diretamente pelo navegador no link abaixo:

https://pmn12.github.io/Projeto-SI/


                                        ✨ Funcionalidades

Este projeto implementa um ciclo completo de agente, desde a perceção do ambiente até a execução da busca e o movimento.

Geração Aleatória de Mapas: Ao pressionar qualquer tecla, um novo mapa aleatório é gerado com 4 tipos de terrenos.

Terrenos com Custos: O ambiente é composto por terrenos que afetam o custo dos algoritmos (UCS, A*) e a velocidade de movimento do agente:


Areia (Amarelo Claro): Custo 1

Atoleiro (Marrom): Custo 5

Água (Azul): Custo 10

Obstáculo (Cinza): Custo Infinito (Intransponível)


Seleção de Algoritmos: Uma UI permite ao usuário selecionar qual dos 5 algoritmos de busca deseja executar:


Busca em Largura (BFS)

Busca em Profundidade (DFS)

Busca de Custo Uniforme (UCS)

Busca Gulosa (Greedy Best-First)

A* (A-Estrela)


Ciclo de Jogo Automático: Após encontrar a comida e esperar 5 segundos, uma nova comida aparece e o agente automaticamente reinicia a busca, permitindo uma demonstração contínua.

                                    🎨 Visualização da Busca


Para cumprir os requisitos de visualização, a animação da busca é apresentada passo a passo com um código de cores claro:

Ciano (Azul Claro): Nós Visitados

Representa as células que o algoritmo já explorou. São os nós que já foram removidos da fronteira. Mostra o "rastro" ou a área total que a busca precisou de investigar.

Verde: Nós na Fronteira

Representa as células que o algoritmo descobriu, mas ainda não explorou. Esta é a "lista de tarefas" ativa do algoritmo. É a "borda" da onda de busca que se expande pelo mapa.

Linha Amarela: Caminho Final

Representa o caminho ótimo (ou o primeiro encontrado, no caso de BFS/DFS) que o agente irá percorrer. Aparece assim que a busca é concluída.


                                          🛠️ Tecnologias Utilizadas

p5.js - Biblioteca JavaScript para processamento criativo e visual.

JavaScript (ES6+)

HTML5 & CSS3

                                          👥 Integrantes do Grupo

Abhner Adriel (aacs2)

João Henrique Portela (jhpbs)

Breno Silva (bsxs)

Vinícius dos Santos (vsf2)

Paulo Messias do Nascimento (pmn)
