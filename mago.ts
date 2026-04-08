import { Personagem } from "./Personagem.ts";

class mago extends Personagem{
     constructor(nome:string, poder_de_ataque:number, vida:number){
        super(nome,poder_de_ataque,vida);
     }

     atacar(persona: Personagem): void {
         console.log('${this.nome} Chuta que é macumba');
         persona.sofreu_dano(this.poder_de_ataque);
     }
    }