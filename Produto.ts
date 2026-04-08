class Rondap {

    readonly nome_produto: string = "Agrotóxico Rondap";
    private codigo: number = 101010;
    private valor: number = 35.70;
    private descricao: string = "Agrotóxico anti pragas. Não levar aos olhos, não beber."

      constructor(nome_produto: string, codigo: number, valor: number, descricao: string){
      this.nome_produto = nome_produto;
      this.codigo = codigo;
      this.valor = valor;
      this.descricao = descricao;
    }

    produto(){
        console.log("Produto selecionado: ", this.nome_produto);
    }

    ident(){
        console.log("O código do produto selecionado é: ", this.codigo);
    }

    valores(){
        console.log("o valor do produto selecioado é de: ", this.valor);
    }

    descrit(){
        console.log(this.valor);
    }
}
