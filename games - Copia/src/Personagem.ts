import { GerenciadorLog } from "./GerenciadorLog";

export type Periodo = "dia" | "noite";
export type TipoAtaquePeriodo = Periodo | "neutro";

export abstract class Personagem {
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
      GerenciadorLog.adicionarMensagem(`${this.nome} bloqueou ${danoBruto - danoFinal} de dano com a defesa.`);
    }

    GerenciadorLog.adicionarMensagem(
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

  protected aplicarBuffPeriodo(
    dano: number,
    tipoAtaque: TipoAtaquePeriodo,
    periodoAtual: Periodo,
  ): number {
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

  defender(): void {
    if (!this.isContinuaVivo()) {
      return;
    }

    this.defesaExtra = this.valorDefesaExtra;
    GerenciadorLog.adicionarMensagem(`${this.nome} se defendeu! Defesa aumentada no proximo turno do oponente.`);
  }

  finalizarDefesa(): void {
    if (this.defesaExtra > 0) {
      this.defesaExtra = 0;
      GerenciadorLog.adicionarMensagem(`${this.nome} baixou a defesa.`);
    }
  }

  curar(): void {
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

  recuperarVida(percentual: number): void {
    if (!this.isContinuaVivo()) {
      return;
    }

    const cura = this.vidaMaxima * percentual;
    this.vida = Math.min(this.vidaMaxima, this.vida + cura);
    GerenciadorLog.adicionarMensagem(`${this.nome} recuperou vida! Vida atual: ${this.vida}`);
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

  public getImg() {
    return this.imagem;
  }

  // Cada classe filha define sua propria forma de atacar.
  public abstract atacar(adversario: Personagem, periodoAtual: Periodo): void;
}
