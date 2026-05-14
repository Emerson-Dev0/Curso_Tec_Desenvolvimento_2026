export class GerenciadorLog {
  private static fila: string[] = [];
  private static escrevendo: boolean = false;
  private static textoAtual: string = "";
  private static indiceTexto: number = 0;
  private static elementoTexto: HTMLElement | null = null;
  private static elementoCursor: HTMLElement | null = null;
  private static tempo: number | undefined;
  private static atalhosAtivados: boolean = false;

  // Diminua esse numero para o texto aparecer mais rapido.
  public static velocidadeDigitacao: number = 25;
  public static pausaEntreMensagens: number = 180;

  // Adiciona uma mensagem na fila do log.
  public static adicionarMensagem(mensagem: string): void {
    GerenciadorLog.prepararAtalhos();
    GerenciadorLog.fila.push(mensagem);

    if (!GerenciadorLog.escrevendo) {
      GerenciadorLog.escreverProximaMensagem();
    }
  }

  // Limpa o log e para qualquer texto que ainda esteja sendo digitado.
  public static limpar(): void {
    if (GerenciadorLog.tempo !== undefined) {
      window.clearTimeout(GerenciadorLog.tempo);
    }

    GerenciadorLog.fila = [];
    GerenciadorLog.escrevendo = false;
    GerenciadorLog.textoAtual = "";
    GerenciadorLog.indiceTexto = 0;
    GerenciadorLog.elementoTexto = null;
    GerenciadorLog.elementoCursor = null;

    const consoleBatalha = document.getElementById("console");

    if (consoleBatalha !== null) {
      consoleBatalha.innerHTML = "";
    }
  }

  // Permite pular a animacao clicando no log ou apertando espaco.
  private static prepararAtalhos(): void {
    if (GerenciadorLog.atalhosAtivados) {
      return;
    }

    const consoleBatalha = document.getElementById("console");
    consoleBatalha?.addEventListener("click", () => GerenciadorLog.pularAnimacao());

    document.addEventListener("keydown", (evento) => {
      if (evento.code === "Space" && GerenciadorLog.escrevendo) {
        evento.preventDefault();
        GerenciadorLog.pularAnimacao();
      }
    });

    GerenciadorLog.atalhosAtivados = true;
  }

  // Pega a proxima mensagem da fila e prepara o paragrafo no HTML.
  private static escreverProximaMensagem(): void {
    const proximaMensagem = GerenciadorLog.fila.shift();

    if (proximaMensagem === undefined) {
      GerenciadorLog.escrevendo = false;
      return;
    }

    const consoleBatalha = document.getElementById("console");

    if (consoleBatalha === null) {
      GerenciadorLog.escrevendo = false;
      return;
    }

    const paragrafo = document.createElement("p");
    const texto = document.createElement("span");
    const cursor = document.createElement("span");

    cursor.className = "cursorLog";
    cursor.textContent = "|";
    paragrafo.appendChild(texto);
    paragrafo.appendChild(cursor);
    consoleBatalha.appendChild(paragrafo);

    GerenciadorLog.escrevendo = true;
    GerenciadorLog.textoAtual = proximaMensagem;
    GerenciadorLog.indiceTexto = 0;
    GerenciadorLog.elementoTexto = texto;
    GerenciadorLog.elementoCursor = cursor;
    GerenciadorLog.digitarMensagem();
  }

  // Escreve a mensagem atual letra por letra.
  private static digitarMensagem(): void {
    if (GerenciadorLog.elementoTexto === null) {
      return;
    }

    if (GerenciadorLog.indiceTexto < GerenciadorLog.textoAtual.length) {
      GerenciadorLog.elementoTexto.textContent += GerenciadorLog.textoAtual.charAt(GerenciadorLog.indiceTexto);
      GerenciadorLog.indiceTexto++;
      GerenciadorLog.rolarParaBaixo();
      GerenciadorLog.tempo = window.setTimeout(
        () => GerenciadorLog.digitarMensagem(),
        GerenciadorLog.velocidadeDigitacao,
      );
      return;
    }

    GerenciadorLog.finalizarMensagem();
  }

  // Termina uma mensagem e chama a proxima depois de uma pausa.
  private static finalizarMensagem(): void {
    GerenciadorLog.elementoCursor?.remove();
    GerenciadorLog.elementoTexto = null;
    GerenciadorLog.elementoCursor = null;
    GerenciadorLog.textoAtual = "";
    GerenciadorLog.indiceTexto = 0;
    GerenciadorLog.rolarParaBaixo();

    GerenciadorLog.tempo = window.setTimeout(
      () => GerenciadorLog.escreverProximaMensagem(),
      GerenciadorLog.pausaEntreMensagens,
    );
  }

  // Completa a mensagem atual de uma vez.
  private static pularAnimacao(): void {
    if (!GerenciadorLog.escrevendo || GerenciadorLog.elementoTexto === null) {
      return;
    }

    if (GerenciadorLog.tempo !== undefined) {
      window.clearTimeout(GerenciadorLog.tempo);
    }

    GerenciadorLog.elementoTexto.textContent = GerenciadorLog.textoAtual;
    GerenciadorLog.finalizarMensagem();
  }

  // Mantem a caixa do log sempre mostrando a ultima mensagem.
  private static rolarParaBaixo(): void {
    const consoleBatalha = document.getElementById("console");

    if (consoleBatalha !== null) {
      consoleBatalha.scrollTop = consoleBatalha.scrollHeight;
    }
  }
}
