export class Veiculo {
  constructor(
    public    marca: string,
    protected velocidade: number = 0
  ) {}

  acelerar(v: number): void {
    this.velocidade += v;
  }

  descrever(): string {
    return `${this.marca} a ${this.velocidade} km/h`;
  }
}

