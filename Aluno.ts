export class Aluno{
   public idade: Number = 0;
   readonly  nome: String = "";
   private nota: Number = 10.0;
    
  constructor(idade: Number, nome: String, nota: number){
      this.idade = idade;
      this.nome = nome;
      this.nota = nota;
  }


   alterar_nota( nota : number){
        this.nota = nota;
     }
     flrnome(){
        console.log("meu nome é: ", this.nome);
     }
     flridade(){
        console.log("Minha idade é:", this.idade);
     }
     flrnt(){
        console.log("Minha nota é: ", this.nota);
     }
}

