export class Pessoa{
 
    nome: string;
    idade: number;
    rg: number;
    cpf: number;
    data_nasci: string;

       constructor(nome: string, idade: number, rg: number, cpf: number, data_nasci: string){
        this.nome = nome;
        this.idade = idade;
          this.rg = rg;
        this.cpf = cpf;
          this.data_nasci = data_nasci;
    
       }

    falar(){
        console.log("Olá mundo!\n");
    }
    correr(){
        console.log("To correndo bem agora\n");
    }
    gritar(){
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH\n");
    }
    pedir(){
        console.log("MIM DÊ PAPAI (sotaque nordestino)\n");
    }


}