export class Aluno{
   idade: Number = 0;
   nome: String = "";
   nota: Number = 10.0;
    
  constructor(idade: Number, nome: String, nota: GLfloat){
      this.idade = idade;
      this.nome = nome;
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

