import { Veiculo } from "./Veiculo";

export class Carro extends Veiculo {
  private portas: number;

  constructor(modelo: string, ano: number, portas: number) {
    super(modelo, ano); // puxa do Veiculo
    this.portas = portas;
  }

  buzinar(): void {
    console.log(`${this.modelo} Atropelei uma velha 🚗`);
  }
}