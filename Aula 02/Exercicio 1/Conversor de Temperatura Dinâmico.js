function converter() {
    const tempC = document.getElementById('celsius').value;
    if (tempC === "") {
    alert("Por favor, digite um valor.");
    return;
}
    const tempF = tempC * 1.8 + 32;
    const elementoResultado = document.getElementById('resultado');
    elementoResultado.innerText = `Resultado: ${tempF.toFixed(1)}°F`;

    if (tempF > 80) {
    document.body.style.backgroundColor = "coral";
} else {
    document.body.style.backgroundColor = "lightskyblue";
}
}