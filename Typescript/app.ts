import { Mago } from "./mago";
import { Guerreiro } from "./Guerreiro";
import { Jogo } from "./Jogo";
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

const consoleDiv = document.getElementById("console")!;

// substitui o console.log
console.log = function(msg) {
  consoleDiv.innerHTML += msg + "<br>";
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
};