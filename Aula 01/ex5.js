let contagemValidos = 0;

alert("Relatório de Agenda");

const horarioStr = prompt("Digite os horários separados por vírgula:");
const agendaHorarios = horarioStr.split(',').map(h => parseInt(h.trim()));

for (let i = 0; i < agendaHorarios.length; i++) {
    let horario = agendaHorarios[i];
    if (horario >= 0 && horario <= 23) {
        alert(`Compromisso agendado para as ${horario}h`);
    
        contagemValidos++;
    } else {
        alert(`Atenção: O horário ${horario}h é inválido!`);
    }
}
alert(`Total de compromissos válidos: ${contagemValidos}`);