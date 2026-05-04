
import { Guerreiro } from "./Guerreiro";
import { Jogo } from "./Jogo";
import { Mago } from "./mago";

let mago: Mago = new Mago("Mago", 120, 200);
let guerreiro: Guerreiro = new Guerreiro("Guerreiro", 90, 300);



let jogo: Jogo = new Jogo();
jogo.iniciar(mago, guerreiro);