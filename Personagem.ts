export abstract class Personagem {
   public nome: string = "Personagem";
   protected poder_de_ataque: number = 0;
   protected vida: number = 0;
     
     constructor(nome:string, poder_de_ataque:number, vida:number){
      this.nome = nome;
      this.poder_de_ataque = poder_de_ataque;
      this.vida = vida;
     }
     isContinuaVivo(): boolean{
      return this.vida > 0
     }
     sofreu_dano(dano:number): void{
      this.vida = this.vida - dano;
      console.log(`${this.nome} recebeu ${dano} de dano. vida atual: ${this.vida}`)
     }
     abstract atacar(persona:Personagem):void;

     
}