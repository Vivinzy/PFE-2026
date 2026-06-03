import React, { useState, useEffect } from "react"; 
import "./App.css";

function App() {

  // Estados básicos do app
  const [eventTitle, setEventTitle] = useState(""); // nome do evento
  const [eventType, setEventType] = useState("Palestra"); // tipo (palestra, workshop, painel)
  const [eventVagas, setEventVagas] = useState(10); // quantas vagas tem
  const [eventList, setEventList] = useState([]); // lista de todos os eventos
  const [filter, setFilter] = useState("Todos"); // filtro ativo nos botões
  const [searchTerm, setSearchTerm] = useState(""); // o que tá digitado na busca
  const [showModal, setShowModal] = useState(false); // controla se o modal tá aberto

  // Carrega os eventos salvos quando a página abre
  useEffect(() => {
    const savedEvents = localStorage.getItem("@eventpulse_data");
    if (savedEvents) setEventList(JSON.parse(savedEvents));
  }, []); 

  // Toda vez que a lista muda, salva no localStorage
  useEffect(() => {
    localStorage.setItem("@eventpulse_data", JSON.stringify(eventList));
  }, [eventList]);

  // Adiciona um novo evento na lista
  const addEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return; // ignora se o título tiver vazio
    const newEvent = {
      id: crypto.randomUUID(), // id único pra cada evento
      title: eventTitle,
      type: eventType,
      status: "Agendado", // começa sempre como agendado
      date: new Date().toLocaleDateString(),
      vagas: Number(eventVagas),
    };
    setEventList([newEvent, ...eventList]); // joga o novo evento no topo
    setEventTitle(""); // limpa o campo de título
  };

  // Alterna o status do evento: Agendado → Em Andamento → Encerrado → Agendado...
  const toggleStatus = (id) => {
    setEventList(
      eventList.map((evt) => {
        if (evt.id === id) {
          const nextStatus =
            evt.status === "Agendado"
              ? "Em Andamento"
              : evt.status === "Em Andamento"
                ? "Encerrado"
                : "Agendado"; // volta pro começo se já tiver encerrado
          return { ...evt, status: nextStatus };
        }
        return evt; // evento diferente? deixa como tá 
      })
    );
  };

  // Remove o evento da lista pelo id
  const deleteEvent = (id) => {
    setEventList(eventList.filter((evt) => evt.id !== id));
  };

  // Inscreve um aluno: só diminui 1 vaga se ainda tiver vagas disponíveis
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

  // Apaga tudo do cronograma (com confirmação pra não deletar por acidente)
  const limparCronograma = () => {
    const confirmado = window.confirm(
      "Tem certeza que deseja limpar todo o cronograma? Esta ação não pode ser desfeita."
    );
    if (confirmado) {
      localStorage.removeItem("@eventpulse_data");
      setEventList([]);
    }
  };

  // Filtra a lista pelo status selecionado nos botões
  const filteredByStatus = eventList.filter((evt) => {
    if (filter === "Agendados") return evt.status === "Agendado";
    if (filter === "Em Andamento") return evt.status === "Em Andamento";
    if (filter === "Encerrados") return evt.status === "Encerrado";
    return true; // "Todos" não filtra nada
  });

  // Filtra pelo que o usuário digitou na barra de pesquisa
  const filteredBySearch = filteredByStatus.filter((evt) =>
    evt.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Workshops aparecem primeiro que os outros tipos (1)
  const sortedEvents = [...filteredBySearch].sort((a, b) => {
    if (a.type === "Workshop" && b.type !== "Workshop") return -1;
    if (a.type !== "Workshop" && b.type === "Workshop") return 1;
    return 0;
  });

  return (
    <div className="app-container">
      {/* Cabeçalho com título e botão de limpar tudo */}
      <header>
        <div>
          <h1>EventPulse</h1>
          <p>Gestão de Eventos Acadêmicos</p>
        </div>
        <button className="clear-btn" onClick={limparCronograma}>
          Limpar Cronograma
        </button>
      </header>

      {/* Formulário pra criar novo evento */}
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
          {/* Seletor de vagas */}
          <select value={eventVagas} onChange={(e) => setEventVagas(e.target.value)}>
            <option value={10}>10 vagas</option>
            <option value={30}>30 vagas</option>
            <option value={50}>50 vagas</option>
          </select>
          <button type="submit">Agendar</button>
        </form>
      </section>

      {/* Barra de busca por nome (2) */}
      <section className="search-section">
        <input
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Pesquisar evento pelo nome..." 
        />
      </section>

      {/* Botões de filtro por status */}
      <section className="filter-section">
        {["Todos", "Agendados", "Em Andamento", "Encerrados"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""} // destaca o filtro ativo
            onClick={() => setFilter(f)} 
          >
            {f}
          </button>
        ))}
      </section>

      {/* Grid de cards dos eventos */}
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
              {/* Mostra as vagas ou "Esgotado" se acabou */}
              <span className="vagas-badge">
                Vagas: {item.vagas > 0 ? item.vagas : "Esgotado"}
              </span>
              <small>Registrado em: {item.date}</small>
            </div>
            <div className="event-actions">
              {/* Botão que muda o status do evento */}
              <button onClick={() => toggleStatus(item.id)} className="status-btn">
                {item.status === "Agendado"
                  ? "Iniciar"
                  : item.status === "Em Andamento"
                    ? "Encerrar"
                    : "Reiniciar"}
              </button>
              {/* Botão de inscrição — desativa se não tiver vagas */}
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

      {/* Botãozinho flutuante no canto que abre o modal */}
      <button className="fab-btn" onClick={() => setShowModal(true)} title="Alterações visuais">
        ✦
      </button>

      {/* Modal com a lista de alterações visuais feitas */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          {/* "interromper a propagação" evita fechar o modal ao clicar dentro dele */}
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