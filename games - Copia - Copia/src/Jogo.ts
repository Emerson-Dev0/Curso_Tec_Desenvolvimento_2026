import { Guerreiro } from "./Guerreiro";
import { Mago } from "./mago";
import { Personagem } from "./Personagem";

export class Jogo {
  // Personagens e estado principal da partida.
  private jogadorUm!: Personagem;
  private jogadorDois!: Personagem;
  private turnoAtual: string = "";
  private acabou: boolean = false;

  // Controle dos eventos aleatorios.
  private turnosPassados: number = 0;
  private proximoEventoTurno: number = 0;
  private arenaAtual: string = "normal";
  private tempestadeEletricaTurnos: number = 0;

  // Comeca uma nova batalha com dois personagens.
  public iniciar(player1: Personagem, player2: Personagem): void {
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
    this.log("A batalha começou!");
  }

  public Atacar(): void {
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

  public Defender(): void {
    if (!this.podeJogar()) {
      return;
    }

    this.getJogadorAtual().defender();
    this.atualizarTela();
    this.passarTurno();
  }

  public Curar(): void {
    if (!this.podeJogar()) {
      return;
    }

    this.getJogadorAtual().curar();
    this.atualizarTela();
    this.passarTurno();
  }

  public passarTurno(): void {
    if (!this.podeJogar()) {
      return;
    }

    let proximoJogador: Personagem;

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
  private atualizarTela(): void {
    const imgUm = document.getElementById("imgJogadorUm") as HTMLImageElement;
    const imgDois = document.getElementById("imgJogadorDois") as HTMLImageElement;
    const barraUm = document.getElementById("barraVida") as HTMLElement;
    const barraDois = document.getElementById("barraVidaDois") as HTMLElement;
    const barraDefesaUm = document.getElementById("barraDefesaUm") as HTMLElement;
    const barraDefesaDois = document.getElementById("barraDefesaDois") as HTMLElement;
    const cardUm = document.getElementById("cardJogadorUm") as HTMLElement;
    const cardDois = document.getElementById("cardJogadorDois") as HTMLElement;
    const arena = document.querySelector(".arena") as HTMLElement;

    imgUm.src = this.jogadorUm.getImg();
    imgDois.src = this.jogadorDois.getImg();

    document.getElementById("NomeUm")!.textContent = this.jogadorUm.nome;
    document.getElementById("NomeDois")!.textContent = this.jogadorDois.nome;
    document.getElementById("JogadorUmVida")!.textContent = "HP: " + this.jogadorUm.getVida();
    document.getElementById("JogadorDoisVida")!.textContent = "HP: " + this.jogadorDois.getVida();

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

  private calcularVida(jogador: Personagem): number {
    return Math.max(0, (jogador.getVida() / jogador.getVidaMaxima()) * 100);
  }

  private calcularDefesa(jogador: Personagem): number {
    return jogador.getDefesaTotal() * 100;
  }

  private getJogadorAtual(): Personagem {
    if (this.turnoAtual === this.jogadorUm.nome) {
      return this.jogadorUm;
    }

    return this.jogadorDois;
  }

  private getOponenteAtual(): Personagem {
    if (this.turnoAtual === this.jogadorUm.nome) {
      return this.jogadorDois;
    }

    return this.jogadorUm;
  }

  // Sorteia se o proximo evento vai acontecer daqui 2 ou 3 turnos.
  private sortearIntervaloEvento(): number {
    return Math.floor(Math.random() * 2) + 2;
  }

  // Verifica no fim de cada turno se chegou a hora de um evento inesperado.
  private verificarEventoAleatorio(): void {
    if (this.turnosPassados < this.proximoEventoTurno) {
      return;
    }

    this.sortearEventoAleatorio();
    this.proximoEventoTurno = this.turnosPassados + this.sortearIntervaloEvento();
  }

  // Sorteia qual evento aleatorio vai acontecer.
  private sortearEventoAleatorio(): void {
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
  private eventoTerremoto(): void {
    this.jogadorUm.reduzirDefesaTemporaria(0.08, 2);
    this.jogadorDois.reduzirDefesaTemporaria(0.08, 2);
    this.aplicarEfeitoVisualEvento("evento-terremoto");
    this.log("O chão tremeu violentamente! Todos perderam equilíbrio.");
  }

  // Evento: cura quem vai jogar agora.
  private eventoPocaoMisteriosa(): void {
    const jogadorCurado = this.getJogadorAtual();

    jogadorCurado.recuperarVida(0.15);
    this.aplicarEfeitoVisualEvento("evento-pocao", jogadorCurado);
    this.log("Uma poção misteriosa apareceu! O jogador recuperou um pouco de vida.");
  }

  // Evento: muda a aparencia da arena.
  private eventoMudancaDeArena(): void {
    const arenas = ["fogo", "chuva", "tempestade", "normal"];
    const arenaSorteada = arenas[Math.floor(Math.random() * arenas.length)];

    this.arenaAtual = arenaSorteada;
    this.atualizarTela();
    this.log("A arena mudou! O ambiente da batalha ficou diferente.");
    this.log("Arena atual: " + this.arenaAtual + ".");
  }

  // Evento: deixa o oponente mais forte por alguns turnos.
  private eventoInimigoEnfurecido(): void {
    const inimigo = this.getOponenteAtual();

    inimigo.adicionarBonusAtaqueTemporario(0.15, 3);
    this.aplicarEfeitoVisualEvento("inimigo-enfurecido", inimigo);
    this.log("O inimigo ficou enfurecido e causará mais dano por alguns turnos.");
  }

  // Evento: apenas mostra uma onda visual e mensagem no log.
  private eventoEnergiaExtra(): void {
    this.aplicarEfeitoVisualEvento("evento-energia-extra");
    this.log("Uma onda de energia tomou conta da arena!");
  }

  // Evento: deixa a arena em clima de tempestade por alguns turnos.
  private eventoTempestadeEletrica(): void {
    this.arenaAtual = "tempestade eletrica";
    this.tempestadeEletricaTurnos = 3;
    this.atualizarTela();
    this.log("Uma tempestade elétrica começou! Ataques elétricos ficaram mais fortes.");
  }

  // Reduz a duracao dos efeitos que acabam sozinhos.
  private atualizarEfeitosTemporarios(): void {
    this.jogadorUm.atualizarEfeitosTemporarios();
    this.jogadorDois.atualizarEfeitosTemporarios();

    if (this.tempestadeEletricaTurnos > 0) {
      this.tempestadeEletricaTurnos--;

      if (this.tempestadeEletricaTurnos === 0 && this.arenaAtual === "tempestade eletrica") {
        this.arenaAtual = "normal";
        this.atualizarTela();
        this.log("A tempestade elétrica acabou. A arena voltou ao normal.");
      }
    }
  }

  // Aplica a classe certa para o ambiente atual da arena.
  private atualizarVisualArena(arena: HTMLElement): void {
    const classesArena = [
      "arena-fogo",
      "arena-chuva",
      "arena-tempestade",
      "arena-normal",
      "arena-tempestade-eletrica",
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
  private aplicarEfeitoVisualEvento(classe: string, personagem?: Personagem): void {
    const elemento: HTMLElement | null = personagem === undefined
      ? document.querySelector(".arena")
      : this.getCardPersonagem(personagem);

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
  private getCardPersonagem(personagem: Personagem): HTMLElement | null {
    if (personagem === this.jogadorUm) {
      return document.getElementById("cardJogadorUm");
    }

    if (personagem === this.jogadorDois) {
      return document.getElementById("cardJogadorDois");
    }

    return null;
  }

  // Encerra a partida e mostra quem venceu.
  private finalizarJogo(): void {
    this.acabou = true;
    this.ativarBotoes(false);
    document.getElementById("turnoAtual")!.textContent = "Fim de jogo";

    if (this.jogadorUm.isContinuaVivo()) {
      this.log(this.jogadorUm.nome + " ganhou a luta!");
    } else if (this.jogadorDois.isContinuaVivo()) {
      this.log(this.jogadorDois.nome + " ganhou a luta!");
    } else {
      this.log("A luta terminou em empate!");
    }
  }

  // Evita jogadas antes de iniciar ou depois do fim da batalha.
  private podeJogar(): boolean {
    if (this.jogadorUm === undefined || this.jogadorDois === undefined) {
      this.log("Clique em Batalhar primeiro!");
      return false;
    }

    if (this.acabou) {
      this.log("A batalha já terminou. Clique em Batalhar para jogar de novo.");
      return false;
    }

    return true;
  }

  // Mostra no topo e no log de quem e a vez.
  private mostrarTurno(): void {
    document.getElementById("turnoAtual")!.textContent = "Turno atual: " + this.turnoAtual;
    this.log("Agora é a vez do " + this.turnoAtual + " jogar!");
  }

  // Liga ou desliga os botoes de acao.
  private ativarBotoes(ativo: boolean): void {
    const botoes = ["btnAtacar", "btnDefender", "btnCurar", "btnPassarTurno"];

    botoes.forEach((id) => {
      const botao = document.getElementById(id) as HTMLButtonElement;
      botao.disabled = !ativo;
    });
  }

  // Envia mensagens para o log com efeito de digitacao.
  private log(mensagem: string): void {
    Personagem.adicionarMensagemLog(mensagem);
  }

  // Limpa o log quando uma nova batalha comeca.
  private limparConsole(): void {
    Personagem.limparLog();
  }
}

let jogo: Jogo = new Jogo();

function construirJogo(): void {
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
