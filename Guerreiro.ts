import { Personagem } from "./Personagem.ts";

export class Guerreiro extends Personagem{
    constructor(nome: string, poder_de_ataque: number, vida: number){
        super(nome, poder_de_ataque, vida);
    }

         atacar(persona: Personagem): void {
    const tipoAtaque = this.gerarAtaque();

    let dano = 0;

    if (tipoAtaque === 0) {
      dano = this.poder_de_ataque * 1,1;
      console.log(`${this.nome} Me dê o cuuuuubo.`);
    } 
    else if (tipoAtaque === 1) {
      dano = this.poder_de_ataque * 1.8;
      console.log(`${this.nome} Coffe with bread.`);
    } 
    else {
      dano = this.poder_de_ataque * 2.1;
      console.log(`${this.nome} BEANS WHIT FLAVOR? 💀`);
    }

    persona.sofreu_dano(dano);
    }
}