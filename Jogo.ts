import { Personagem } from "./Personagem";

export class Jogo{

    public iniciar (player1: Personagem, player2: Personagem){
        while(player1.isContinuaVivo && player2.isContinuaVivo){
            player1.atacar(player2);
            player2.atacar(player1);

        }
    }
}