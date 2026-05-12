import { Personagem } from "./Personagem";

export class Guerreiro extends Personagem {
  constructor(nome: string, poder_de_ataque: number, vida: number) {
    super(nome, poder_de_ataque, vida, "./src/imagem2.png");
    this.defesa = 0.12;
  }

  // O guerreiro sorteia um dos ataques e aplica dano no adversário.
  atacar(adversario: Personagem): void {
    const tipoAtaque = this.gerarAtaque();

    let dano = 0;

    if (tipoAtaque === 0) {
      dano = this.poder_de_ataque * 0.9;
      this.log(`${this.nome} Me dê o cuuuuubo.`);
    } 
    else if (tipoAtaque === 1) {
      dano = this.poder_de_ataque * 1.15;
      this.log(`${this.nome} Coffe with bread.`);
    } 
    else {
      dano = this.poder_de_ataque * 1.35;
      this.log(`${this.nome} BEANS WHIT FLAVOR? 💀`);
    }

    adversario.sofreu_dano(this.calcularDano(dano));
  }
}
