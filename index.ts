import { Pessoa } from "./Pessoa";
import { Gerente } from "./Gerente";
import { Aluno } from "./Aluno";
import { Professor } from "./Professor";
import { Produto } from "./Produto.ts";
import { Contador } from "./Contador.ts";
import { Veiculo } from "./Veiculo";
import { Carro } from "./Carro";
import { Funcionario } from "./Funcionario";

// Pessoa
const pessoa = new Pessoa("Emerson", 17, 2345, 32048, "28/04/2008");
pessoa.falar();
pessoa.correr();
pessoa.gritar();
pessoa.pedir();

// Aluno
const aluno = new Aluno(17, "Emerson", 10.0);
aluno.alterar_nota(10);
aluno.flridade();
aluno.flrnome();
aluno.flrnt();

// Professor
const professor = new Professor("Alexandre", 24);
professor.falanm();
professor.falaridd();

// Produto
const produto = new Produto("Agrotóxico Rondap", 101010, 35.70,"Agrotóxico anti pragas. Não levar aos olhos, não beber."); // coloca o preço certo aqui

// Contador DESATIVADO POR NÃO CONTER OS DADOS NECESSARIOS.
//const contador = new Contador("Interessantinho",);
//contador.resetar();

// Carro
const carro = new Carro("Gol", 2020, 4);

carro.acelerar(50);
carro.buzinar();
carro.frear(20);

// Gerente
const gerente = new Gerente("Albertinho", "Senhor Feudal", "Albertosauro", 800.50);
gerente.Mandar_funcionario();

// Funcionario
const funcionario = new Funcionario("Albertossauro", 800.50);
funcionario.farla();