const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

console.log( Math.ceil( day / second ));
console.log( Math.ceil( day / minute ));
console.log( Math.ceil( day / hour ));
console.log( Math.ceil( day / day ));   


const data = prompt('Digite a data de hoje dd/mm/aaaa:');
const dataArr = data.split('/');
const dia = dataArr[0];
const mes = dataArr[1];
const ano = dataArr[2];
console.log(`Dia: ${dia}, Mês: ${mes}, Ano: ${ano}`);

const dataCompromissoStr = prompt('Digite a data do seu compromisso dd/mm/aaaa:');
const dataArrCompromisso = dataCompromissoStr.split('/');
const diaCompromisso = dataArrCompromisso[0];
const mesCompromisso = dataArrCompromisso[1];
const anoCompromisso = dataArrCompromisso[2];
console.log(`Dia: ${diaCompromisso}, Mês: ${mesCompromisso}, Ano: ${anoCompromisso}`);

const dataAtual = new Date();
const dataCompromisso = new Date(anoCompromisso, mesCompromisso - 1, diaCompromisso);
const diferenca = dataCompromisso - dataAtual;
if (diferenca > 0) {
    const diasRestantes = Math.ceil(diferenca / day);
    const hora = Math.ceil((diferenca % day) / hour);
    const minuto = Math.ceil(((diferenca % day) % hour) / minute);
    const segundo = Math.ceil((((diferenca % day) % hour) % minute) / second);  

    alert(`Faltam ${diasRestantes} dias, ${hora} horas, ${minuto} minutos para o seu compromisso.`);
}

