import { Mago } from "./mago.ts"
import { Guerreiro } from "./Guerreiro.ts"
import { Jogo } from "./Jogo.ts";

let mago: Mago = new Mago ("Mago", 120, 200);
let guerreiro: Guerreiro = new Guerreiro ("Guerreiro", 90, 300);

let jogo: Jogo = new Jogo();
jogo.iniciar(mago, guerreiro);