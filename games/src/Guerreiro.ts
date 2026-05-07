import { Personagem } from "./Personagem";

export class Guerreiro extends Personagem {
  constructor(nome: string, poder_de_ataque: number, vida: number) {
    super(nome, poder_de_ataque, vida, "./imagem1.png");
    this.defesa = 0.05;
  }

  atacar(persona: Personagem): void {
    const tipoAtaque = this.gerarAtaque();

    let dano = 0;

    if (tipoAtaque === 0) {
      dano = this.poder_de_ataque * 1.1;
      this.log(`${this.nome} Me dê o cuuuuubo.`);
    } 
    else if (tipoAtaque === 1) {
      dano = this.poder_de_ataque * 1.8;
      this.log(`${this.nome} Coffe with bread.`);
    } 
    else {
      dano = this.poder_de_ataque * 2.1;
      this.log(`${this.nome} BEANS WHIT FLAVOR? 💀`);
    }

    persona.sofreu_dano(dano);
    persona.curarSeNecessario();
  }
}