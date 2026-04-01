

export class calculadora{
   resultado: number = 0;

  exibirResultado(){
    console.log("Resultado é:" + this.resultado);

}

 soma(nm2: number, nm1: number){
   this.resultado = nm1 + nm2;
}


multiplicacao(nm2: number, nm1: number){
   this.resultado = nm1 * nm2;
}


divisao(nm2: number, nm1: number){
   this.resultado = nm2/nm1;
}


subtracao(nm2: number, nm1: number){
   this.resultado = nm1 - nm2;
}

}