  
    
  export class Professor{
 
    nome_prof: string;
    idade: number;
  
       constructor(nome_prof: string, idade: number){
        this.nome_prof = nome_prof;
        this.idade = idade;
    
       }

    falar(){
        console.log("Olá mundo!\n");
    }


  


}