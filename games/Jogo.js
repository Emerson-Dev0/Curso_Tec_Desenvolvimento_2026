"use strict";
(() => {
  // src/Personagem.ts
  var Personagem = class {
    constructor(nome, poder_de_ataque, vida, imagem) {
      // Atributos basicos que todo personagem do jogo precisa ter.
      this.nome = "Personagem";
      this.poder_de_ataque = 0;
      this.vida = 0;
      this.defesa = 0;
      this.defesaExtra = 0;
      this.valorDefesaExtra = 0.4;
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
      const defesaTotal = this.getDefesaTotal();
      const danoBruto = Math.round(dano);
      const danoFinal = Math.round(danoBruto * (1 - defesaTotal));
      this.vida = Math.max(0, this.vida - danoFinal);
      if (this.defesaExtra > 0) {
        this.log(`${this.nome} bloqueou ${danoBruto - danoFinal} de dano com a defesa.`);
      }
      this.log(
        `${this.nome} recebeu ${danoFinal} de dano. vida atual: ${this.vida}`
      );
    }
    gerarAtaque() {
      return Math.floor(Math.random() * 3);
    }
    defender() {
      if (!this.isContinuaVivo()) {
        return;
      }
      this.defesaExtra = this.valorDefesaExtra;
      this.log(`${this.nome} se defendeu! Defesa aumentada no proximo turno do oponente.`);
    }
    finalizarDefesa() {
      if (this.defesaExtra > 0) {
        this.defesaExtra = 0;
        this.log(`${this.nome} baixou a defesa.`);
      }
    }
    curar() {
      if (!this.isContinuaVivo()) {
        return;
      }
      if (this.vida >= this.vidaMaxima) {
        this.log(`${this.nome} ja esta com a vida cheia.`);
        return;
      }
      this.vida += this.vidaMaxima * 0.25;
      if (this.vida > this.vidaMaxima) {
        this.vida = this.vidaMaxima;
      }
      this.log(`${this.nome} recuperou vida! Vida atual: ${this.vida}`);
    }
    getVida() {
      return this.vida;
    }
    getVidaMaxima() {
      return this.vidaMaxima;
    }
    getDefesaTotal() {
      return Math.min(0.9, this.defesa + this.defesaExtra);
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
      super(nome, poder_de_ataque, vida, "./src/imagem2.png");
      this.defesa = 0.12;
    }
    // O guerreiro sorteia um dos ataques e aplica dano no adversário.
    atacar(persona) {
      const tipoAtaque = this.gerarAtaque();
      let dano = 0;
      if (tipoAtaque === 0) {
        dano = this.poder_de_ataque * 0.9;
        this.log(`${this.nome} Me d\xEA o cuuuuubo.`);
      } else if (tipoAtaque === 1) {
        dano = this.poder_de_ataque * 1.15;
        this.log(`${this.nome} Coffe with bread.`);
      } else {
        dano = this.poder_de_ataque * 1.35;
        this.log(`${this.nome} BEANS WHIT FLAVOR? \u{1F480}`);
      }
      persona.sofreu_dano(dano);
    }
  };

  // src/mago.ts
  var Mago = class extends Personagem {
    constructor(nome, poder_de_ataque, vida) {
      super(nome, poder_de_ataque, vida, "./src/imagem1.png");
      this.defesa = 0.06;
    }
    // O mago sorteia uma magia e causa dano de acordo com o ataque escolhido.
    atacar(persona) {
      const tipoAtaque = this.gerarAtaque();
      let dano = 0;
      if (tipoAtaque === 0) {
        dano = this.poder_de_ataque * 0.95;
        this.log(`${this.nome} usou baratas mexicanas \u{1F41C}`);
      } else if (tipoAtaque === 1) {
        dano = this.poder_de_ataque * 1.2;
        this.log(`${this.nome} usou 71kg de batata doce \u{1F360}`);
      } else {
        dano = this.poder_de_ataque * 1.45;
        this.log(`${this.nome} usou Feij\xE3o com farinha \u{1F480}`);
      }
      persona.sofreu_dano(dano);
    }
  };

  // src/Jogo.ts
  var Jogo = class {
    constructor() {
      this.turnoAtual = "";
      this.acabou = false;
    }
    iniciar(player1, player2) {
      this.jogadorUm = player1;
      this.jogadorDois = player2;
      this.turnoAtual = this.jogadorUm.nome;
      this.acabou = false;
      this.limparConsole();
      this.ativarBotoes(true);
      this.atualizarTela();
      this.mostrarTurno();
      this.log("A batalha come\xE7ou!");
    }
    Atacar() {
      if (!this.podeJogar()) {
        return;
      }
      this.log(this.turnoAtual + " atacou!");
      if (this.turnoAtual === this.jogadorUm.nome) {
        this.jogadorUm.atacar(this.jogadorDois);
      } else {
        this.jogadorDois.atacar(this.jogadorUm);
      }
      this.atualizarTela();
      if (!this.jogadorUm.isContinuaVivo() || !this.jogadorDois.isContinuaVivo()) {
        this.finalizarJogo();
        return;
      }
      this.passarTurno();
    }
    Defender() {
      if (!this.podeJogar()) {
        return;
      }
      this.getJogadorAtual().defender();
      this.atualizarTela();
      this.passarTurno();
    }
    Curar() {
      if (!this.podeJogar()) {
        return;
      }
      this.getJogadorAtual().curar();
      this.atualizarTela();
      this.passarTurno();
    }
    passarTurno() {
      if (!this.podeJogar()) {
        return;
      }
      let proximoJogador;
      if (this.turnoAtual === this.jogadorUm.nome) {
        this.turnoAtual = this.jogadorDois.nome;
        proximoJogador = this.jogadorDois;
      } else {
        this.turnoAtual = this.jogadorUm.nome;
        proximoJogador = this.jogadorUm;
      }
      proximoJogador.finalizarDefesa();
      this.atualizarTela();
      this.mostrarTurno();
    }
    atualizarTela() {
      const imgUm = document.getElementById("imgJogadorUm");
      const imgDois = document.getElementById("imgJogadorDois");
      const barraUm = document.getElementById("barraVida");
      const barraDois = document.getElementById("barraVidaDois");
      const barraDefesaUm = document.getElementById("barraDefesaUm");
      const barraDefesaDois = document.getElementById("barraDefesaDois");
      const cardUm = document.getElementById("cardJogadorUm");
      const cardDois = document.getElementById("cardJogadorDois");
      imgUm.src = this.jogadorUm.getImg();
      imgDois.src = this.jogadorDois.getImg();
      document.getElementById("NomeUm").textContent = this.jogadorUm.nome;
      document.getElementById("NomeDois").textContent = this.jogadorDois.nome;
      document.getElementById("JogadorUmVida").textContent = "HP: " + this.jogadorUm.getVida();
      document.getElementById("JogadorDoisVida").textContent = "HP: " + this.jogadorDois.getVida();
      barraUm.style.width = this.calcularVida(this.jogadorUm) + "%";
      barraDois.style.width = this.calcularVida(this.jogadorDois) + "%";
      barraDefesaUm.style.width = this.calcularDefesa(this.jogadorUm) + "%";
      barraDefesaDois.style.width = this.calcularDefesa(this.jogadorDois) + "%";
      cardUm.classList.toggle("morto", !this.jogadorUm.isContinuaVivo());
      cardDois.classList.toggle("morto", !this.jogadorDois.isContinuaVivo());
    }
    calcularVida(jogador) {
      return Math.max(0, jogador.getVida() / jogador.getVidaMaxima() * 100);
    }
    calcularDefesa(jogador) {
      return jogador.getDefesaTotal() * 100;
    }
    getJogadorAtual() {
      if (this.turnoAtual === this.jogadorUm.nome) {
        return this.jogadorUm;
      }
      return this.jogadorDois;
    }
    finalizarJogo() {
      this.acabou = true;
      this.ativarBotoes(false);
      document.getElementById("turnoAtual").textContent = "Fim de jogo";
      if (this.jogadorUm.isContinuaVivo()) {
        this.log(this.jogadorUm.nome + " ganhou a luta!");
      } else if (this.jogadorDois.isContinuaVivo()) {
        this.log(this.jogadorDois.nome + " ganhou a luta!");
      } else {
        this.log("A luta terminou em empate!");
      }
    }
    podeJogar() {
      if (this.jogadorUm === void 0 || this.jogadorDois === void 0) {
        this.log("Clique em Batalhar primeiro!");
        return false;
      }
      if (this.acabou) {
        this.log("A batalha j\xE1 terminou. Clique em Batalhar para jogar de novo.");
        return false;
      }
      return true;
    }
    mostrarTurno() {
      document.getElementById("turnoAtual").textContent = "Turno atual: " + this.turnoAtual;
      this.log("Agora \xE9 a vez do " + this.turnoAtual + " jogar!");
    }
    ativarBotoes(ativo) {
      const botoes = ["btnAtacar", "btnDefender", "btnCurar", "btnPassarTurno"];
      botoes.forEach((id) => {
        const botao = document.getElementById(id);
        botao.disabled = !ativo;
      });
    }
    log(mensagem) {
      const consoleBatalha = document.getElementById("console");
      consoleBatalha.innerHTML += "<p>" + mensagem + "</p>";
      consoleBatalha.scrollTop = consoleBatalha.scrollHeight;
    }
    limparConsole() {
      document.getElementById("console").innerHTML = "";
    }
  };
  var jogo = new Jogo();
  function construirJogo() {
    const guerreiro = new Guerreiro("Guerreiro", 70, 300);
    const mago = new Mago("Mago", 85, 240);
    jogo = new Jogo();
    jogo.iniciar(guerreiro, mago);
  }
  window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("Batalhar")?.addEventListener("click", construirJogo);
    document.getElementById("btnAtacar")?.addEventListener("click", () => jogo.Atacar());
    document.getElementById("btnDefender")?.addEventListener("click", () => jogo.Defender());
    document.getElementById("btnCurar")?.addEventListener("click", () => jogo.Curar());
    document.getElementById("btnPassarTurno")?.addEventListener("click", () => jogo.passarTurno());
  });
})();
