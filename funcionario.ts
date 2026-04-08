export class Funcionario {
  public nome: string = "Albertossauro";
  protected salario: number;

  constructor(nome: string, salario: number){
    this.nome = nome;
    this.salario = salario;
  }

  getSalario(){
    return this.salario;
  }

  setSalaio(salario: number){
    this.salario = salario;
  }

  farla(){
    console.log("meu nome é:", this.nome);
    console.log("meu salario é:", this.salario);
  }
}