import { Pessoa } from "./Pessoa.ts";

const p1 = new Pessoa("Emerson", 17, 2345, 32048, "28/04/2008");

p1.falar();
p1.correr();
p1.gritar();
p1.pedir();

import { Aluno } from "./Aluno.ts";

const p2 = new Aluno(17, "Emerson", 10.0);

p2.alterar_nota(10);
p2.flridade();
p2.flrnome();
p2.flrnt();

import { Professor } from "./Professor.ts";

const p3 = new Professor ("Alexandre", 24);

p3.falanm();
p3.falaridd();
