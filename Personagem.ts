export abstract class Personagem {
  public nome: string = "Personagem";
  protected poder_de_ataque: number = 0;
  protected vida: number = 0;
  protected vidaMaxima: number;

  constructor(nome: string, poder_de_ataque: number, vida: number){
    this.nome = nome;
    this.poder_de_ataque = poder_de_ataque;
    this.vida = vida;
    this.vidaMaxima = vida;
  }

  isContinuaVivo(): boolean {
    return this.vida > 0;
  }

  sofreu_dano(dano: number): void {
    this.vida = Math.max(0, this.vida - dano);
    console.log(`${this.nome} recebeu ${dano} de dano. vida atual: ${this.vida}`);
  }

  gerarAtaque(): number {
    return Math.floor(Math.random() * 3);
  }

  curarSeNecessario(): void {
    if (this.vida < this.vidaMaxima * 0.3) {
      this.vida += this.vidaMaxima * 0.2;

      if (this.vida > this.vidaMaxima) {
        this.vida = this.vidaMaxima;
      }

      console.log(`${this.nome} regenerou vida! Vida atual: ${this.vida}`);
    }
  }

  public abstract atacar(persona: Personagem): void;
}