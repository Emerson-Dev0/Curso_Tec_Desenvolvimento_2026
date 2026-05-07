import { Personagem } from "./Personagem";


export class Mago extends Personagem {
  constructor(nome: string, poder_de_ataque: number, vida: number) {
  super(nome, poder_de_ataque, vida, "./imagem2.png");
    this.defesa = 0.05;
  }

  atacar(persona: Personagem): void {
    const tipoAtaque = this.gerarAtaque();

    let dano = 0;

    if (tipoAtaque === 0) {
      dano = this.poder_de_ataque;
      this.log(`${this.nome} usou baratas mexicanas 🐜`);
    } 
    else if (tipoAtaque === 1) {
      dano = this.poder_de_ataque * 1.2;
      this.log(`${this.nome} usou 71kg de batata doce 🍠`);
    } 
    else {
      dano = this.poder_de_ataque * 1.4;
      this.log(`${this.nome} usou Feijão com farinha 💀`);
    }

    persona.sofreu_dano(dano);
    persona.curarSeNecessario();
  }
}