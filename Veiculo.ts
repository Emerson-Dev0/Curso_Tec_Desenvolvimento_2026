export class Veiculo {
  protected modelo: string;
  protected ano: number;
  protected velocidade: number = 0;

  constructor(modelo: string, ano: number) {
    this.modelo = modelo;
    this.ano = ano;
  }

  acelerar(valor: number): void {
    this.velocidade += valor;
    console.log(`${this.modelo} acelerou para ${this.velocidade} km/h`);
  }

  frear(valor: number): void {
    this.velocidade -= valor;
    if (this.velocidade < 0) this.velocidade = 0;

    console.log(`${this.modelo} reduziu para ${this.velocidade} km/h`);
  }
}
