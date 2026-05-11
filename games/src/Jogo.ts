import { Guerreiro } from "./Guerreiro";
import { Mago } from "./mago";
import { Personagem } from "./Personagem";

export class Jogo {
  private jogadorUm!: Personagem;
  private jogadorDois!: Personagem;
  private turnoAtual: string = "";
  private acabou: boolean = false;

  public iniciar(player1: Personagem, player2: Personagem): void {
    this.jogadorUm = player1;
    this.jogadorDois = player2;
    this.turnoAtual = this.jogadorUm.nome;
    this.acabou = false;

    this.limparConsole();
    this.ativarBotoes(true);
    this.atualizarTela();
    this.mostrarTurno();
    this.log("A batalha começou!");
  }

  public Atacar(): void {
    if (!this.podeJogar()) {
      return;
    }

    this.log(this.turnoAtual + " atacou!");

    if (this.turnoAtual === this.jogadorUm.nome) {
      this.jogadorUm.atacar(this.jogadorDois);
    } else {
      this.jogadorDois.atacar(this.jogadorUm);
    }

    this.atualizarTela();

    if (!this.jogadorUm.isContinuaVivo() || !this.jogadorDois.isContinuaVivo()) {
      this.finalizarJogo();
      return;
    }

    this.passarTurno();
  }

  public Defender(): void {
    if (!this.podeJogar()) {
      return;
    }

    this.getJogadorAtual().defender();
    this.atualizarTela();
    this.passarTurno();
  }

  public Curar(): void {
    if (!this.podeJogar()) {
      return;
    }

    this.getJogadorAtual().curar();
    this.atualizarTela();
    this.passarTurno();
  }

  public passarTurno(): void {
    if (!this.podeJogar()) {
      return;
    }

    let proximoJogador: Personagem;

    if (this.turnoAtual === this.jogadorUm.nome) {
      this.turnoAtual = this.jogadorDois.nome;
      proximoJogador = this.jogadorDois;
    } else {
      this.turnoAtual = this.jogadorUm.nome;
      proximoJogador = this.jogadorUm;
    }

    proximoJogador.finalizarDefesa();
    this.atualizarTela();
    this.mostrarTurno();
  }

  private atualizarTela(): void {
    const imgUm = document.getElementById("imgJogadorUm") as HTMLImageElement;
    const imgDois = document.getElementById("imgJogadorDois") as HTMLImageElement;
    const barraUm = document.getElementById("barraVida") as HTMLElement;
    const barraDois = document.getElementById("barraVidaDois") as HTMLElement;
    const barraDefesaUm = document.getElementById("barraDefesaUm") as HTMLElement;
    const barraDefesaDois = document.getElementById("barraDefesaDois") as HTMLElement;
    const cardUm = document.getElementById("cardJogadorUm") as HTMLElement;
    const cardDois = document.getElementById("cardJogadorDois") as HTMLElement;

    imgUm.src = this.jogadorUm.getImg();
    imgDois.src = this.jogadorDois.getImg();

    document.getElementById("NomeUm")!.textContent = this.jogadorUm.nome;
    document.getElementById("NomeDois")!.textContent = this.jogadorDois.nome;
    document.getElementById("JogadorUmVida")!.textContent = "HP: " + this.jogadorUm.getVida();
    document.getElementById("JogadorDoisVida")!.textContent = "HP: " + this.jogadorDois.getVida();

    barraUm.style.width = this.calcularVida(this.jogadorUm) + "%";
    barraDois.style.width = this.calcularVida(this.jogadorDois) + "%";
    barraDefesaUm.style.width = this.calcularDefesa(this.jogadorUm) + "%";
    barraDefesaDois.style.width = this.calcularDefesa(this.jogadorDois) + "%";

    cardUm.classList.toggle("morto", !this.jogadorUm.isContinuaVivo());
    cardDois.classList.toggle("morto", !this.jogadorDois.isContinuaVivo());
  }

  private calcularVida(jogador: Personagem): number {
    return Math.max(0, (jogador.getVida() / jogador.getVidaMaxima()) * 100);
  }

  private calcularDefesa(jogador: Personagem): number {
    return jogador.getDefesaTotal() * 100;
  }

  private getJogadorAtual(): Personagem {
    if (this.turnoAtual === this.jogadorUm.nome) {
      return this.jogadorUm;
    }

    return this.jogadorDois;
  }

  private finalizarJogo(): void {
    this.acabou = true;
    this.ativarBotoes(false);
    document.getElementById("turnoAtual")!.textContent = "Fim de jogo";

    if (this.jogadorUm.isContinuaVivo()) {
      this.log(this.jogadorUm.nome + " ganhou a luta!");
    } else if (this.jogadorDois.isContinuaVivo()) {
      this.log(this.jogadorDois.nome + " ganhou a luta!");
    } else {
      this.log("A luta terminou em empate!");
    }
  }

  private podeJogar(): boolean {
    if (this.jogadorUm === undefined || this.jogadorDois === undefined) {
      this.log("Clique em Batalhar primeiro!");
      return false;
    }

    if (this.acabou) {
      this.log("A batalha já terminou. Clique em Batalhar para jogar de novo.");
      return false;
    }

    return true;
  }

  private mostrarTurno(): void {
    document.getElementById("turnoAtual")!.textContent = "Turno atual: " + this.turnoAtual;
    this.log("Agora é a vez do " + this.turnoAtual + " jogar!");
  }

  private ativarBotoes(ativo: boolean): void {
    const botoes = ["btnAtacar", "btnDefender", "btnCurar", "btnPassarTurno"];

    botoes.forEach((id) => {
      const botao = document.getElementById(id) as HTMLButtonElement;
      botao.disabled = !ativo;
    });
  }

  private log(mensagem: string): void {
    const consoleBatalha = document.getElementById("console")!;
    consoleBatalha.innerHTML += "<p>" + mensagem + "</p>";
    consoleBatalha.scrollTop = consoleBatalha.scrollHeight;
  }

  private limparConsole(): void {
    document.getElementById("console")!.innerHTML = "";
  }
}

let jogo: Jogo = new Jogo();

function construirJogo(): void {
  const guerreiro = new Guerreiro("Guerreiro", 70, 300);
  const mago = new Mago("Mago", 85, 240);

  jogo = new Jogo();
  jogo.iniciar(guerreiro, mago);
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("Batalhar")?.addEventListener("click", construirJogo);
  document.getElementById("btnAtacar")?.addEventListener("click", () => jogo.Atacar());
  document.getElementById("btnDefender")?.addEventListener("click", () => jogo.Defender());
  document.getElementById("btnCurar")?.addEventListener("click", () => jogo.Curar());
  document.getElementById("btnPassarTurno")?.addEventListener("click", () => jogo.passarTurno());
});
