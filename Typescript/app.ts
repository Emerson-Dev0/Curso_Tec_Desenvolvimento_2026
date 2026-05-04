import { Mago } from "./mago.ts";
import { Guerreiro } from "./Guerreiro.ts";
import { Jogo } from "./Jogo.ts";

const botao = document.getElementById("btnJogar")!;

botao.addEventListener("click", () => {
  iniciarJogo();
});

function iniciarJogo() {
  consoleDiv.innerHTML = "";

  let mago = new Mago("Mago", 120, 200);
  let guerreiro = new Guerreiro("Guerreiro", 90, 300);

  let jogo = new Jogo();
  jogo.iniciar(mago, guerreiro);
}