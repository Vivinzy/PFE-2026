function limparNomeContato(nome) {
    return nome.toUpperCase().trim();
}

function contarCaracteres(nome) {
    const nomeArr = (nome.trim()).split("");
    return nomeArr.length;
}

const nome = prompt("Digite seu nome:");

const nomeLimpo = limparNomeContato(nome);
const caracteres = contarCaracteres(nome);

alert("Nome em maiúsculas: " + nomeLimpo);
alert("Número de caracteres no nome: " + caracteres);
