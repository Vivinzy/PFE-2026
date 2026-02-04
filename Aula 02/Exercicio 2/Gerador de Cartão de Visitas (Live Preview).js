function atualizarCartao() {
    const nome = document.getElementById('inputNome').value;
    const cargo = document.getElementById('inputCargo').value;

    document.getElementById('previewNome').innerText = nome || "Seu Nome";
    document.getElementById('previewCargo').innerText = cargo || "Seu Cargo";
}

function mudarCor() {
    const corSelecionada = document.getElementById('inputCor').value;
    document.documentElement.style.setProperty('--card-bg', corSelecionada);
}