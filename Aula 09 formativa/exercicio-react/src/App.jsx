import React, { useState, useEffect } from 'react';
import './App.css';

const PRIORITY_ORDER = { Alta: 0, Média: 1, Baixa: 2 }; 


function App() {
// Estados da Tarefa
  const [taskText, setTaskText] = useState(""); 
  const [priority, setPriority] = useState("Baixa"); 
  const [taskList, setTaskList] = useState([]); 
  const [filter, setFilter] = useState("Todas"); 
  const [search, setSearch] = useState(""); 
  const [editingId, setEditingId] = useState(null);  
  const [editingText, setEditingText] = useState("");
  const [editingpriority, setEditingpriority] = useState("");
  const [confirmId, setConfirmId] = useState(null); 

  // Carrega tarefas do localStorage ao iniciar
  useEffect(() => { 
    const saved = localStorage.getItem("@taskflow_data"); 
    if (saved) setTaskList(JSON.parse(saved)); 
  }, []);

  // Salva tarefas no localStorage sempre que a lista mudar
  useEffect(() => { 
    localStorage.setItem("@taskflow_data", JSON.stringify(taskList));
  }, [taskList]);

  // Função para adicionar nova tarefa
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
 // altera status de conclusão
  const toggleTask = (id) => {
    setTaskList(taskList.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const askDelete = (id) => setConfirmId(id);

  const confirmDelete = () => {
    setTaskList(taskList.filter(t => t.id !== confirmId));
    setConfirmId(null);
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };
  const starEdit = (priority) => {
    setEditingId(priority.id);
    setEditingText(priority.priority);
  };

  const saveEdit = (id) => {
    if (!editingText.trim()) return;
    setTaskList(taskList.map(t =>
      t.id === id ? { ...t, text: editingText } : t
    ));
    setEditingId(null);
    setEditingText("");
    setEditingpriority("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditingpriority("");
  };

// Aplica filtros, busca e ordenação
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