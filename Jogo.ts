import { Personagem } from "./Personagem";

export class Jogo {

  public iniciar(player1: Personagem, player2: Personagem) {

    let turno = 1;
    let maxTurnos = 20;

    while (
      player1.isContinuaVivo() &&
      player2.isContinuaVivo() &&
      turno <= maxTurnos
    ) {
      console.log("\n===================== turno " + turno + " =====================");

      player1.atacar(player2);

      if (!player2.isContinuaVivo()) break;

      player2.atacar(player1);

      turno++;
    }

    // resultado final
    if (player1.isContinuaVivo() && !player2.isContinuaVivo()) {
      console.log(`${player1.nome} ganhou a luta!`);
    } 
    else if (player2.isContinuaVivo() && !player1.isContinuaVivo()) {
      console.log(`${player2.nome} ganhou a luta!`);
    } 
    else {
      console.log("A luta terminou em empate!");
    }
  }
}