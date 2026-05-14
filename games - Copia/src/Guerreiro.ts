import { GerenciadorLog } from "./GerenciadorLog";
import { Periodo, Personagem, TipoAtaquePeriodo } from "./Personagem";

export class Guerreiro extends Personagem {
  constructor(nome: string, poder_de_ataque: number, vida: number) {
    super(nome, poder_de_ataque, vida, "./src/imagem2.png");
    this.defesa = 0.12;
  }

  // O guerreiro sorteia um ataque e aplica dano no adversario.
  atacar(adversario: Personagem, periodoAtual: Periodo): void {
    const tipoAtaque = this.gerarAtaque();
    let dano = 0;
    let periodoFavoravel: TipoAtaquePeriodo = "neutro";

    if (tipoAtaque === 0) {
      dano = this.poder_de_ataque * 0.9;
      periodoFavoravel = "dia";
      GerenciadorLog.adicionarMensagem(`${this.nome} usou Corte Rapido.`);
    } else if (tipoAtaque === 1) {
      dano = this.poder_de_ataque * 1.35;
      periodoFavoravel = "neutro";
      GerenciadorLog.adicionarMensagem(`${this.nome} usou Golpe Pesado.`);
    } else {
      dano = this.poder_de_ataque * 1.1;
      periodoFavoravel = "dia";
      GerenciadorLog.adicionarMensagem(`${this.nome} usou Investida.`);
    }

    dano = this.aplicarBuffPeriodo(dano, periodoFavoravel, periodoAtual);
    adversario.sofreu_dano(this.calcularDano(dano));
  }
}
