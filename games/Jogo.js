"use strict";
(() => {
  // src/Personagem.ts
  var Personagem = class {
    constructor(nome, poder_de_ataque, vida, imagem) {
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
    async iniciar(player1, player2) {
      let turno = 1;
      let maxTurnos = 20;
      while (player1.isContinuaVivo() && player2.isContinuaVivo() && turno <= maxTurnos) {
        player2.log("\n===================== turno " + turno + " =====================");
        player1.atacar(player2);
        if (!player2.isContinuaVivo()) break;
        player2.atacar(player1);
        turno++;
      }
      if (player1.isContinuaVivo() && !player2.isContinuaVivo()) {
        player1.log(`${player1.nome} ganhou a luta!`);
        this.atualizarInterface(player1, player2);
        await this.delay();
      } else if (player2.isContinuaVivo() && !player1.isContinuaVivo()) {
        player2.log(`${player2.nome} ganhou a luta!`);
        this.atualizarInterface(player1, player2);
        await this.delay();
      } else {
        player2.log("A luta terminou em empate!");
      }
    }
    buscaComponenteHtml(id) {
      return document.getElementById(id);
    }
    atualizarInterface(jogadorUm, jogadorDois) {
      document.getElementById("imgJogadorUm").src = jogadorUm.getImg();
      document.getElementById("imgJogadorDois").src = jogadorDois.getImg();
      this.buscaComponenteHtml("JogadorUmVida").textContent = "HP: " + jogadorUm.getVida();
      this.buscaComponenteHtml("JogadorDoisVida").textContent = "HP: " + jogadorDois.getVida();
      this.buscaComponenteHtml("NomeUm").textContent = "HP: " + jogadorUm.nome;
      this.buscaComponenteHtml("NomeDois").textContent = "HP: " + jogadorDois.nome;
      this.buscaComponenteHtml("barraVida").style.width = jogadorUm.getVida() / 300 * 100 + "%";
    }
    delay() {
      return new Promise((x) => setTimeout(x, 800));
    }
  };
  function construirjogo() {
    let mago = new Mago("Mago", 120, 200);
    let guerreiro = new Guerreiro("Guerreiro", 90, 300);
    let jogo = new Jogo();
    jogo.iniciar(mago, guerreiro);
  }
  document.getElementById("Batalhar")?.addEventListener("click", construirjogo);
})();
