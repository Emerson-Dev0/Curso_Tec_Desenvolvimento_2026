# Jogo de Turnos

Este projeto e um jogo simples de batalha por turnos. Dois personagens lutam na tela, cada um com vida, defesa, ataques, cura e eventos aleatorios durante a partida.

## Como funciona a batalha

Ao clicar em `Batalhar`, o jogo cria dois personagens:

- Guerreiro
- Mago

Cada personagem tem vida, dano de ataque e defesa. O jogador escolhe uma acao por turno:

- `Atacar`: causa dano no adversario.
- `Defender`: aumenta a defesa por um turno.
- `Curar`: recupera um pouco de vida.
- `Proximo Turno`: passa a vez sem fazer outra acao.

Quando a vida de um personagem chega a zero, a batalha termina.

## Como funcionam os turnos

A classe `Jogo`, no arquivo `src/Jogo.ts`, guarda quem esta jogando agora na variavel `turnoAtual`.

Depois de uma acao, a funcao `passarTurno()` troca o jogador da vez. Ela tambem:

- conta quantos turnos ja passaram;
- atualiza efeitos temporarios;
- verifica se chegou a hora de um evento aleatorio;
- atualiza a tela.

## Como funcionam os eventos aleatorios

Os eventos aleatorios tambem ficam em `src/Jogo.ts`.

A cada 2 ou 3 turnos, o jogo sorteia um evento. Os eventos atuais sao:

- terremoto;
- pocao misteriosa;
- mudanca de arena;
- inimigo enfurecido;
- energia extra;
- tempestade eletrica.

Cada evento tem uma funcao propria, por exemplo:

- `eventoTerremoto()`
- `eventoPocaoMisteriosa()`
- `eventoMudancaDeArena()`
- `eventoInimigoEnfurecido()`

Essas funcoes aplicam o efeito no jogo, mandam uma mensagem para o log e, quando precisa, ativam um efeito visual.

## Como funciona o log com efeito de digitacao

O log fica na classe `Personagem`, no arquivo `src/Personagem.ts`.

Quando alguma parte do jogo chama:

```ts
this.log("Mensagem da batalha");
```

a mensagem entra em uma fila. O jogo escreve uma mensagem por vez, letra por letra, dentro da caixa de log.

Para mudar a velocidade do texto, altere estes valores em `src/Personagem.ts`:

```ts
public static velocidadeDigitacaoLog: number = 25;
public static pausaEntreMensagensLog: number = 180;
```

Numero menor significa texto mais rapido. Tambem da para pular a mensagem atual clicando no log ou apertando espaco.

## Como funcionam os efeitos visuais

Os efeitos visuais ficam no arquivo `style_pagina.CSS`.

Quando um evento acontece, `src/Jogo.ts` adiciona uma classe no HTML. O CSS usa essa classe para mudar a aparencia da arena ou dos personagens.

Exemplos:

- `evento-terremoto`: faz a arena tremer.
- `evento-pocao`: faz o personagem curado brilhar.
- `arena-fogo`: muda a arena para tons de fogo.
- `arena-chuva`: muda a arena para tons azulados.
- `inimigo-enfurecido`: deixa o card do personagem com brilho vermelho.
- `arena-tempestade-eletrica`: deixa a arena com clima eletrico.

## Arquivos principais

- `Pagina.html`: estrutura da tela do jogo.
- `style_pagina.CSS`: aparencia do jogo e efeitos visuais.
- `src/Jogo.ts`: controla turnos, botoes, eventos e tela.
- `src/Personagem.ts`: guarda vida, defesa, cura, dano e log.
- `src/Guerreiro.ts`: ataques do guerreiro.
- `src/mago.ts`: ataques do mago.
- `Jogo.js`: arquivo gerado para o navegador executar.

## Como rodar ou testar

Se voce alterou arquivos `.ts`, rode:

```bash
npm run build
```

Depois abra `Pagina.html` no navegador.

Para testar:

1. Clique em `Batalhar`.
2. Use os botoes de ataque, defesa, cura ou proximo turno.
3. Veja o log escrevendo letra por letra.
4. Depois de 2 ou 3 turnos, observe os eventos aleatorios.
5. Confira se a arena ou os personagens mudam de visual quando um evento acontece.
