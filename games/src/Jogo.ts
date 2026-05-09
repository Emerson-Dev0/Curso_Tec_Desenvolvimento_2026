import { Guerreiro } from "./Guerreiro";
import { Mago } from "./mago";
import { Personagem } from "./Personagem";

export class Jogo {
  private turnoAtual: string = "";
  private jogadorUm!: Personagem;
  private jogadorDois!: Personagem;

  // Prepara uma nova batalha e mostra os dados iniciais na tela.
  public iniciar(player1: Personagem, player2: Personagem): void {
    this.jogadorUm = player1;
    this.jogadorDois = player2;

    this.turnoAtual = this.jogadorUm.nome;

    this.limparLog();
    this.atualizarInterface(this.jogadorUm, this.jogadorDois);
    this.atualizarTextoTurno();

    this.adicionarLog("A batalha começou!");
  }

  private buscaComponenteHtml(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  // Atualiza nomes, imagens e vidas dos jogadores no HTML.
  public atualizarInterface(jogadorUm: Personagem, jogadorDois: Personagem): void {
    const imgJogadorUm = document.getElementById("imgJogadorUm") as HTMLImageElement | null;
    const imgJogadorDois = document.getElementById("imgJogadorDois") as HTMLImageElement | null;

    if (imgJogadorUm !== null) {
      imgJogadorUm.src = jogadorUm.getImg();
    }

    if (imgJogadorDois !== null) {
      imgJogadorDois.src = jogadorDois.getImg();
    }

    const vidaJogadorUm = this.buscaComponenteHtml("JogadorUmVida");
    const vidaJogadorDois = this.buscaComponenteHtml("JogadorDoisVida");
    const nomeUm = this.buscaComponenteHtml("NomeUm");
    const nomeDois = this.buscaComponenteHtml("NomeDois");

    if (vidaJogadorUm !== null) {
      vidaJogadorUm.textContent = "HP: " + jogadorUm.getVida();
    }

    if (vidaJogadorDois !== null) {
      vidaJogadorDois.textContent = "HP: " + jogadorDois.getVida();
    }

    if (nomeUm !== null) {
      nomeUm.textContent = jogadorUm.nome;
    }

    if (nomeDois !== null) {
      nomeDois.textContent = jogadorDois.nome;
    }

    const barraVida = this.buscaComponenteHtml("barraVida") as HTMLElement | null;

    if (barraVida !== null) {
      barraVida.style.width = (jogadorUm.getVida() / 300 * 100) + "%";
    }
  }

  // Executa o ataque do jogador que está com o turno.
  public Atacar(): void {
    if (!this.jogoFoiIniciado()) {
      this.adicionarLog("Clique em Batalhar primeiro!");
      return;
    }

    this.adicionarLog("A escolha do turno foi " + this.turnoAtual + ": ATAQUE!");

    if (this.turnoAtual === this.jogadorUm.nome) {
      this.jogadorUm.atacar(this.jogadorDois);
    } else {
      this.jogadorDois.atacar(this.jogadorUm);
    }

    this.atualizarInterface(this.jogadorUm, this.jogadorDois);

    if (!this.jogadorUm.isContinuaVivo() || !this.jogadorDois.isContinuaVivo()) {
      this.verificarVencedor();
      return;
    }

    this.passarTurno();
  }

  public Defender(): void {
    if (!this.jogoFoiIniciado()) {
      this.adicionarLog("Clique em Batalhar primeiro!");
      return;
    }

    this.adicionarLog("A escolha do turno foi " + this.turnoAtual + ": DEFESA!");

    this.passarTurno();
  }

  public Curar(): void {
    if (!this.jogoFoiIniciado()) {
      this.adicionarLog("Clique em Batalhar primeiro!");
      return;
    }

    this.adicionarLog("A escolha do turno foi " + this.turnoAtual + ": CURAR!");

    this.passarTurno();
  }

  // Alterna o turno entre os dois jogadores.
  public passarTurno(): void {
    if (!this.jogoFoiIniciado()) {
      this.adicionarLog("Clique em Batalhar primeiro!");
      return;
    }

    if (this.turnoAtual === this.jogadorUm.nome) {
      this.turnoAtual = this.jogadorDois.nome;
    } else {
      this.turnoAtual = this.jogadorUm.nome;
    }

    this.atualizarTextoTurno();
    this.atualizarLogTurno();
  }

  private atualizarTextoTurno(): void {
    this.adicionarLog("Agora é a vez do " + this.turnoAtual + " jogar!");
  }

  private atualizarLogTurno(): void {
    const textoTurno = document.getElementById("turnoAtual");

    if (textoTurno !== null) {
      textoTurno.textContent = "Turno Atual: " + this.turnoAtual;
    }
  }

  // Confere se algum jogador ficou sem vida e mostra o resultado.
  private verificarVencedor(): void {
    if (this.jogadorUm.isContinuaVivo() && !this.jogadorDois.isContinuaVivo()) {
      this.adicionarLog(this.jogadorUm.nome + " ganhou a luta!");
    } else if (this.jogadorDois.isContinuaVivo() && !this.jogadorUm.isContinuaVivo()) {
      this.adicionarLog(this.jogadorDois.nome + " ganhou a luta!");
    } else {
      this.adicionarLog("A luta terminou em empate!");
    }
  }

  private adicionarLog(mensagem: string): void {
    const consoleBatalha = document.getElementById("console");

    if (consoleBatalha !== null) {
      consoleBatalha.innerHTML += `<p>${mensagem}</p>`;
      consoleBatalha.scrollTop = consoleBatalha.scrollHeight;
    }
  }

  private limparLog(): void {
    const consoleBatalha = document.getElementById("console");

    if (consoleBatalha !== null) {
      consoleBatalha.innerHTML = "";
    }
  }

  private jogoFoiIniciado(): boolean {
    return this.jogadorUm !== undefined && this.jogadorDois !== undefined;
  }
}

let jogo: Jogo = new Jogo();

// Cria os personagens padrão e começa uma nova partida.
function construirJogo(): void {
  const guerreiro: Guerreiro = new Guerreiro("Guerreiro", 90, 300);
  const mago: Mago = new Mago("Mago", 120, 200);

  jogo = new Jogo();
  jogo.iniciar(guerreiro, mago);
}

// Liga os botões da página às ações do jogo.
window.addEventListener("DOMContentLoaded", () => {
  const btnBatalhar = document.getElementById("Batalhar");
  const btnAtacar = document.getElementById("btnAtacar");
  const btnDefender = document.getElementById("btnDefender");
  const btnCurar = document.getElementById("btnCurar");
  const btnProximoTurno = document.getElementById("btnPassarTurno");

  console.log("Batalhar:", btnBatalhar);
  console.log("Atacar:", btnAtacar);
  console.log("Defender:", btnDefender);
  console.log("Curar:", btnCurar);
  console.log("Passar turno:", btnProximoTurno);

  if (btnBatalhar !== null) {
    btnBatalhar.addEventListener("click", () => {
      console.log("Clicou em Batalhar");
      construirJogo();
    });
  }

  if (btnAtacar !== null) {
    btnAtacar.addEventListener("click", () => {
      console.log("Clicou em Atacar");
      jogo.Atacar();
    });
  }

  if (btnDefender !== null) {
    btnDefender.addEventListener("click", () => {
      console.log("Clicou em Defender");
      jogo.Defender();
    });
  }

  if (btnCurar !== null) {
    btnCurar.addEventListener("click", () => {
      console.log("Clicou em Curar");
      jogo.Curar();
    });
  }

  if (btnProximoTurno !== null) {
    btnProximoTurno.addEventListener("click", () => {
      console.log("Clicou em Passar Turno");
      jogo.passarTurno();
    });
  }
});
