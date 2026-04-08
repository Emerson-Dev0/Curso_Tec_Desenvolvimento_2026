import { Personagem } from "./Personagem";

export class Guerreiro extends Personagem{
    constructor(nome: string, poder_de_ataque: number, vida: number){
        super(nome, poder_de_ataque, vida);
    }

   public atacar(persona: Personagem): void {
         console.log('${this.nome} Xablau');
         persona.sofreu_dano(this.poder_de_ataque);
    }
}