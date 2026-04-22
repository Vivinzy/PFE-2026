import React, { useState, useEffect } from 'react';
import './App.css';

const PRIORITY_ORDER = { Alta: 0, Média: 1, Baixa: 2 }; // Define a ordem de prioridade para a ordenação 


function App() { // estados para controlar a aplicação (base de dados local)

  const [taskText, setTaskText] = useState(""); // taskText armazena o texto da nova tarefa a ser criada. O estado é atualizado conforme o usuário digita no campo de entrada.
  const [priority, setPriority] = useState("Baixa"); // priority armazena a prioridade "baixa, media ou alta"
  const [taskList, setTaskList] = useState([]); // tasklist lista de todas as tarefas criadas 
  const [filter, setFilter] = useState("Todas"); // filter controla qual filtro está ativo "todos, pendentes ou concluidas"
  const [search, setSearch] = useState(""); // search guarda o texto da barra de busca
  const [editingId, setEditingId] = useState(null); // editingId guarad o ID da tarefa que está sendo editada e null se nenhuma tarefa estiver sendo editada 
  const [editingText, setEditingText] = useState(""); //editingText texto temporario enquanto o usuario edita 
  const [confirmId, setConfirmId] = useState(null); // confirmId guarda o ID da tarefa aguardando confirmação de exclusão, null se nenhuma tarefa estiver sendo confirmada para exclusão

  useEffect(() => { // serve para carregar as tarefas salvas no LocalStorage quando o componente é montado(LocalStorage salva os dados mesmo após o navegador fechado)
    const saved = localStorage.getItem("@taskflow_data"); // tenta recuperar os dados salvos no LocalStorage usando a chave "@taskflow_data"
    if (saved) setTaskList(JSON.parse(saved)); // se houver dados salvos, eles são convertidos de volta para um array de objetos usando JSON.parse e atribuídos ao estado taskList, permitindo que as tarefas sejam exibidas na interface do usuário.
  }, []);

  useEffect(() => { 
    localStorage.setItem("@taskflow_data", JSON.stringify(taskList));
  }, [taskList]);

  const addTask = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    const newTask = {
      id: crypto.randomUUID(),
      text: taskText,
      priority: priority,
      completed: false,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
    setTaskList([newTask, ...taskList]);
    setTaskText("");
  };

  const toggleTask = (id) => {
    setTaskList(taskList.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  // 4. Confirmação de exclusão com modal customizado
  const askDelete = (id) => setConfirmId(id);

  const confirmDelete = () => {
    setTaskList(taskList.filter(t => t.id !== confirmId));
    setConfirmId(null);
  };

  // 3. Edição de tarefas inline
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = (id) => {
    if (!editingText.trim()) return;
    setTaskList(taskList.map(t =>
      t.id === id ? { ...t, text: editingText } : t
    ));
    setEditingId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // 1. Ordenação automática: Alta no topo
  // 2. Busca em tempo real + filtro de status
  const filteredTasks = taskList
    .filter(t => {
      if (filter === "Pendentes") return !t.completed;
      if (filter === "Concluídas") return t.completed;
      return true;
    })
    .filter(t => t.text.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2));

  return (
    <div className="app-container">
      <header>
        {/* colocar imagem aqui */}

        <h1>TaskFlow</h1>
        <p>Gestão de Produtividade</p>
      </header>

      <section className="form-section">
        <form onSubmit={addTask}>
          <input
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Descrição da tarefa..."
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
          <button type="submit">Criar</button>
        </form>

        {/* 2. Campo de busca em tempo real */}
        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar tarefa..."
        />
      </section>

      <section className="filter-section">
        {["Todas", "Pendentes", "Concluídas"].map(f => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </section>

      <main className="task-grid">
        {filteredTasks.map(item => (
          <div
            key={item.id}
            className={`task-card ${item.priority.toLowerCase()} ${item.completed ? 'done' : ''}`}
          >
            <div className="task-content">
              {/* 3. Edição inline */}
              {editingId === item.id ? (
                <input
                  className="edit-input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(item.id);
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  autoFocus
                />
              ) : (
                <h3>{item.text}</h3>
              )}
              <span>Prioridade: {item.priority}</span>
              <small>Criada em: {item.createdAt}</small>
            </div>

            <div className="task-actions">
              {editingId === item.id ? (
                <>
                  <button onClick={() => saveEdit(item.id)}>Salvar</button>
                  <button onClick={cancelEdit}>Cancelar</button>
                </>
              ) : (
                <>
                  <button onClick={() => toggleTask(item.id)}>
                    {item.completed ? "Reabrir" : "Concluido"}
                  </button>
                  <button onClick={() => startEdit(item)}>Editar</button>
                  <button onClick={() => askDelete(item.id)} className="delete">
                    Deletar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* 4. Modal de confirmação de exclusão */}
      {confirmId && (
        <div className="modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>Tem certeza que deseja remover esta tarefa? Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button onClick={() => setConfirmId(null)}>Cancelar</button>
              <button className="delete" onClick={confirmDelete}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;