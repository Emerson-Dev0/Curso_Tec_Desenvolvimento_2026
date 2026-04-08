import { Funcionario } from "./Funcionario.ts";

export class Gerente extends Funcionario {

  public nome_GR: string = "Albertinho";
  private cargo: string = "Senhor Feudal";

  constructor(nome_GR: string, cargo: string, nome: string, salario: number){
    super(nome, salario);
    this.cargo = cargo;
    this.nome_GR = nome_GR;
  }

  Mandar_funcionario(){
    console.log("Trabalha meo, mais rápido");
  }

  salario_funcionario(){
    this.salario += 800;
  }
}