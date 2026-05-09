"use strict";
(() => {
  // src/Personagem.ts
  var Personagem = class {
    constructor(nome, poder_de_ataque, vida, imagem) {
      // Atributos básicos que todo personagem do jogo precisa ter.
      this.nome = "Personagem";
      this.poder_de_ataque = 0;
      this.vida = 0;
      this.defesa = 0;
      this.imagem = "";
      this.nome = nome;
      this.poder_de_ataque = poder_de_ataque;
      this.vida = vida;
      this.vidaMaxima = vida;
      this.imagem = imagem;
    }
    isContinuaVivo() {
      return this.vida > 0;
    }
    // Calcula o dano recebido considerando a defesa do personagem.
    sofreu_dano(dano) {
      const danoFinal = dano * (1 - this.defesa);
      this.vida = Math.max(0, this.vida - danoFinal);
      this.log(
        `${this.nome} recebeu ${danoFinal} de dano. vida atual: ${this.vida}`
      );
    }
    gerarAtaque() {
      return Math.floor(Math.random() * 3);
    }
    // Recupera um pouco de vida quando o personagem está com pouca vida.
    curarSeNecessario() {
      if (this.vida <= this.vidaMaxima * 0.5) {
        this.vida += this.vidaMaxima * 0.2;
        if (this.vida > this.vidaMaxima) {
          this.vida = this.vidaMaxima;
        }
        this.log(`${this.nome} regenerou vida! Vida atual: ${this.vida}`);
      }
    }
    getVida() {
      return this.vida;
    }
    getImg() {
      return this.imagem;
    }
    log(mensagem) {
      document.getElementById("console").innerHTML += "<p>" + mensagem + "</p>\n";
    }
  };

  // src/Guerreiro.ts
  var Guerreiro = class extends Personagem {
    constructor(nome, poder_de_ataque, vida) {
      super(nome, poder_de_ataque, vida, "./imagem1.png");
      this.defesa = 0.05;
    }
    // O guerreiro sorteia um dos ataques e aplica dano no adversário.
    atacar(persona) {
      const tipoAtaque = this.gerarAtaque();
      let dano = 0;
      if (tipoAtaque === 0) {
        dano = this.poder_de_ataque * 1.1;
        this.log(`${this.nome} Me d\xEA o cuuuuubo.`);
      } else if (tipoAtaque === 1) {
        dano = this.poder_de_ataque * 1.8;
        this.log(`${this.nome} Coffe with bread.`);
      } else {
        dano = this.poder_de_ataque * 2.1;
        this.log(`${this.nome} BEANS WHIT FLAVOR? \u{1F480}`);
      }
      persona.sofreu_dano(dano);
      persona.curarSeNecessario();
    }
  };

  // src/mago.ts
  var Mago = class extends Personagem {
    constructor(nome, poder_de_ataque, vida) {
      super(nome, poder_de_ataque, vida, "./imagem2.png");
      this.defesa = 0.05;
    }
    // O mago sorteia uma magia e causa dano de acordo com o ataque escolhido.
    atacar(persona) {
      const tipoAtaque = this.gerarAtaque();
      let dano = 0;
      if (tipoAtaque === 0) {
        dano = this.poder_de_ataque;
        this.log(`${this.nome} usou baratas mexicanas \u{1F41C}`);
      } else if (tipoAtaque === 1) {
        dano = this.poder_de_ataque * 1.2;
        this.log(`${this.nome} usou 71kg de batata doce \u{1F360}`);
      } else {
        dano = this.poder_de_ataque * 1.4;
        this.log(`${this.nome} usou Feij\xE3o com farinha \u{1F480}`);
      }
      persona.sofreu_dano(dano);
      persona.curarSeNecessario();
    }
  };

  // src/Jogo.ts
  var Jogo = class {
    constructor() {
      this.turnoAtual = "";
    }
    // Prepara uma nova batalha e mostra os dados iniciais na tela.
    iniciar(player1, player2) {
      this.jogadorUm = player1;
      this.jogadorDois = player2;
      this.turnoAtual = this.jogadorUm.nome;
      this.limparLog();
      this.atualizarInterface(this.jogadorUm, this.jogadorDois);
      this.atualizarTextoTurno();
      this.adicionarLog("A batalha come\xE7ou!");
    }
    buscaComponenteHtml(id) {
      return document.getElementById(id);
    }
    // Atualiza nomes, imagens e vidas dos jogadores no HTML.
    atualizarInterface(jogadorUm, jogadorDois) {
      const imgJogadorUm = document.getElementById("imgJogadorUm");
      const imgJogadorDois = document.getElementById("imgJogadorDois");
      if (imgJogadorUm !== null) {
        imgJogadorUm.src = jogadorUm.getImg();
      }
      if (imgJogadorDois !== null) {
        imgJogadorDois.src = jogadorDois.getImg();
      }
      const vidaJogadorUm = this.buscaComponenteHtml("JogadorUmVida");
      const vidaJogadorDois = this.buscaComponenteHtml("JogadorDoisVida");
      const nomeUm = this.buscaComponenteHtml("NomeUm");
      const nomeDois = this.buscaComponenteHtml("NomeDois");
      if (vidaJogadorUm !== null) {
        vidaJogadorUm.textContent = "HP: " + jogadorUm.getVida();
      }
      if (vidaJogadorDois !== null) {
        vidaJogadorDois.textContent = "HP: " + jogadorDois.getVida();
      }
      if (nomeUm !== null) {
        nomeUm.textContent = jogadorUm.nome;
      }
      if (nomeDois !== null) {
        nomeDois.textContent = jogadorDois.nome;
      }
      const barraVida = this.buscaComponenteHtml("barraVida");
      if (barraVida !== null) {
        barraVida.style.width = jogadorUm.getVida() / 300 * 100 + "%";
      }
    }
    // Executa o ataque do jogador que está com o turno.
    Atacar() {
      if (!this.jogoFoiIniciado()) {
        this.adicionarLog("Clique em Batalhar primeiro!");
        return;
      }
      this.adicionarLog("A escolha do turno foi " + this.turnoAtual + ": ATAQUE!");
      if (this.turnoAtual === this.jogadorUm.nome) {
        this.jogadorUm.atacar(this.jogadorDois);
      } else {
        this.jogadorDois.atacar(this.jogadorUm);
      }
      this.atualizarInterface(this.jogadorUm, this.jogadorDois);
      if (!this.jogadorUm.isContinuaVivo() || !this.jogadorDois.isContinuaVivo()) {
        this.verificarVencedor();
        return;
      }
      this.passarTurno();
    }
    Defender() {
      if (!this.jogoFoiIniciado()) {
        this.adicionarLog("Clique em Batalhar primeiro!");
        return;
      }
      this.adicionarLog("A escolha do turno foi " + this.turnoAtual + ": DEFESA!");
      this.passarTurno();
    }
    Curar() {
      if (!this.jogoFoiIniciado()) {
        this.adicionarLog("Clique em Batalhar primeiro!");
        return;
      }
      this.adicionarLog("A escolha do turno foi " + this.turnoAtual + ": CURAR!");
      this.passarTurno();
    }
    // Alterna o turno entre os dois jogadores.
    passarTurno() {
      if (!this.jogoFoiIniciado()) {
        this.adicionarLog("Clique em Batalhar primeiro!");
        return;
      }
      if (this.turnoAtual === this.jogadorUm.nome) {
        this.turnoAtual = this.jogadorDois.nome;
      } else {
        this.turnoAtual = this.jogadorUm.nome;
      }
      this.atualizarTextoTurno();
      this.atualizarLogTurno();
    }
    atualizarTextoTurno() {
      this.adicionarLog("Agora \xE9 a vez do " + this.turnoAtual + " jogar!");
    }
    atualizarLogTurno() {
      const textoTurno = document.getElementById("turnoAtual");
      if (textoTurno !== null) {
        textoTurno.textContent = "Turno Atual: " + this.turnoAtual;
      }
    }
    // Confere se algum jogador ficou sem vida e mostra o resultado.
    verificarVencedor() {
      if (this.jogadorUm.isContinuaVivo() && !this.jogadorDois.isContinuaVivo()) {
        this.adicionarLog(this.jogadorUm.nome + " ganhou a luta!");
      } else if (this.jogadorDois.isContinuaVivo() && !this.jogadorUm.isContinuaVivo()) {
        this.adicionarLog(this.jogadorDois.nome + " ganhou a luta!");
      } else {
        this.adicionarLog("A luta terminou em empate!");
      }
    }
    adicionarLog(mensagem) {
      const consoleBatalha = document.getElementById("console");
      if (consoleBatalha !== null) {
        consoleBatalha.innerHTML += `<p>${mensagem}</p>`;
        consoleBatalha.scrollTop = consoleBatalha.scrollHeight;
      }
    }
    limparLog() {
      const consoleBatalha = document.getElementById("console");
      if (consoleBatalha !== null) {
        consoleBatalha.innerHTML = "";
      }
    }
    jogoFoiIniciado() {
      return this.jogadorUm !== void 0 && this.jogadorDois !== void 0;
    }
  };
  var jogo = new Jogo();
  function construirJogo() {
    const guerreiro = new Guerreiro("Guerreiro", 90, 300);
    const mago = new Mago("Mago", 120, 200);
    jogo = new Jogo();
    jogo.iniciar(guerreiro, mago);
  }
  window.addEventListener("DOMContentLoaded", () => {
    const btnBatalhar = document.getElementById("Batalhar");
    const btnAtacar = document.getElementById("btnAtacar");
    const btnDefender = document.getElementById("btnDefender");
    const btnCurar = document.getElementById("btnCurar");
    const btnProximoTurno = document.getElementById("btnPassarTurno");
    console.log("Batalhar:", btnBatalhar);
    console.log("Atacar:", btnAtacar);
    console.log("Defender:", btnDefender);
    console.log("Curar:", btnCurar);
    console.log("Passar turno:", btnProximoTurno);
    if (btnBatalhar !== null) {
      btnBatalhar.addEventListener("click", () => {
        console.log("Clicou em Batalhar");
        construirJogo();
      });
    }
    if (btnAtacar !== null) {
      btnAtacar.addEventListener("click", () => {
        console.log("Clicou em Atacar");
        jogo.Atacar();
      });
    }
    if (btnDefender !== null) {
      btnDefender.addEventListener("click", () => {
        console.log("Clicou em Defender");
        jogo.Defender();
      });
    }
    if (btnCurar !== null) {
      btnCurar.addEventListener("click", () => {
        console.log("Clicou em Curar");
        jogo.Curar();
      });
    }
    if (btnProximoTurno !== null) {
      btnProximoTurno.addEventListener("click", () => {
        console.log("Clicou em Passar Turno");
        jogo.passarTurno();
      });
    }
  });
})();
