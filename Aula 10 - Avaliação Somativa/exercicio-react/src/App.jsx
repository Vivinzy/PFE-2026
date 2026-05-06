import React, { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [eventTitle, setEventTitle] = useState(""); // Título do evento
  const [eventType, setEventType] = useState("Palestra"); // Tipo do evento
  const [eventVagas, setEventVagas] = useState(10); // Vagas disponíveis 
  const [eventList, setEventList] = useState([]); // Lista de eventos
  const [filter, setFilter] = useState("Todos"); // Filtro de status
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa
  const [showModal, setShowModal] = useState(false); // Mostrar modal de alterações visuais

  // Carregar dados iniciais do LocalStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem("@eventpulse_data"); // Chave única para evitar conflitos
    if (savedEvents) setEventList(JSON.parse(savedEvents)); // Carrega os eventos salvos, se existirem
  }, []); 

  // Sincronizar alterações com o LocalStorage
  useEffect(() => { // Sempre que a lista de eventos mudar, atualiza o LocalStorage
    localStorage.setItem("@eventpulse_data", JSON.stringify(eventList)); // Salva a lista atualizada no LocalStorage
  }, [eventList]); // Dependência para atualizar apenas quando eventList mudar

  const addEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    const newEvent = {
      id: crypto.randomUUID(),
      title: eventTitle,
      type: eventType,
      status: "Agendado",
      date: new Date().toLocaleDateString(),
      vagas: Number(eventVagas), // Desafio 3
    };
    setEventList([newEvent, ...eventList]);
    setEventTitle("");
  };

  const toggleStatus = (id) => {
    setEventList(
      eventList.map((evt) => {
        if (evt.id === id) {
          const nextStatus =
            evt.status === "Agendado"
              ? "Em Andamento"
              : evt.status === "Em Andamento"
                ? "Encerrado"
                : "Agendado";
          return { ...evt, status: nextStatus };
        }
        return evt;
      })
    );
  };

  const deleteEvent = (id) => {
    setEventList(eventList.filter((evt) => evt.id !== id));
  };

  // Desafio 3 — Inscrever aluno (diminui vagas)
  const inscreverAluno = (id) => {
    setEventList(
      eventList.map((evt) => {
        if (evt.id === id && evt.vagas > 0) {
          return { ...evt, vagas: evt.vagas - 1 };
        }
        return evt;
      })
    );
  };

  // Desafio 4 — Limpar cronograma com confirmação
  const limparCronograma = () => {
    const confirmado = window.confirm(
      "Tem certeza que deseja limpar todo o cronograma? Esta ação não pode ser desfeita."
    );
    if (confirmado) {
      localStorage.removeItem("@eventpulse_data");
      setEventList([]);
    }
  };

  // Filtrar por status
  const filteredByStatus = eventList.filter((evt) => {
    if (filter === "Agendados") return evt.status === "Agendado";
    if (filter === "Em Andamento") return evt.status === "Em Andamento";
    if (filter === "Encerrados") return evt.status === "Encerrado";
    return true;
  });

  // Desafio 2 — Filtrar por pesquisa
  const filteredBySearch = filteredByStatus.filter((evt) =>
    evt.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Desafio 1 — Workshops primeiro
  const sortedEvents = [...filteredBySearch].sort((a, b) => {
    if (a.type === "Workshop" && b.type !== "Workshop") return -1;
    if (a.type !== "Workshop" && b.type === "Workshop") return 1;
    return 0;
  });

  return (
    <div className="app-container">
      <header>
        <div>
          <h1>EventPulse</h1>
          <p>Gestão de Eventos Acadêmicos</p>
        </div>
        {/* Desafio 4 */}
        <button className="clear-btn" onClick={limparCronograma}>
          Limpar Cronograma
        </button>
      </header>

      <section className="form-section">
        <form onSubmit={addEvent}>
          <input
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Nome do evento ou atividade..."
          />
          <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
            <option value="Palestra">Palestra</option>
            <option value="Workshop">Workshop</option>
            <option value="Painel">Painel</option>
          </select>
          {/* Desafio 3 — Vagas */}
          <select value={eventVagas} onChange={(e) => setEventVagas(e.target.value)}>
            <option value={10}>10 vagas</option>
            <option value={30}>30 vagas</option>
            <option value={50}>50 vagas</option>
          </select>
          <button type="submit">Agendar</button>
        </form>
      </section>

      {/* Desafio 2 — Barra de pesquisa */}
      <section className="search-section">
        <input
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Pesquisar evento pelo nome..."
        />
      </section>

      <section className="filter-section">
        {["Todos", "Agendados", "Em Andamento", "Encerrados"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </section>

      <main className="event-grid">
        {sortedEvents.map((item) => (
          <div
            key={item.id}
            className={`event-card ${item.type.toLowerCase()} ${item.status.toLowerCase().replace(" ", "-")}`}
          >
            <div className="event-content">
              <h3>{item.title}</h3>
              <span className="event-tag">Tipo: {item.type}</span>
              <span className="status-badge">Status: {item.status}</span>
              {/* Desafio 3 — Vagas disponíveis */}
              <span className="vagas-badge">
                Vagas: {item.vagas > 0 ? item.vagas : "Esgotado"}
              </span>
              <small>Registrado em: {item.date}</small>
            </div>
            <div className="event-actions">
              <button onClick={() => toggleStatus(item.id)} className="status-btn">
                {item.status === "Agendado"
                  ? "Iniciar"
                  : item.status === "Em Andamento"
                    ? "Encerrar"
                    : "Reiniciar"}
              </button>
              {/* Desafio 3 — Botão inscrever */}
              <button
                onClick={() => inscreverAluno(item.id)}
                className="enroll-btn"
                disabled={item.vagas === 0}
              >
                {item.vagas === 0 ? "Esgotado" : "Inscrever Aluno"}
              </button>
              <button onClick={() => deleteEvent(item.id)} className="delete">
                Remover
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Desafio 5 — Botão redondo com favicon */}
      <button className="fab-btn" onClick={() => setShowModal(true)} title="Alterações visuais">
        ✦
      </button>

      {/* Desafio 5 — Modal de alterações */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Alterações Visuais Realizadas</h2>
            <ul>
              <li>Novo gradiente animado no cabeçalho com efeito de brilho</li>
              <li>Tipografia trocada para fonte "Syne" (Google Fonts) com peso variável</li>
              <li>Cards com hover elevado (transform + sombra profunda ao passar o mouse)</li>
              <li>Barra de pesquisa com estilo glassmorphism e borda animada ao focar</li>
              <li>Botão de status com cores dinâmicas por estado (verde/laranja/cinza)</li>
            </ul>
            <button className="modal-close" onClick={() => setShowModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;