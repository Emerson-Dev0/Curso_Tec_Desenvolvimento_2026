export abstract class Personagem {
  // Atributos basicos que todo personagem do jogo precisa ter.
  public nome: string = "Personagem";
  protected poder_de_ataque: number = 0;
  public vida: number = 0;
  protected vidaMaxima: number;
  protected defesa: number = 0;
  protected defesaExtra: number = 0;
  protected valorDefesaExtra: number = 0.4;
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

  getVida() {
    return this.vida;
  }

  getVidaMaxima() {
    return this.vidaMaxima;
  }

  getDefesaTotal() {
    return Math.min(0.9, this.defesa + this.defesaExtra);
  }

  public getImg() {
    return this.imagem;
  }

  public log(mensagem: string) {
    document.getElementById("console")!.innerHTML += "<p>" + mensagem + "</p>\n";
  }

  // Cada classe filha define sua propria forma de atacar.
  public abstract atacar(persona: Personagem): void;
}
