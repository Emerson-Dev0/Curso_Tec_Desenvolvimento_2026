import { GerenciadorLog } from "./GerenciadorLog";
import { Periodo, Personagem, TipoAtaquePeriodo } from "./Personagem";

export class Mago extends Personagem {
  constructor(nome: string, poder_de_ataque: number, vida: number) {
    super(nome, poder_de_ataque, vida, "./src/imagem1.png");
    this.defesa = 0.06;
  }

  // O mago sorteia uma magia e aplica dano no adversario.
  atacar(adversario: Personagem, periodoAtual: Periodo): void {
    const tipoAtaque = this.gerarAtaque();
    let dano = 0;
    let periodoFavoravel: TipoAtaquePeriodo = "neutro";

    if (tipoAtaque === 0) {
      dano = this.poder_de_ataque * 0.9;
      periodoFavoravel = "noite";
      GerenciadorLog.adicionarMensagem(`${this.nome} usou Faisca Arcana.`);
    } else if (tipoAtaque === 1) {
      dano = this.poder_de_ataque * 1.35;
      periodoFavoravel = "dia";
      GerenciadorLog.adicionarMensagem(`${this.nome} usou Bola de Fogo.`);
    } else {
      dano = this.poder_de_ataque * 1.1;
      periodoFavoravel = "noite";
      GerenciadorLog.adicionarMensagem(`${this.nome} usou Sombra Mistica.`);
    }

    dano = this.aplicarBuffPeriodo(dano, periodoFavoravel, periodoAtual);
    adversario.sofreu_dano(this.calcularDano(dano));
  }
}
