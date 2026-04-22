import React, { useState } from 'react';

// Estilos rápidos via constantes (você pode usar CSS real)
const styles = {
  container: { padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' },
  card: { border: '1px solid #3d3d3d', borderRadius: '8px', padding: '15px', marginBottom: '20px', backgroundColor: '#b7ffe7' },
  button: { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ffbcf1', color: 'white', border: 'none', borderRadius: '4px' },
  activeText: { color: '#00812b', fontWeight: 'bold', marginTop: '10px' }
};

const App = () => {
  const [etapa, setEtapa] = useState(0);

  const aulas = [
    { title: "Luz Solar", desc: "A planta absorve energia através da clorofila." },
    { title: "Água e CO2", desc: "A planta retira água do solo e dióxido de carbono do ar." },
    { title: "Glicose e Oxigênio", desc: "A energia é convertida em alimento (açúcar) e libera oxigênio." }
  ];

  return (
    <div style={styles.container}>
      <header>
        <h1> Aula Interativa: Fotossíntese</h1>
        <p>Clique nos botões abaixo para entender como as plantas produzem seu próprio alimento.</p>
      </header>

      <hr />

      {/* Seção Interativa */}
      <section style={styles.card}>
        <h2>Etapa Atual: {aulas[etapa].title}</h2>
        <p>{aulas[etapa].desc}</p>
        

        {/* botões para navegar */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button style={styles.button} onClick={() => setEtapa(0)}>1. Luz</button>
          <button style={styles.button} onClick={() => setEtapa(1)}>2. Absorção</button>
          <button style={styles.button} onClick={() => setEtapa(2)}>3. Resultado</button>
        </div>
      </section>

      {/* Componente de Quiz Simples */}
      <Quiz />
    </div>
  );
};

const Quiz = () => {
  // Estado para controlar se a resposta foi mostrada ou não
  const [respondido, setRespondido] = useState(false);


  return (
    <section style={{...styles.card, backgroundColor: '#00773c6c'}}>
      <h3>Desafio Rápido</h3>
      <p>O que as plantas liberam para os seres humanos durante a fotossíntese?</p>
      <button onClick={() => setRespondido(!respondido)} style={styles.button}>{respondido ? "Ocultar Resposta" : "Ver Resposta"}</button>
      {respondido && <p style={styles.activeText}> Resposta: Oxigênio (O₂)!</p>}
    </section>
  );
};

export default App;
