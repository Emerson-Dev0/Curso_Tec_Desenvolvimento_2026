"use strict";
(() => {
  // src/GerenciadorLog.ts
  var GerenciadorLog = class _GerenciadorLog {
    static {
      this.fila = [];
    }
    static {
      this.escrevendo = false;
    }
    static {
      this.textoAtual = "";
    }
    static {
      this.indiceTexto = 0;
    }
    static {
      this.elementoTexto = null;
    }
    static {
      this.elementoCursor = null;
    }
    static {
      this.atalhosAtivados = false;
    }
    static {
      // Diminua esse numero para o texto aparecer mais rapido.
      this.velocidadeDigitacao = 25;
    }
    static {
      this.pausaEntreMensagens = 180;
    }
    // Adiciona uma mensagem na fila do log.
    static adicionarMensagem(mensagem) {
      _GerenciadorLog.prepararAtalhos();
      _GerenciadorLog.fila.push(mensagem);
      if (!_GerenciadorLog.escrevendo) {
        _GerenciadorLog.escreverProximaMensagem();
      }
    }
    // Limpa o log e para qualquer texto que ainda esteja sendo digitado.
    static limpar() {
      if (_GerenciadorLog.tempo !== void 0) {
        window.clearTimeout(_GerenciadorLog.tempo);
      }
      _GerenciadorLog.fila = [];
      _GerenciadorLog.escrevendo = false;
      _GerenciadorLog.textoAtual = "";
      _GerenciadorLog.indiceTexto = 0;
      _GerenciadorLog.elementoTexto = null;
      _GerenciadorLog.elementoCursor = null;
      const consoleBatalha = document.getElementById("console");
      if (consoleBatalha !== null) {
        consoleBatalha.innerHTML = "";
      }
    }
    // Permite pular a animacao clicando no log ou apertando espaco.
    static prepararAtalhos() {
      if (_GerenciadorLog.atalhosAtivados) {
        return;
      }
      const consoleBatalha = document.getElementById("console");
      consoleBatalha?.addEventListener("click", () => _GerenciadorLog.pularAnimacao());
      document.addEventListener("keydown", (evento) => {
        if (evento.code === "Space" && _GerenciadorLog.escrevendo) {
          evento.preventDefault();
          _GerenciadorLog.pularAnimacao();
        }
      });
      _GerenciadorLog.atalhosAtivados = true;
    }
    // Pega a proxima mensagem da fila e prepara o paragrafo no HTML.
    static escreverProximaMensagem() {
      const proximaMensagem = _GerenciadorLog.fila.shift();
      if (proximaMensagem === void 0) {
        _GerenciadorLog.escrevendo = false;
        return;
      }
      const consoleBatalha = document.getElementById("console");
      if (consoleBatalha === null) {
        _GerenciadorLog.escrevendo = false;
        return;
      }
      const paragrafo = document.createElement("p");
      const texto = document.createElement("span");
      const cursor = document.createElement("span");
      cursor.className = "cursorLog";
      cursor.textContent = "|";
      paragrafo.appendChild(texto);
      paragrafo.appendChild(cursor);
      consoleBatalha.appendChild(paragrafo);
      _GerenciadorLog.escrevendo = true;
      _GerenciadorLog.textoAtual = proximaMensagem;
      _GerenciadorLog.indiceTexto = 0;
      _GerenciadorLog.elementoTexto = texto;
      _GerenciadorLog.elementoCursor = cursor;
      _GerenciadorLog.digitarMensagem();
    }
    // Escreve a mensagem atual letra por letra.
    static digitarMensagem() {
      if (_GerenciadorLog.elementoTexto === null) {
        return;
      }
      if (_GerenciadorLog.indiceTexto < _GerenciadorLog.textoAtual.length) {
        _GerenciadorLog.elementoTexto.textContent += _GerenciadorLog.textoAtual.charAt(_GerenciadorLog.indiceTexto);
        _GerenciadorLog.indiceTexto++;
        _GerenciadorLog.rolarParaBaixo();
        _GerenciadorLog.tempo = window.setTimeout(
          () => _GerenciadorLog.digitarMensagem(),
          _GerenciadorLog.velocidadeDigitacao
        );
        return;
      }
      _GerenciadorLog.finalizarMensagem();
    }
    // Termina uma mensagem e chama a proxima depois de uma pausa.
    static finalizarMensagem() {
      _GerenciadorLog.elementoCursor?.remove();
      _GerenciadorLog.elementoTexto = null;
      _GerenciadorLog.elementoCursor = null;
      _GerenciadorLog.textoAtual = "";
      _GerenciadorLog.indiceTexto = 0;
      _GerenciadorLog.rolarParaBaixo();
      _GerenciadorLog.tempo = window.setTimeout(
        () => _GerenciadorLog.escreverProximaMensagem(),
        _GerenciadorLog.pausaEntreMensagens
      );
    }
    // Completa a mensagem atual de uma vez.
    static pularAnimacao() {
      if (!_GerenciadorLog.escrevendo || _GerenciadorLog.elementoTexto === null) {
        return;
      }
      if (_GerenciadorLog.tempo !== void 0) {
        window.clearTimeout(_GerenciadorLog.tempo);
      }
      _GerenciadorLog.elementoTexto.textContent = _GerenciadorLog.textoAtual;
      _GerenciadorLog.finalizarMensagem();
    }
    // Mantem a caixa do log sempre mostrando a ultima mensagem.
    static rolarParaBaixo() {
      const consoleBatalha = document.getElementById("console");
      if (consoleBatalha !== null) {
        consoleBatalha.scrollTop = consoleBatalha.scrollHeight;
      }
    }
  };

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
      // Efeitos temporarios causados por eventos aleatorios.
      this.defesaEventoExtra = 0;
      this.defesaEventoTurnos = 0;
      this.bonusAtaque = 0;
      this.bonusAtaqueTurnos = 0;
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
        GerenciadorLog.adicionarMensagem(`${this.nome} bloqueou ${danoBruto - danoFinal} de dano com a defesa.`);
      }
      GerenciadorLog.adicionarMensagem(
        `${this.nome} recebeu ${danoFinal} de dano. vida atual: ${this.vida}`
      );
    }
    gerarAtaque() {
      return Math.floor(Math.random() * 3);
    }
    // Aplica bonus temporario de ataque, se existir.
    calcularDano(danoBase) {
      return danoBase * (1 + this.bonusAtaque);
    }
    aplicarBuffPeriodo(dano, tipoAtaque, periodoAtual) {
      if (tipoAtaque === "neutro") {
        return dano;
      }
      if (tipoAtaque === periodoAtual) {
        GerenciadorLog.adicionarMensagem("O ataque recebeu buff por causa do periodo atual!");
        return dano * 1.2;
      }
      GerenciadorLog.adicionarMensagem("O ataque recebeu debuff por causa do periodo atual!");
      return dano * 0.8;
    }
    defender() {
      if (!this.isContinuaVivo()) {
        return;
      }
      this.defesaExtra = this.valorDefesaExtra;
      GerenciadorLog.adicionarMensagem(`${this.nome} se defendeu! Defesa aumentada no proximo turno do oponente.`);
    }
    finalizarDefesa() {
      if (this.defesaExtra > 0) {
        this.defesaExtra = 0;
        GerenciadorLog.adicionarMensagem(`${this.nome} baixou a defesa.`);
      }
    }
    curar() {
      if (!this.isContinuaVivo()) {
        return;
      }
      if (this.vida >= this.vidaMaxima) {
        GerenciadorLog.adicionarMensagem(`${this.nome} ja esta com a vida cheia.`);
        return;
      }
      this.vida += this.vidaMaxima * 0.25;
      if (this.vida > this.vidaMaxima) {
        this.vida = this.vidaMaxima;
      }
      GerenciadorLog.adicionarMensagem(`${this.nome} recuperou vida! Vida atual: ${this.vida}`);
    }
    recuperarVida(percentual) {
      if (!this.isContinuaVivo()) {
        return;
      }
      const cura = this.vidaMaxima * percentual;
      this.vida = Math.min(this.vidaMaxima, this.vida + cura);
      GerenciadorLog.adicionarMensagem(`${this.nome} recuperou vida! Vida atual: ${this.vida}`);
    }
    // Reduz a defesa por alguns turnos, usado pelo evento de terremoto.
    reduzirDefesaTemporaria(valor, turnos) {
      if (!this.isContinuaVivo()) {
        return;
      }
      this.defesaEventoExtra = -valor;
      this.defesaEventoTurnos = turnos;
    }
    // Aumenta o dano por alguns turnos, usado pelo evento de inimigo enfurecido.
    adicionarBonusAtaqueTemporario(valor, turnos) {
      if (!this.isContinuaVivo()) {
        return;
      }
      this.bonusAtaque = valor;
      this.bonusAtaqueTurnos = turnos;
    }
    // Reduz a duracao dos efeitos temporarios a cada turno.
    atualizarEfeitosTemporarios() {
      if (this.defesaEventoTurnos > 0) {
        this.defesaEventoTurnos--;
        if (this.defesaEventoTurnos === 0) {
          this.defesaEventoExtra = 0;
          GerenciadorLog.adicionarMensagem(`${this.nome} recuperou o equilibrio.`);
        }
      }
      if (this.bonusAtaqueTurnos > 0) {
        this.bonusAtaqueTurnos--;
        if (this.bonusAtaqueTurnos === 0) {
          this.bonusAtaque = 0;
          GerenciadorLog.adicionarMensagem(`${this.nome} nao esta mais enfurecido.`);
        }
      }
    }
    getVida() {
      return this.vida;
    }
    getVidaMaxima() {
      return this.vidaMaxima;
    }
    getDefesaTotal() {
      return Math.min(0.9, Math.max(0, this.defesa + this.defesaExtra + this.defesaEventoExtra));
    }
    estaEnfurecido() {
      return this.bonusAtaqueTurnos > 0;
    }
    getImg() {
      return this.imagem;
    }
  };

  // src/Guerreiro.ts
  var Guerreiro = class extends Personagem {
    constructor(nome, poder_de_ataque, vida) {
      super(nome, poder_de_ataque, vida, "./src/imagem2.png");
      this.defesa = 0.12;
    }
    // O guerreiro sorteia um ataque e aplica dano no adversario.
    atacar(adversario, periodoAtual) {
      const tipoAtaque = this.gerarAtaque();
      let dano = 0;
      let periodoFavoravel = "neutro";
      if (tipoAtaque === 0) {
        dano = this.poder_de_ataque * 0.9;
        periodoFavoravel = "dia";
        GerenciadorLog.adicionarMensagem(`${this.nome} usou Corte Rapido.`);
      } else if (tipoAtaque === 1) {
        dano = this.poder_de_ataque * 1.35;
        periodoFavoravel = "neutro";
        GerenciadorLog.adicionarMensagem(`${this.nome} usou Golpe Pesado.`);
      } else {
        dano = this.poder_de_ataque * 1.1;
        periodoFavoravel = "dia";
        GerenciadorLog.adicionarMensagem(`${this.nome} usou Investida.`);
      }
      dano = this.aplicarBuffPeriodo(dano, periodoFavoravel, periodoAtual);
      adversario.sofreu_dano(this.calcularDano(dano));
    }
  };

  // src/mago.ts
  var Mago = class extends Personagem {
    constructor(nome, poder_de_ataque, vida) {
      super(nome, poder_de_ataque, vida, "./src/imagem1.png");
      this.defesa = 0.06;
    }
    // O mago sorteia uma magia e aplica dano no adversario.
    atacar(adversario, periodoAtual) {
      const tipoAtaque = this.gerarAtaque();
      let dano = 0;
      let periodoFavoravel = "neutro";
      if (tipoAtaque === 0) {
        dano = this.poder_de_ataque * 0.9;
        periodoFavoravel = "noite";
        GerenciadorLog.adicionarMensagem(`${this.nome} usou Faisca Arcana.`);
      } else if (tipoAtaque === 1) {
        dano = this.poder_de_ataque * 1.35;
        periodoFavoravel = "dia";
        GerenciadorLog.adicionarMensagem(`${this.nome} usou Bola de Fogo.`);
      } else {
        dano = this.poder_de_ataque * 1.1;
        periodoFavoravel = "noite";
        GerenciadorLog.adicionarMensagem(`${this.nome} usou Sombra Mistica.`);
      }
      dano = this.aplicarBuffPeriodo(dano, periodoFavoravel, periodoAtual);
      adversario.sofreu_dano(this.calcularDano(dano));
    }
  };

  // src/Jogo.ts
  var Jogo = class {
    constructor() {
      this.turnoAtual = "";
      this.acabou = false;
      // Controle dos eventos aleatorios.
      this.turnosPassados = 0;
      this.proximoEventoTurno = 0;
      this.arenaAtual = "normal";
      this.tempestadeEletricaTurnos = 0;
      // Controle do periodo do dia.
      this.periodoAtual = "dia";
    }
    // Comeca uma nova batalha com dois personagens.
    iniciar(player1, player2) {
      this.jogadorUm = player1;
      this.jogadorDois = player2;
      this.turnoAtual = this.jogadorUm.nome;
      this.acabou = false;
      this.turnosPassados = 0;
      this.proximoEventoTurno = this.sortearIntervaloEvento();
      this.arenaAtual = "normal";
      this.tempestadeEletricaTurnos = 0;
      this.periodoAtual = "dia";
      this.limparConsole();
      this.ativarBotoes(true);
      this.atualizarTela();
      this.mostrarTurno();
      GerenciadorLog.adicionarMensagem("A batalha comecou durante o dia.");
    }
    // Evita jogadas antes de iniciar ou depois do fim da batalha.
    podeJogar() {
      if (this.jogadorUm === void 0 || this.jogadorDois === void 0) {
        GerenciadorLog.adicionarMensagem("Clique em Batalhar primeiro!");
        return false;
      }
      if (this.acabou) {
        GerenciadorLog.adicionarMensagem("A batalha ja terminou. Clique em Batalhar para jogar de novo.");
        return false;
      }
      return true;
    }
    getJogadorAtual() {
      if (this.turnoAtual === this.jogadorUm.nome) {
        return this.jogadorUm;
      }
      return this.jogadorDois;
    }
    Atacar() {
      if (!this.podeJogar()) {
        return;
      }
      GerenciadorLog.adicionarMensagem(this.turnoAtual + " atacou!");
      if (this.turnoAtual === this.jogadorUm.nome) {
        this.jogadorUm.atacar(this.jogadorDois, this.periodoAtual);
      } else {
        this.jogadorDois.atacar(this.jogadorUm, this.periodoAtual);
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
      this.turnosPassados++;
      this.verificarMudancaPeriodo();
      this.atualizarEfeitosTemporarios();
      this.verificarEventoAleatorio();
      proximoJogador.finalizarDefesa();
      this.atualizarTela();
      this.mostrarTurno();
      this.animarTransicaoTurno();
    }
    calcularVida(jogador) {
      return Math.max(0, jogador.getVida() / jogador.getVidaMaxima() * 100);
    }
    calcularDefesa(jogador) {
      return jogador.getDefesaTotal() * 100;
    }
    // Atualiza nomes, imagens, barras e classes visuais no HTML.
    atualizarTela() {
      const imgUm = document.getElementById("imgJogadorUm");
      const imgDois = document.getElementById("imgJogadorDois");
      const barraUm = document.getElementById("barraVida");
      const barraDois = document.getElementById("barraVidaDois");
      const barraDefesaUm = document.getElementById("barraDefesaUm");
      const barraDefesaDois = document.getElementById("barraDefesaDois");
      const cardUm = document.getElementById("cardJogadorUm");
      const cardDois = document.getElementById("cardJogadorDois");
      const arena = document.querySelector(".arena");
      const textoPeriodo = document.getElementById("periodoAtual");
      imgUm.src = this.jogadorUm.getImg();
      imgDois.src = this.jogadorDois.getImg();
      document.getElementById("NomeUm").textContent = this.jogadorUm.nome;
      document.getElementById("NomeDois").textContent = this.jogadorDois.nome;
      document.getElementById("JogadorUmVida").textContent = "HP: " + this.jogadorUm.getVida();
      document.getElementById("JogadorDoisVida").textContent = "HP: " + this.jogadorDois.getVida();
      textoPeriodo.textContent = "Periodo atual: " + this.getPeriodoFormatado();
      barraUm.style.width = this.calcularVida(this.jogadorUm) + "%";
      barraDois.style.width = this.calcularVida(this.jogadorDois) + "%";
      barraDefesaUm.style.width = this.calcularDefesa(this.jogadorUm) + "%";
      barraDefesaDois.style.width = this.calcularDefesa(this.jogadorDois) + "%";
      cardUm.classList.toggle("morto", !this.jogadorUm.isContinuaVivo());
      cardDois.classList.toggle("morto", !this.jogadorDois.isContinuaVivo());
      cardUm.classList.toggle("inimigo-enfurecido", this.jogadorUm.estaEnfurecido());
      cardDois.classList.toggle("inimigo-enfurecido", this.jogadorDois.estaEnfurecido());
      this.atualizarVisualArena(arena);
      this.atualizarVisualPeriodo();
    }
    getPeriodoFormatado() {
      if (this.periodoAtual === "dia") {
        return "Dia";
      }
      return "Noite";
    }
    // Aplica a classe certa para o ambiente atual da arena.
    atualizarVisualArena(arena) {
      const classesArena = [
        "arena-fogo",
        "arena-chuva",
        "arena-tempestade",
        "arena-normal",
        "arena-tempestade-eletrica"
      ];
      arena.classList.remove(...classesArena);
      switch (this.arenaAtual) {
        case "fogo":
          arena.classList.add("arena-fogo");
          break;
        case "chuva":
          arena.classList.add("arena-chuva");
          break;
        case "tempestade":
          arena.classList.add("arena-tempestade");
          break;
        case "tempestade eletrica":
          arena.classList.add("arena-tempestade-eletrica");
          break;
        default:
          arena.classList.add("arena-normal");
          break;
      }
    }
    atualizarVisualPeriodo() {
      document.body.classList.remove("modo-dia", "modo-noite");
      if (this.periodoAtual === "dia") {
        document.body.classList.add("modo-dia");
      } else {
        document.body.classList.add("modo-noite");
      }
    }
    animarTransicaoTurno() {
      const pagina = document.querySelector(".pagina");
      if (pagina === null) {
        return;
      }
      pagina.classList.remove("transicao-turno");
      void pagina.offsetWidth;
      pagina.classList.add("transicao-turno");
      window.setTimeout(() => {
        pagina.classList.remove("transicao-turno");
      }, 1100);
    }
    // Mostra no topo e no log de quem e a vez.
    mostrarTurno() {
      document.getElementById("turnoAtual").textContent = "Turno atual: " + this.turnoAtual;
      GerenciadorLog.adicionarMensagem("Agora e a vez do " + this.turnoAtual + " jogar!");
      GerenciadorLog.adicionarMensagem("Periodo atual: " + this.getPeriodoFormatado() + ".");
    }
    // Liga ou desliga os botoes de acao.
    ativarBotoes(ativo) {
      const botoes = ["btnAtacar", "btnDefender", "btnCurar", "btnPassarTurno"];
      botoes.forEach((id) => {
        const botao = document.getElementById(id);
        botao.disabled = !ativo;
      });
    }
    // Limpa o log quando uma nova batalha comeca.
    limparConsole() {
      GerenciadorLog.limpar();
    }
    getOponenteAtual() {
      if (this.turnoAtual === this.jogadorUm.nome) {
        return this.jogadorDois;
      }
      return this.jogadorUm;
    }
    verificarMudancaPeriodo() {
      if (this.turnosPassados % 3 !== 0) {
        return;
      }
      if (this.periodoAtual === "dia") {
        this.periodoAtual = "noite";
        GerenciadorLog.adicionarMensagem("Anoiteceu! O periodo atual agora e Noite.");
      } else {
        this.periodoAtual = "dia";
        GerenciadorLog.adicionarMensagem("Amanheceu! O periodo atual agora e Dia.");
      }
    }
    // Sorteia se o proximo evento vai acontecer daqui 2 ou 3 turnos.
    sortearIntervaloEvento() {
      return Math.floor(Math.random() * 2) + 2;
    }
    // Verifica no fim de cada turno se chegou a hora de um evento inesperado.
    verificarEventoAleatorio() {
      if (this.turnosPassados < this.proximoEventoTurno) {
        return;
      }
      this.sortearEventoAleatorio();
      this.proximoEventoTurno = this.turnosPassados + this.sortearIntervaloEvento();
    }
    // Sorteia qual evento aleatorio vai acontecer.
    sortearEventoAleatorio() {
      const numeroEventoAleatorio = Math.floor(Math.random() * 6);
      switch (numeroEventoAleatorio) {
        case 0:
          this.eventoTerremoto();
          break;
        case 1:
          this.eventoPocaoMisteriosa();
          break;
        case 2:
          this.eventoMudancaDeArena();
          break;
        case 3:
          this.eventoInimigoEnfurecido();
          break;
        case 4:
          this.eventoEnergiaExtra();
          break;
        default:
          this.eventoTempestadeEletrica();
          break;
      }
    }
    // Descobre qual card HTML pertence a um personagem.
    getCardPersonagem(personagem) {
      if (personagem === this.jogadorUm) {
        return document.getElementById("cardJogadorUm");
      }
      if (personagem === this.jogadorDois) {
        return document.getElementById("cardJogadorDois");
      }
      return null;
    }
    // Aplica efeitos visuais rapidos, como tremor e brilho de cura.
    aplicarEfeitoVisualEvento(classe, personagem) {
      const elemento = personagem === void 0 ? document.querySelector(".arena") : this.getCardPersonagem(personagem);
      if (elemento === null) {
        return;
      }
      if (classe === "inimigo-enfurecido") {
        elemento.classList.add(classe);
        return;
      }
      elemento.classList.remove(classe);
      void elemento.offsetWidth;
      elemento.classList.add(classe);
      window.setTimeout(() => {
        elemento.classList.remove(classe);
      }, 800);
    }
    // Evento: diminui um pouco a defesa dos dois por alguns turnos.
    eventoTerremoto() {
      this.jogadorUm.reduzirDefesaTemporaria(0.08, 2);
      this.jogadorDois.reduzirDefesaTemporaria(0.08, 2);
      this.aplicarEfeitoVisualEvento("evento-terremoto");
      GerenciadorLog.adicionarMensagem("O chao tremeu violentamente! Todos perderam equilibrio.");
    }
    // Evento: cura quem vai jogar agora.
    eventoPocaoMisteriosa() {
      const jogadorCurado = this.getJogadorAtual();
      jogadorCurado.recuperarVida(0.15);
      this.aplicarEfeitoVisualEvento("evento-pocao", jogadorCurado);
      GerenciadorLog.adicionarMensagem("Uma pocao misteriosa apareceu! O jogador recuperou um pouco de vida.");
    }
    // Evento: muda a aparencia da arena.
    eventoMudancaDeArena() {
      const arenas = ["fogo", "chuva", "tempestade", "normal"];
      const arenaSorteada = arenas[Math.floor(Math.random() * arenas.length)];
      this.arenaAtual = arenaSorteada;
      this.atualizarTela();
      GerenciadorLog.adicionarMensagem("A arena mudou! O ambiente da batalha ficou diferente.");
      GerenciadorLog.adicionarMensagem("Arena atual: " + this.arenaAtual + ".");
    }
    // Evento: deixa o oponente mais forte por alguns turnos.
    eventoInimigoEnfurecido() {
      const inimigo = this.getOponenteAtual();
      inimigo.adicionarBonusAtaqueTemporario(0.15, 3);
      this.aplicarEfeitoVisualEvento("inimigo-enfurecido", inimigo);
      GerenciadorLog.adicionarMensagem("O inimigo ficou enfurecido e causara mais dano por alguns turnos.");
    }
    // Evento: apenas mostra uma onda visual e mensagem no log.
    eventoEnergiaExtra() {
      this.aplicarEfeitoVisualEvento("evento-energia-extra");
      GerenciadorLog.adicionarMensagem("Uma onda de energia tomou conta da arena!");
    }
    // Evento: deixa a arena em clima de tempestade por alguns turnos.
    eventoTempestadeEletrica() {
      this.arenaAtual = "tempestade eletrica";
      this.tempestadeEletricaTurnos = 3;
      this.atualizarTela();
      GerenciadorLog.adicionarMensagem("Uma tempestade eletrica comecou! Ataques eletricos ficaram mais fortes.");
    }
    // Reduz a duracao dos efeitos que acabam sozinhos.
    atualizarEfeitosTemporarios() {
      this.jogadorUm.atualizarEfeitosTemporarios();
      this.jogadorDois.atualizarEfeitosTemporarios();
      if (this.tempestadeEletricaTurnos > 0) {
        this.tempestadeEletricaTurnos--;
        if (this.tempestadeEletricaTurnos === 0 && this.arenaAtual === "tempestade eletrica") {
          this.arenaAtual = "normal";
          this.atualizarTela();
          GerenciadorLog.adicionarMensagem("A tempestade eletrica acabou. A arena voltou ao normal.");
        }
      }
    }
    // Encerra a partida e mostra quem venceu.
    finalizarJogo() {
      this.acabou = true;
      this.ativarBotoes(false);
      document.getElementById("turnoAtual").textContent = "Fim de jogo";
      if (this.jogadorUm.isContinuaVivo()) {
        GerenciadorLog.adicionarMensagem(this.jogadorUm.nome + " ganhou a luta!");
      } else if (this.jogadorDois.isContinuaVivo()) {
        GerenciadorLog.adicionarMensagem(this.jogadorDois.nome + " ganhou a luta!");
      } else {
        GerenciadorLog.adicionarMensagem("A luta terminou em empate!");
      }
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
