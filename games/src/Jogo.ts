import { Guerreiro } from "./Guerreiro";
import { Mago } from "./mago";
import { Personagem } from "./Personagem";

export class Jogo {



  public async iniciar(player1: Personagem, player2: Personagem) {

    let turno = 1;
    let maxTurnos = 20;

    while (
      player1.isContinuaVivo() &&
      player2.isContinuaVivo() &&
      turno <= maxTurnos
    ) {
      player2.log("\n===================== turno " + turno + " =====================");

      player1.atacar(player2);

      if (!player2.isContinuaVivo()) break;

      player2.atacar(player1);

      turno++;
    }

    // resultado final
    if (player1.isContinuaVivo() && !player2.isContinuaVivo()) {
      player1.log(`${player1.nome} ganhou a luta!`);
      this.atualizarInterface(player1, player2);
      await this.delay();
    } 
    else if (player2.isContinuaVivo() && !player1.isContinuaVivo()) {
      player2.log(`${player2.nome} ganhou a luta!`);
      this.atualizarInterface(player1, player2);
      await this.delay();
    } 
    else {
      player2.log("A luta terminou em empate!");
    }
  }
 
  buscaComponenteHtml(id: string){
    return document.getElementById(id);
  }

 
  public atualizarInterface(jogadorUm:Personagem, jogadorDois:Personagem){
      (document.getElementById("imgJogadorUm")as HTMLImageElement).src = jogadorUm.getImg();
        (document.getElementById("imgJogadorDois")as HTMLImageElement).src = jogadorDois.getImg();

        this.buscaComponenteHtml("JogadorUmVida")!.textContent = "HP: " + jogadorUm.getVida();
         this.buscaComponenteHtml("JogadorDoisVida")!.textContent = "HP: " + jogadorDois.getVida();
         this.buscaComponenteHtml("NomeUm")!.textContent = "HP: " + jogadorUm.nome;
         this.buscaComponenteHtml("NomeDois")!.textContent = "HP: " + jogadorDois.nome;

         (this.buscaComponenteHtml("barraVida") as HTMLElement).style.width = (jogadorUm.getVida() / 300 * 100) + "%";
  }
  public delay(){
    return new Promise((x)=> setTimeout (x,800));
    
  }

}

function construirjogo(){

  let mago: Mago = new Mago("Mago", 120, 200);
   let guerreiro: Guerreiro = new Guerreiro("Guerreiro", 90, 300);
   
   
   
   let jogo: Jogo = new Jogo();
   jogo.iniciar(mago, guerreiro);
}
document.getElementById("Batalhar")?.addEventListener("click", construirjogo);