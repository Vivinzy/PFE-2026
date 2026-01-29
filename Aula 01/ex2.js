const salario = parseFloat(prompt("Qual é o seu salário mensal?") || 0);
const aluguel = parseFloat(prompt("Qual é o valor do aluguel?") || 0);
const alimentacao = parseFloat(prompt("Qual é o valor gasto com alimentação?") || 0);
const lazer = parseFloat(prompt("Qual é o valor gasto com lazer?") || 0);

const totalDespesas = aluguel + alimentacao + lazer;


const saldo = salario - totalDespesas;


if (saldo > 0) {
    alert(`Saldo Positivo\nSobrou: R$ ${saldo.toFixed(2)}`);
} else if (saldo === 0) {
    alert("No Limite\nVocê gastou todo o seu salário");
} else {
    alert(`Saldo Negativo\nDébito: R$ ${Math.abs(saldo).toFixed(2)}`);
}