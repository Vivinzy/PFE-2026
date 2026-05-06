import { useState, useEffect, useCallback } from "react";

const INITIAL_USERS = [
  { id: 1, name: "Admin", email: "admin@escola.com", password: "admin123", role: "admin" },
  { id: 2, name: "Prof. Samuel Costa", email: "samuel@senaisp.com", password: "123456", role: "comum" },
  { id: 3, name: "Prof. Bruno Souza", email: "bruno@escola.com", password: "123456", role: "comum" },
];

const INITIAL_TURMAS = [
  { id: 1, nome: "Desenvolvimento de Sistemas", codigo: "MAT9A", horario: "Seg/Sex 13hrs", cor: "#7C3AED" },
  { id: 2, nome: "Física 2B", codigo: "FIS2B", horario: "Ter/Qui 10h", cor: "#0891B2" },
  { id: 3, nome: "Química 3C", codigo: "QUI3C", horario: "Sex 14h", cor: "#059669" },
  { id: 4, nome: "Biologia 1A", codigo: "BIO1A", horario: "Seg/Sex 07h", cor: "#D97706" },
];

const INITIAL_ALUNOS = {
  1: ["Lucas Mendes","Camila Torres","Pedro Alves","Sofia Ramos","Gabriel Costa","Beatriz Lima","Rafael Nunes","Isabella Martins"],
  2: ["Lucas Mendes","Pedro Alves","Gabriel Costa","Thiago Ferreira","Larissa Duarte","Felipe Borges"],
  3: ["Camila Torres","Sofia Ramos","Beatriz Lima","Mariana Castro","Eduardo Pinto"],
  4: ["Rafael Nunes","Isabella Martins","Thiago Ferreira","Larissa Duarte","Ana Cavalcanti","Victor Sousa"],
};

const INITIAL_PRESENCAS = {};
const INITIAL_VINCULOS = { 2: [1, 2], 3: [3, 4] };

function getStorage(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function setStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export default function App() {
  const [users, setUsers] = useState(() => getStorage("sp_users", INITIAL_USERS));
  const [turmas] = useState(INITIAL_TURMAS);
  const [alunos] = useState(INITIAL_ALUNOS);
  const [presencas, setPresencas] = useState(() => getStorage("sp_presencas", INITIAL_PRESENCAS));
  const [vinculos, setVinculos] = useState(() => getStorage("sp_vinculos", INITIAL_VINCULOS));
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("login");
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [adminTab, setAdminTab] = useState("turmas");
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "comum" });
  const [addUserError, setAddUserError] = useState("");
  const [addUserSuccess, setAddUserSuccess] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => { setStorage("sp_users", users); }, [users]);
  useEffect(() => { setStorage("sp_presencas", presencas); }, [presencas]);
  useEffect(() => { setStorage("sp_vinculos", vinculos); }, [vinculos]);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  };

  const handleLogin = () => {
    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (!user) { setLoginError("E-mail ou senha incorretos."); return; }
    setCurrentUser(user);
    setView(user.role === "admin" ? "admin" : "comum");
    setLoginError("");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
    setSelectedTurma(null);
    setLoginForm({ email: "", password: "" });
  };

  const togglePresenca = (turmaId, date, aluno) => {
    const key = `${turmaId}_${date}`;
    setPresencas(prev => {
      const cur = prev[key] || {};
      return { ...prev, [key]: { ...cur, [aluno]: !cur[aluno] } };
    });
  };

  const getPresencaKey = (turmaId, date) => `${turmaId}_${date}`;

  const getTurmasDoUsuario = (userId) => {
    const ids = vinculos[userId] || [];
    return turmas.filter(t => ids.includes(t.id));
  };

  const getPresencaStats = (turmaId) => {
    const alunosList = alunos[turmaId] || [];
    const allKeys = Object.keys(presencas).filter(k => k.startsWith(`${turmaId}_`));
    if (allKeys.length === 0) return { total: 0, media: 0 };
    const totals = alunosList.map(a => {
      const presente = allKeys.filter(k => presencas[k][a]).length;
      return (presente / allKeys.length) * 100;
    });
    const media = totals.length > 0 ? totals.reduce((a, b) => a + b, 0) / totals.length : 0;
    return { total: allKeys.length, media: Math.round(media) };
  };

  const handleAddUser = () => {
    setAddUserError(""); setAddUserSuccess("");
    if (!newUser.name || !newUser.email || !newUser.password) {
      setAddUserError("Preencha todos os campos."); return;
    }
    if (users.find(u => u.email === newUser.email)) {
      setAddUserError("E-mail já cadastrado."); return;
    }
    const id = Math.max(...users.map(u => u.id)) + 1;
    setUsers(prev => [...prev, { ...newUser, id }]);
    setNewUser({ name: "", email: "", password: "", role: "comum" });
    setAddUserSuccess("Usuário criado com sucesso!");
    notify("Usuário criado!");
  };

  const handleDeleteUser = (id) => {
    if (id === currentUser.id) { notify("Você não pode excluir a si mesmo.", "error"); return; }
    setUsers(prev => prev.filter(u => u.id !== id));
    setVinculos(prev => { const n = { ...prev }; delete n[id]; return n; });
    notify("Usuário removido.");
  };

  const toggleVinculo = (userId, turmaId) => {
    setVinculos(prev => {
      const cur = prev[userId] || [];
      const next = cur.includes(turmaId) ? cur.filter(t => t !== turmaId) : [...cur, turmaId];
      return { ...prev, [userId]: next };
    });
  };

  const commonUsers = users.filter(u => u.role === "comum");

  // ─── LOGIN ─────────────────────────────────────────────────────────────────
  if (view === "login") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "48px 40px", width: 380, maxWidth: "90vw" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #7C3AED, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>📋</div>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>Presença Digital</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "6px 0 0" }}>Sistema de Controle Acadêmico</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>E-mail</label>
          <input value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="seu@email.com" style={{ width: "100%", marginTop: 8, padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Senha</label>
          <input type="password" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="••••••••" style={{ width: "100%", marginTop: 8, padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        {loginError && <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#FCA5A5", fontSize: 13, marginBottom: 16 }}>{loginError}</div>}
        <button onClick={handleLogin} style={{ width: "100%", padding: "13px", borderRadius: 10, background: "linear-gradient(135deg, #7C3AED, #3B82F6)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
          Entrar
        </button>  <div style={{ marginTop: 20, padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 1 }}>Contas de demonstração</p>
          {[{ label: "Admin", email: "admin@escola.com", pass: "admin123" }, { label: "Professor", email: "ana@escola.com", pass: "123456" }].map(d => (
            <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ background: d.label === "Admin" ? "#7C3AED" : "#0891B2", color: "#fff", borderRadius: 4, fontSize: 10, padding: "2px 6px", fontWeight: 700 }}>{d.label}</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{d.email} / {d.pass}</span>
            </div>
      
          ))}
        </div>
      </div>
    </div>
  );

  // ─── SHARED HEADER ──────────────────────────────────────────────────────────
  const Header = () => (
    <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>📋</span>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Presença Digital</span>
        {currentUser.role === "admin" && <span style={{ background: "#7C3AED", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>ADMIN</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 13, color: "#6B7280" }}>{currentUser.name}</span>
        <button onClick={handleLogout} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", color: "#374151", fontWeight: 600 }}>Sair</button>
      </div>
    </div>
  );

  const Notif = () => notification ? (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: notification.type === "error" ? "#FEE2E2" : "#DCFCE7", border: `1px solid ${notification.type === "error" ? "#FCA5A5" : "#86EFAC"}`, borderRadius: 10, padding: "12px 18px", color: notification.type === "error" ? "#DC2626" : "#16A34A", fontWeight: 600, fontSize: 14, zIndex: 999, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      {notification.type === "error" ? "❌" : "✅"} {notification.msg}
    </div>
  ) : null;

  // ─── ADMIN VIEW ─────────────────────────────────────────────────────────────
  if (view === "admin") {
    const tabs = [{ id: "turmas", label: "Vincular Turmas", icon: "🏫" }, { id: "usuarios", label: "Usuários", icon: "👥" }, { id: "presencas", label: "Ver Presenças", icon: "📊" }];
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <Header />
        <Notif />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "#fff", borderRadius: 12, padding: 6, border: "1px solid #E5E7EB" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setAdminTab(t.id)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: adminTab === t.id ? "#7C3AED" : "transparent", color: adminTab === t.id ? "#fff" : "#6B7280", transition: "all .15s" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {adminTab === "turmas" && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Vínculos de Turmas por Professor</h2>
              {commonUsers.map(u => (
                <div key={u.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 20, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>{u.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{u.email}</p>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                    {turmas.map(t => {
                      const linked = (vinculos[u.id] || []).includes(t.id);
                      return (
                        <div key={t.id} onClick={() => { toggleVinculo(u.id, t.id); notify(linked ? "Turma desvinculada." : "Turma vinculada!"); }}
                          style={{ padding: "10px 14px", borderRadius: 8, border: `2px solid ${linked ? t.cor : "#E5E7EB"}`, background: linked ? `${t.cor}14` : "#F9FAFB", cursor: "pointer", transition: "all .15s" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                              <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: linked ? t.cor : "#374151" }}>{t.nome}</p>
                              <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>{t.horario}</p>
                            </div>
                            <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${linked ? t.cor : "#D1D5DB"}`, background: linked ? t.cor : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>
                              {linked ? "✓" : ""}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {adminTab === "usuarios" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: "#111827" }}>➕ Novo Usuário</h3>
                {[["Nome completo", "name", "text", "João da Silva"], ["E-mail", "email", "email", "joao@escola.com"], ["Senha", "password", "password", "••••••"]].map(([label, field, type, placeholder]) => (
                  <div key={field} style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>{label}</label>
                    <input type={type} placeholder={placeholder} value={newUser[field]} onChange={e => setNewUser(p => ({ ...p, [field]: e.target.value }))}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                  </div>
                ))}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Tipo</label>
                  <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, boxSizing: "border-box" }}>
                    <option value="comum">Professor (Comum)</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                {addUserError && <p style={{ color: "#DC2626", fontSize: 12, margin: "0 0 8px" }}>{addUserError}</p>}
                {addUserSuccess && <p style={{ color: "#16A34A", fontSize: 12, margin: "0 0 8px" }}>{addUserSuccess}</p>}
                <button onClick={handleAddUser} style={{ width: "100%", padding: "10px", background: "#7C3AED", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Criar Usuário</button>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: "#111827" }}>👥 Usuários Cadastrados</h3>
                {users.map(u => (
                  <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: u.role === "admin" ? "#EDE9FE" : "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{u.role === "admin" ? "🔑" : "👤"}</div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{u.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>{u.email}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ background: u.role === "admin" ? "#EDE9FE" : "#E0F2FE", color: u.role === "admin" ? "#7C3AED" : "#0891B2", fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>{u.role.toUpperCase()}</span>
                      {u.id !== currentUser.id && (
                        <button onClick={() => handleDeleteUser(u.id)} style={{ background: "#FEE2E2", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, color: "#DC2626", fontWeight: 600 }}>Excluir</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === "presencas" && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Presenças por Turma</h2>
              {selectedTurma === null ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                  {turmas.map(t => {
                    const stats = getPresencaStats(t.id);
                    return (
                      <div key={t.id} onClick={() => setSelectedTurma(t)} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 20, cursor: "pointer", transition: "all .15s" }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${t.cor}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 10 }}>🏫</div>
                        <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#111827" }}>{t.nome}</h3>
                        <p style={{ margin: "0 0 12px", fontSize: 12, color: "#9CA3AF" }}>{t.horario}</p>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1, background: "#F9FAFB", borderRadius: 8, padding: "8px", textAlign: "center" }}>
                            <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: t.cor }}>{stats.media}%</p>
                            <p style={{ margin: 0, fontSize: 10, color: "#9CA3AF" }}>Média</p>
                          </div>
                          <div style={{ flex: 1, background: "#F9FAFB", borderRadius: 8, padding: "8px", textAlign: "center" }}>
                            <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#374151" }}>{stats.total}</p>
                            <p style={{ margin: 0, fontSize: 10, color: "#9CA3AF" }}>Aulas</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <PresencaView turma={selectedTurma} alunos={alunos[selectedTurma.id] || []} presencas={presencas} onBack={() => setSelectedTurma(null)} onToggle={null} selectedDate={selectedDate} setSelectedDate={setSelectedDate} readonly={false} notify={notify} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── COMUM VIEW ─────────────────────────────────────────────────────────────
  if (view === "comum") {
    const minhasTurmas = getTurmasDoUsuario(currentUser.id);
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <Header />
        <Notif />
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
          {selectedTurma === null ? (
            <>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Minhas Turmas</h2>
                <p style={{ color: "#9CA3AF", fontSize: 13, margin: 0 }}>Selecione uma turma para registrar presença</p>
              </div>
              {minhasTurmas.length === 0 ? (
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 48, textAlign: "center" }}>
                  <p style={{ fontSize: 32, margin: "0 0 8px" }}>🏫</p>
                  <p style={{ color: "#6B7280", fontSize: 14 }}>Nenhuma turma vinculada. Contate o administrador.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                  {minhasTurmas.map(t => {
                    const stats = getPresencaStats(t.id);
                    const totalAlunos = (alunos[t.id] || []).length;
                    const keyToday = getPresencaKey(t.id, new Date().toISOString().split("T")[0]);
                    const registradoHoje = presencas[keyToday] !== undefined;
                    return (
                      <div key={t.id} onClick={() => { setSelectedTurma(t); setSelectedDate(new Date().toISOString().split("T")[0]); }}
                        style={{ background: "#fff", borderRadius: 12, border: `2px solid ${t.cor}30`, padding: 20, cursor: "pointer", position: "relative", overflow: "hidden" }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 20px ${t.cor}25`}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: t.cor, borderRadius: "12px 12px 0 0" }} />
                        <div style={{ marginTop: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${t.cor}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📚</div>
                            {registradoHoje && <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 700 }}>✓ Hoje</span>}
                          </div>
                          <h3 style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: "#111827" }}>{t.nome}</h3>
                          <p style={{ margin: "0 0 12px", fontSize: 12, color: "#9CA3AF" }}>{t.horario}</p>
                          <div style={{ display: "flex", gap: 8 }}>
                            <div style={{ flex: 1, background: "#F9FAFB", borderRadius: 8, padding: "8px", textAlign: "center" }}>
                              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.cor }}>{stats.media}%</p>
                              <p style={{ margin: 0, fontSize: 10, color: "#9CA3AF" }}>Média</p>
                            </div>
                            <div style={{ flex: 1, background: "#F9FAFB", borderRadius: 8, padding: "8px", textAlign: "center" }}>
                              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#374151" }}>{totalAlunos}</p>
                              <p style={{ margin: 0, fontSize: 10, color: "#9CA3AF" }}>Alunos</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <PresencaView turma={selectedTurma} alunos={alunos[selectedTurma.id] || []} presencas={presencas} onBack={() => setSelectedTurma(null)} onToggle={togglePresenca} selectedDate={selectedDate} setSelectedDate={setSelectedDate} readonly={false} notify={notify} />
          )}
        </div>
      </div>
    );
  }

  return null;
}

function PresencaView({ turma, alunos, presencas, onBack, onToggle, selectedDate, setSelectedDate, readonly, notify }) {
  const key = `${turma.id}_${selectedDate}`;
  const presencaDia = presencas[key] || {};
  const total = alunos.length;
  const presentes = alunos.filter(a => presencaDia[a]).length;
  const faltas = total - presentes;
  const pct = total > 0 ? Math.round((presentes / total) * 100) : 0;

  const allDates = [...new Set(Object.keys(presencas).filter(k => k.startsWith(`${turma.id}_`)).map(k => k.split("_")[1]))].sort().reverse();

  const getFreqAluno = (aluno) => {
    const all = Object.keys(presencas).filter(k => k.startsWith(`${turma.id}_`));
    if (all.length === 0) return 0;
    const presente = all.filter(k => presencas[k][aluno]).length;
    return Math.round((presente / all.length) * 100);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151" }}>← Voltar</button>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>{turma.nome}</h2>
          <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{turma.horario}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[["Total", total, "#374151"], ["Presentes", presentes, "#16A34A"], ["Faltas", faltas, "#DC2626"], ["Taxa", `${pct}%`, turma.cor]].map(([label, val, cor]) => (
          <div key={label} style={{ background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", padding: "14px 16px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: cor }}>{val}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>Lista de Chamada</h3>
              <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>Data selecionada</p>
            </div>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13 }} />
          </div>
          <div>
            {alunos.map((aluno, i) => {
              const presente = !!presencaDia[aluno];
              const freq = getFreqAluno(aluno);
              return (
                <div key={aluno} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: i < alunos.length - 1 ? "1px solid #F9FAFB" : "none", background: presente ? "#F0FDF4" : "transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${turma.cor}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: turma.cor }}>
                      {aluno.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{aluno}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <div style={{ width: 60, height: 4, background: "#E5E7EB", borderRadius: 2 }}>
                          <div style={{ width: `${freq}%`, height: "100%", background: freq >= 75 ? "#16A34A" : freq >= 50 ? "#D97706" : "#DC2626", borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 11, color: "#9CA3AF" }}>{freq}%</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: presente ? "#16A34A" : "#DC2626" }}>{presente ? "PRESENTE" : "FALTA"}</span>
                    {onToggle && (
                      <button onClick={() => { onToggle(turma.id, selectedDate, aluno); }}
                        style={{ width: 28, height: 28, borderRadius: 6, border: `2px solid ${presente ? "#16A34A" : "#D1D5DB"}`, background: presente ? "#16A34A" : "transparent", color: presente ? "#fff" : "#9CA3AF", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {presente ? "✓" : "○"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 16, marginBottom: 12 }}>
            <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#111827" }}>📅 Histórico de Aulas</h4>
            {allDates.length === 0 ? (
              <p style={{ color: "#9CA3AF", fontSize: 12, textAlign: "center", padding: "16px 0" }}>Nenhuma aula registrada</p>
            ) : allDates.map(date => {
              const dayPresencas = presencas[`${turma.id}_${date}`] || {};
              const n = Object.values(dayPresencas).filter(Boolean).length;
              const pctDay = alunos.length > 0 ? Math.round((n / alunos.length) * 100) : 0;
              return (
                <div key={date} onClick={() => setSelectedDate(date)}
                  style={{ padding: "8px 10px", borderRadius: 8, marginBottom: 6, cursor: "pointer", background: date === selectedDate ? `${turma.cor}10` : "#F9FAFB", border: `1px solid ${date === selectedDate ? turma.cor + "40" : "transparent"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{new Date(date + "T12:00").toLocaleDateString("pt-BR")}</span>
                    <span style={{ fontSize: 12, color: pctDay >= 75 ? "#16A34A" : "#D97706" }}>{pctDay}%</span>
                  </div>
                  <div style={{ height: 3, background: "#E5E7EB", borderRadius: 2 }}>
                    <div style={{ width: `${pctDay}%`, height: "100%", background: turma.cor, borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {onToggle && (
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 16 }}>
              <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#111827" }}>⚡ Ações Rápidas</h4>
              <button onClick={() => { alunos.forEach(a => !presencaDia[a] && onToggle(turma.id, selectedDate, a)); notify("Todos marcados como presentes!"); }}
                style={{ width: "100%", padding: "9px", background: "#DCFCE7", color: "#16A34A", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 8 }}>
                ✓ Todos Presentes
              </button>
              <button onClick={() => { alunos.forEach(a => presencaDia[a] && onToggle(turma.id, selectedDate, a)); notify("Todos marcados como ausentes."); }}
                style={{ width: "100%", padding: "9px", background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                ✗ Todos Ausentes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}