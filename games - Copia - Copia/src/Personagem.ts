export abstract class Personagem {
  // Configuracoes do log com efeito de digitacao.
  private static filaLog: string[] = [];
  private static escrevendoLog: boolean = false;
  private static textoAtualLog: string = "";
  private static indiceTextoLog: number = 0;
  private static elementoTextoLog: HTMLElement | null = null;
  private static elementoCursorLog: HTMLElement | null = null;
  private static tempoLog: number | undefined;
  private static atalhosLogAtivados: boolean = false;

  // Diminua esse numero para o texto aparecer mais rapido.
  public static velocidadeDigitacaoLog: number = 25;
  public static pausaEntreMensagensLog: number = 180;

  // Atributos basicos que todo personagem do jogo precisa ter.
  public nome: string = "Personagem";
  protected poder_de_ataque: number = 0;
  public vida: number = 0;
  protected vidaMaxima: number;
  protected defesa: number = 0;
  protected defesaExtra: number = 0;
  protected valorDefesaExtra: number = 0.4;

  // Efeitos temporarios causados por eventos aleatorios.
  protected defesaEventoExtra: number = 0;
  protected defesaEventoTurnos: number = 0;
  protected bonusAtaque: number = 0;
  protected bonusAtaqueTurnos: number = 0;
  protected imagem: string = "";

  constructor(
    nome: string,
    poder_de_ataque: number,
    vida: number,
    imagem: string,
  ) {
    this.nome = nome;
    this.poder_de_ataque = poder_de_ataque;
    this.vida = vida;
    this.vidaMaxima = vida;
    this.imagem = imagem;
  }

  isContinuaVivo(): boolean {
    return this.vida > 0;
  }

  // Calcula o dano recebido considerando a defesa do personagem.
  sofreu_dano(dano: number): void {
    const defesaTotal = this.getDefesaTotal();
    const danoBruto = Math.round(dano);
    const danoFinal = Math.round(danoBruto * (1 - defesaTotal));

    this.vida = Math.max(0, this.vida - danoFinal);

    if (this.defesaExtra > 0) {
      this.log(`${this.nome} bloqueou ${danoBruto - danoFinal} de dano com a defesa.`);
    }

    this.log(
      `${this.nome} recebeu ${danoFinal} de dano. vida atual: ${this.vida}`,
    );
  }

  gerarAtaque(): number {
    return Math.floor(Math.random() * 3);
  }

  // Aplica bonus temporario de ataque, se existir.
  calcularDano(danoBase: number): number {
    return danoBase * (1 + this.bonusAtaque);
  }

  defender(): void {
    if (!this.isContinuaVivo()) {
      return;
    }

    this.defesaExtra = this.valorDefesaExtra;
    this.log(`${this.nome} se defendeu! Defesa aumentada no proximo turno do oponente.`);
  }

  finalizarDefesa(): void {
    if (this.defesaExtra > 0) {
      this.defesaExtra = 0;
      this.log(`${this.nome} baixou a defesa.`);
    }
  }

  curar(): void {
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

  recuperarVida(percentual: number): void {
    if (!this.isContinuaVivo()) {
      return;
    }

    const cura = this.vidaMaxima * percentual;
    this.vida = Math.min(this.vidaMaxima, this.vida + cura);
    this.log(`${this.nome} recuperou vida! Vida atual: ${this.vida}`);
  }

  // Reduz a defesa por alguns turnos, usado pelo evento de terremoto.
  reduzirDefesaTemporaria(valor: number, turnos: number): void {
    if (!this.isContinuaVivo()) {
      return;
    }

    this.defesaEventoExtra = -valor;
    this.defesaEventoTurnos = turnos;
  }

  // Aumenta o dano por alguns turnos, usado pelo evento de inimigo enfurecido.
  adicionarBonusAtaqueTemporario(valor: number, turnos: number): void {
    if (!this.isContinuaVivo()) {
      return;
    }

    this.bonusAtaque = valor;
    this.bonusAtaqueTurnos = turnos;
  }

  // Reduz a duracao dos efeitos temporarios a cada turno.
  atualizarEfeitosTemporarios(): void {
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

  public getImg() {
    return this.imagem;
  }

  public log(mensagem: string) {
    Personagem.adicionarMensagemLog(mensagem);
  }

  // Adiciona uma mensagem na fila do log.
  public static adicionarMensagemLog(mensagem: string): void {
    Personagem.prepararAtalhosLog();
    Personagem.filaLog.push(mensagem);

    if (!Personagem.escrevendoLog) {
      Personagem.escreverProximaMensagemLog();
    }
  }

  // Limpa o log e para qualquer texto que ainda esteja sendo digitado.
  public static limparLog(): void {
    if (Personagem.tempoLog !== undefined) {
      window.clearTimeout(Personagem.tempoLog);
    }

    Personagem.filaLog = [];
    Personagem.escrevendoLog = false;
    Personagem.textoAtualLog = "";
    Personagem.indiceTextoLog = 0;
    Personagem.elementoTextoLog = null;
    Personagem.elementoCursorLog = null;

    const consoleBatalha = document.getElementById("console");

    if (consoleBatalha !== null) {
      consoleBatalha.innerHTML = "";
    }
  }

  // Permite pular a animacao clicando no log ou apertando espaco.
  private static prepararAtalhosLog(): void {
    if (Personagem.atalhosLogAtivados) {
      return;
    }

    const consoleBatalha = document.getElementById("console");
    consoleBatalha?.addEventListener("click", () => Personagem.pularAnimacaoLog());

    document.addEventListener("keydown", (evento) => {
      if (evento.code === "Space" && Personagem.escrevendoLog) {
        evento.preventDefault();
        Personagem.pularAnimacaoLog();
      }
    });

    Personagem.atalhosLogAtivados = true;
  }

  // Pega a proxima mensagem da fila e prepara o paragrafo no HTML.
  private static escreverProximaMensagemLog(): void {
    const proximaMensagem = Personagem.filaLog.shift();

    if (proximaMensagem === undefined) {
      Personagem.escrevendoLog = false;
      return;
    }

    const consoleBatalha = document.getElementById("console");

    if (consoleBatalha === null) {
      Personagem.escrevendoLog = false;
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

    Personagem.escrevendoLog = true;
    Personagem.textoAtualLog = proximaMensagem;
    Personagem.indiceTextoLog = 0;
    Personagem.elementoTextoLog = texto;
    Personagem.elementoCursorLog = cursor;
    Personagem.digitarMensagemLog();
  }

  // Escreve a mensagem atual letra por letra.
  private static digitarMensagemLog(): void {
    if (Personagem.elementoTextoLog === null) {
      return;
    }

    if (Personagem.indiceTextoLog < Personagem.textoAtualLog.length) {
      Personagem.elementoTextoLog.textContent += Personagem.textoAtualLog.charAt(Personagem.indiceTextoLog);
      Personagem.indiceTextoLog++;
      Personagem.rolarLogParaBaixo();
      Personagem.tempoLog = window.setTimeout(
        () => Personagem.digitarMensagemLog(),
        Personagem.velocidadeDigitacaoLog,
      );
      return;
    }

    Personagem.finalizarMensagemLog();
  }

  // Termina uma mensagem e chama a proxima depois de uma pausa.
  private static finalizarMensagemLog(): void {
    Personagem.elementoCursorLog?.remove();
    Personagem.elementoTextoLog = null;
    Personagem.elementoCursorLog = null;
    Personagem.textoAtualLog = "";
    Personagem.indiceTextoLog = 0;
    Personagem.rolarLogParaBaixo();

    Personagem.tempoLog = window.setTimeout(
      () => Personagem.escreverProximaMensagemLog(),
      Personagem.pausaEntreMensagensLog,
    );
  }

  // Completa a mensagem atual de uma vez.
  private static pularAnimacaoLog(): void {
    if (!Personagem.escrevendoLog || Personagem.elementoTextoLog === null) {
      return;
    }

    if (Personagem.tempoLog !== undefined) {
      window.clearTimeout(Personagem.tempoLog);
    }

    Personagem.elementoTextoLog.textContent = Personagem.textoAtualLog;
    Personagem.finalizarMensagemLog();
  }

  // Mantem a caixa do log sempre mostrando a ultima mensagem.
  private static rolarLogParaBaixo(): void {
    const consoleBatalha = document.getElementById("console");

    if (consoleBatalha !== null) {
      consoleBatalha.scrollTop = consoleBatalha.scrollHeight;
    }
  }

  // Cada classe filha define sua propria forma de atacar.
  public abstract atacar(adversario: Personagem): void;
}
