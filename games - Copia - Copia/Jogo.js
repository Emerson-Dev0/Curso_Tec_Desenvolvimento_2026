"use strict";
(() => {
  // src/Personagem.ts
  var Personagem = class _Personagem {
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
    static {
      // Configuracoes do log com efeito de digitacao.
      this.filaLog = [];
    }
    static {
      this.escrevendoLog = false;
    }
    static {
      this.textoAtualLog = "";
    }
    static {
      this.indiceTextoLog = 0;
    }
    static {
      this.elementoTextoLog = null;
    }
    static {
      this.elementoCursorLog = null;
    }
    static {
      this.atalhosLogAtivados = false;
    }
    static {
      // Diminua esse numero para o texto aparecer mais rapido.
      this.velocidadeDigitacaoLog = 25;
    }
    static {
      this.pausaEntreMensagensLog = 180;
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
    // Aplica bonus temporario de ataque, se existir.
    calcularDano(danoBase) {
      return danoBase * (1 + this.bonusAtaque);
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
    recuperarVida(percentual) {
      if (!this.isContinuaVivo()) {
        return;
      }
      const cura = this.vidaMaxima * percentual;
      this.vida = Math.min(this.vidaMaxima, this.vida + cura);
      this.log(`${this.nome} recuperou vida! Vida atual: ${this.vida}`);
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
          this.log(`${this.nome} recuperou o equilibrio.`);
        }
      }
      if (this.bonusAtaqueTurnos > 0) {
        this.bonusAtaqueTurnos--;
        if (this.bonusAtaqueTurnos === 0) {
          this.bonusAtaque = 0;
          this.log(`${this.nome} nao esta mais enfurecido.`);
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
    log(mensagem) {
      _Personagem.adicionarMensagemLog(mensagem);
    }
    // Adiciona uma mensagem na fila do log.
    static adicionarMensagemLog(mensagem) {
      _Personagem.prepararAtalhosLog();
      _Personagem.filaLog.push(mensagem);
      if (!_Personagem.escrevendoLog) {
        _Personagem.escreverProximaMensagemLog();
      }
    }
    // Limpa o log e para qualquer texto que ainda esteja sendo digitado.
    static limparLog() {
      if (_Personagem.tempoLog !== void 0) {
        window.clearTimeout(_Personagem.tempoLog);
      }
      _Personagem.filaLog = [];
      _Personagem.escrevendoLog = false;
      _Personagem.textoAtualLog = "";
      _Personagem.indiceTextoLog = 0;
      _Personagem.elementoTextoLog = null;
      _Personagem.elementoCursorLog = null;
      const consoleBatalha = document.getElementById("console");
      if (consoleBatalha !== null) {
        consoleBatalha.innerHTML = "";
      }
    }
    // Permite pular a animacao clicando no log ou apertando espaco.
    static prepararAtalhosLog() {
      if (_Personagem.atalhosLogAtivados) {
        return;
      }
      const consoleBatalha = document.getElementById("console");
      consoleBatalha?.addEventListener("click", () => _Personagem.pularAnimacaoLog());
      document.addEventListener("keydown", (evento) => {
        if (evento.code === "Space" && _Personagem.escrevendoLog) {
          evento.preventDefault();
          _Personagem.pularAnimacaoLog();
        }
      });
      _Personagem.atalhosLogAtivados = true;
    }
    // Pega a proxima mensagem da fila e prepara o paragrafo no HTML.
    static escreverProximaMensagemLog() {
      const proximaMensagem = _Personagem.filaLog.shift();
      if (proximaMensagem === void 0) {
        _Personagem.escrevendoLog = false;
        return;
      }
      const consoleBatalha = document.getElementById("console");
      if (consoleBatalha === null) {
        _Personagem.escrevendoLog = false;
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
      _Personagem.escrevendoLog = true;
      _Personagem.textoAtualLog = proximaMensagem;
      _Personagem.indiceTextoLog = 0;
      _Personagem.elementoTextoLog = texto;
      _Personagem.elementoCursorLog = cursor;
      _Personagem.digitarMensagemLog();
    }
    // Escreve a mensagem atual letra por letra.
    static digitarMensagemLog() {
      if (_Personagem.elementoTextoLog === null) {
        return;
      }
      if (_Personagem.indiceTextoLog < _Personagem.textoAtualLog.length) {
        _Personagem.elementoTextoLog.textContent += _Personagem.textoAtualLog.charAt(_Personagem.indiceTextoLog);
        _Personagem.indiceTextoLog++;
        _Personagem.rolarLogParaBaixo();
        _Personagem.tempoLog = window.setTimeout(
          () => _Personagem.digitarMensagemLog(),
          _Personagem.velocidadeDigitacaoLog
        );
        return;
      }
      _Personagem.finalizarMensagemLog();
    }
    // Termina uma mensagem e chama a proxima depois de uma pausa.
    static finalizarMensagemLog() {
      _Personagem.elementoCursorLog?.remove();
      _Personagem.elementoTextoLog = null;
      _Personagem.elementoCursorLog = null;
      _Personagem.textoAtualLog = "";
      _Personagem.indiceTextoLog = 0;
      _Personagem.rolarLogParaBaixo();
      _Personagem.tempoLog = window.setTimeout(
        () => _Personagem.escreverProximaMensagemLog(),
        _Personagem.pausaEntreMensagensLog
      );
    }
    // Completa a mensagem atual de uma vez.
    static pularAnimacaoLog() {
      if (!_Personagem.escrevendoLog || _Personagem.elementoTextoLog === null) {
        return;
      }
      if (_Personagem.tempoLog !== void 0) {
        window.clearTimeout(_Personagem.tempoLog);
      }
      _Personagem.elementoTextoLog.textContent = _Personagem.textoAtualLog;
      _Personagem.finalizarMensagemLog();
    }
    // Mantem a caixa do log sempre mostrando a ultima mensagem.
    static rolarLogParaBaixo() {
      const consoleBatalha = document.getElementById("console");
      if (consoleBatalha !== null) {
        consoleBatalha.scrollTop = consoleBatalha.scrollHeight;
      }
    }
  };

  // src/Guerreiro.ts
  var Guerreiro = class extends Personagem {
    constructor(nome, poder_de_ataque, vida) {
      super(nome, poder_de_ataque, vida, "./src/imagem2.png");
      this.defesa = 0.12;
    }
    // O guerreiro sorteia um dos ataques e aplica dano no adversário.
    atacar(adversario) {
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
      adversario.sofreu_dano(this.calcularDano(dano));
    }
  };

  // src/mago.ts
  var Mago = class extends Personagem {
    constructor(nome, poder_de_ataque, vida) {
      super(nome, poder_de_ataque, vida, "./src/imagem1.png");
      this.defesa = 0.06;
    }
    // O mago sorteia uma magia e causa dano de acordo com o ataque escolhido.
    atacar(adversario) {
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
      this.turnosPassados++;
      this.atualizarEfeitosTemporarios();
      this.verificarEventoAleatorio();
      proximoJogador.finalizarDefesa();
      this.atualizarTela();
      this.mostrarTurno();
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
      cardUm.classList.toggle("inimigo-enfurecido", this.jogadorUm.estaEnfurecido());
      cardDois.classList.toggle("inimigo-enfurecido", this.jogadorDois.estaEnfurecido());
      this.atualizarVisualArena(arena);
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
    getOponenteAtual() {
      if (this.turnoAtual === this.jogadorUm.nome) {
        return this.jogadorDois;
      }
      return this.jogadorUm;
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
      if (numeroEventoAleatorio === 0) {
        this.eventoTerremoto();
      } else if (numeroEventoAleatorio === 1) {
        this.eventoPocaoMisteriosa();
      } else if (numeroEventoAleatorio === 2) {
        this.eventoMudancaDeArena();
      } else if (numeroEventoAleatorio === 3) {
        this.eventoInimigoEnfurecido();
      } else if (numeroEventoAleatorio === 4) {
        this.eventoEnergiaExtra();
      } else {
        this.eventoTempestadeEletrica();
      }
    }
    // Evento: diminui um pouco a defesa dos dois por alguns turnos.
    eventoTerremoto() {
      this.jogadorUm.reduzirDefesaTemporaria(0.08, 2);
      this.jogadorDois.reduzirDefesaTemporaria(0.08, 2);
      this.aplicarEfeitoVisualEvento("evento-terremoto");
      this.log("O ch\xE3o tremeu violentamente! Todos perderam equil\xEDbrio.");
    }
    // Evento: cura quem vai jogar agora.
    eventoPocaoMisteriosa() {
      const jogadorCurado = this.getJogadorAtual();
      jogadorCurado.recuperarVida(0.15);
      this.aplicarEfeitoVisualEvento("evento-pocao", jogadorCurado);
      this.log("Uma po\xE7\xE3o misteriosa apareceu! O jogador recuperou um pouco de vida.");
    }
    // Evento: muda a aparencia da arena.
    eventoMudancaDeArena() {
      const arenas = ["fogo", "chuva", "tempestade", "normal"];
      const arenaSorteada = arenas[Math.floor(Math.random() * arenas.length)];
      this.arenaAtual = arenaSorteada;
      this.atualizarTela();
      this.log("A arena mudou! O ambiente da batalha ficou diferente.");
      this.log("Arena atual: " + this.arenaAtual + ".");
    }
    // Evento: deixa o oponente mais forte por alguns turnos.
    eventoInimigoEnfurecido() {
      const inimigo = this.getOponenteAtual();
      inimigo.adicionarBonusAtaqueTemporario(0.15, 3);
      this.aplicarEfeitoVisualEvento("inimigo-enfurecido", inimigo);
      this.log("O inimigo ficou enfurecido e causar\xE1 mais dano por alguns turnos.");
    }
    // Evento: apenas mostra uma onda visual e mensagem no log.
    eventoEnergiaExtra() {
      this.aplicarEfeitoVisualEvento("evento-energia-extra");
      this.log("Uma onda de energia tomou conta da arena!");
    }
    // Evento: deixa a arena em clima de tempestade por alguns turnos.
    eventoTempestadeEletrica() {
      this.arenaAtual = "tempestade eletrica";
      this.tempestadeEletricaTurnos = 3;
      this.atualizarTela();
      this.log("Uma tempestade el\xE9trica come\xE7ou! Ataques el\xE9tricos ficaram mais fortes.");
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
          this.log("A tempestade el\xE9trica acabou. A arena voltou ao normal.");
        }
      }
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
      if (this.arenaAtual === "fogo") {
        arena.classList.add("arena-fogo");
      } else if (this.arenaAtual === "chuva") {
        arena.classList.add("arena-chuva");
      } else if (this.arenaAtual === "tempestade") {
        arena.classList.add("arena-tempestade");
      } else if (this.arenaAtual === "tempestade eletrica") {
        arena.classList.add("arena-tempestade-eletrica");
      } else {
        arena.classList.add("arena-normal");
      }
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
    // Encerra a partida e mostra quem venceu.
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
    // Evita jogadas antes de iniciar ou depois do fim da batalha.
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
    // Mostra no topo e no log de quem e a vez.
    mostrarTurno() {
      document.getElementById("turnoAtual").textContent = "Turno atual: " + this.turnoAtual;
      this.log("Agora \xE9 a vez do " + this.turnoAtual + " jogar!");
    }
    // Liga ou desliga os botoes de acao.
    ativarBotoes(ativo) {
      const botoes = ["btnAtacar", "btnDefender", "btnCurar", "btnPassarTurno"];
      botoes.forEach((id) => {
        const botao = document.getElementById(id);
        botao.disabled = !ativo;
      });
    }
    // Envia mensagens para o log com efeito de digitacao.
    log(mensagem) {
      Personagem.adicionarMensagemLog(mensagem);
    }
    // Limpa o log quando uma nova batalha comeca.
    limparConsole() {
      Personagem.limparLog();
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
