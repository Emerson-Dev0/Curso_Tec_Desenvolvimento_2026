export abstract class Personagem {
  // Atributos básicos que todo personagem do jogo precisa ter.
  public nome: string = "Personagem";
  protected poder_de_ataque: number = 0;
  public vida: number = 0;
  protected vidaMaxima: number;
  protected defesa: number = 0;
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
    const danoFinal = dano * (1 - this.defesa);

    this.vida = Math.max(0, this.vida - danoFinal);

    this.log(
      `${this.nome} recebeu ${danoFinal} de dano. vida atual: ${this.vida}`,
    );
  }

  gerarAtaque(): number {
    return Math.floor(Math.random() * 3);
  }

  // Recupera um pouco de vida quando o personagem está com pouca vida.
  curarSeNecessario(): void {
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

  public getImg() {
    return this.imagem;
  }

  public log(mensagem: string) {
    document.getElementById("console")!.innerHTML += '<p>' + mensagem + "</p>\n";
  }

  // Cada classe filha define sua própria forma de atacar.
  public abstract atacar(persona: Personagem): void;
}
