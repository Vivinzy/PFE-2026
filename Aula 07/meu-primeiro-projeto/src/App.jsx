import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function Saudacao() {
  return (
    <div
      style={{
        backgroundColor: "#ff76f8b9",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "10px",
      }}
    >
      <h2 style={{ color: "#000000" }}>Olá, Alunos!</h2>
      <p>Este componente foi criado separadamente</p>
    </div>
  );
}

function Primeiro({nome, idade}) {
  return (
    <div
      style={{
        backgroundColor: "#ffb9fc60",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "10px",
      }}>
         <h2 style={{ margin: '0 0 5px 0', color: '#000000'}}>
          👻 Aluna: {nome}
        </h2>
        <p style={{ margin: 0, color: '#000000'}}>
          🐭 Idade: <strong>{idade}</strong>       
        </p>
      <p>Componente Teste 01</p>
    </div>
  );
}

function Segundo() {
  return (
    <div
      style={{
        backgroundColor: "#65136d70",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "10px",
      }}>
      <h2 style={{ color: "#000000" }}>Segundo componente</h2>
      <p>02</p>
    </div>
  );
}

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      
      <div
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          fontSize: "40px",
          pointerEvents: "none", // Garante que o gato não bloqueie cliques em botões
          transform: "translate(-50%, -50%)", // Centraliza o emoji no cursor
          zIndex: 9999,
          transition: "transform 0.05s linear" // Deixa o movimento mais fluido
        }}
      >
        🐱
      </div>

      <h1>Olá, React!</h1>
      <p>Estou alterando meu primeiro componente.</p>

        <Saudacao />
        <Primeiro nome="Vitória" idade="20" />
        <Segundo />
    </div>
  );
}

export default App;