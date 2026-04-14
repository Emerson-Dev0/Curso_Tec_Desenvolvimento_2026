
function adicionar(valor){
       let saida = document.getElementById("resultado");
    resultado.value += valor;
 }

  function calcular(){
     let saida = document.getElementById("resultado");
    resultado.value = eval(resultado.value);
 }

  function limpar(){
     let saida = document.getElementById("resultado");
    resultado.value = ""
 }