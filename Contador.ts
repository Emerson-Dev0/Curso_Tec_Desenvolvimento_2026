export class contador {
    static total: number = 0;
    public nome: string;

      constructor(nome: string){
        this.nome = nome;
        contador.total++;
      }
      static resetar(): void{
        contador.total = 0;

      }
}