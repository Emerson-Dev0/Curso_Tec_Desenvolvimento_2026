import { Mago } from "./games/mago";
import { Guerreiro } from "./games/src/Guerreiro";
import { Jogo } from "./games/src/Jogo";

const btnBatalhar = document.getElementById("btnBatalhar") as HTMLButtonElement;

const textoHpGuerreiro = document.getElementById("textoHpGuerreiro") as HTMLParagraphElement;
const textoHpMago = document.getElementById("textoHpMago") as HTMLParagraphElement;

const barraHpGuerreiro = document.getElementById("barraHpGuerreiro") as HTMLDivElement;
const barraHpMago = document.getElementById("barraHpMago") as HTMLDivElement;

const consoleBatalha = document.getElementById("console") as HTMLDivElement;

let mago: Mago = new Mago("Mago", 120, 200);
let guerreiro: Guerreiro = new Guerreiro("Guerreiro", 90, 300);

let jogo: Jogo = new Jogo();

const hpMaxMago = 200;
const hpMaxGuerreiro = 300;

function atualizarTela() {
  textoHpGuerreiro.textContent = `vida: ${guerreiro.hp}`;
  textoHpMago.textContent = `vida: ${mago.hp}`;

  barraHpGuerreiro.style.width = `${(guerreiro.hp / hpMaxGuerreiro) * 100}%`;
  barraHpMago.style.width = `${(mago.hp / hpMaxMago) * 100}%`;
}

btnBatalhar.addEventListener("click", () => {
  jogo.iniciar(mago, guerreiro);

  atualizarTela();

  consoleBatalha.innerHTML = `
    <p>Batalha executada!</p>
    <p>HP Guerreiro: ${guerreiro.vida}</p>
    <p>HP Mago: ${mago.vida}</p>
  `;
});

atualizarTela();