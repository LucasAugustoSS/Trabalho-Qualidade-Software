import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

export default function CadastrarUsuario() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    role: "recepcionista"
  });
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/home");
    } catch (err: any) {
      setErro(err.response?.data?.detail || "Erro ao cadastrar usuário.");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Cadastro de Usuário</h1>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome</label>
            <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Senha</label>
            <input type="password" name="senha" value={form.senha} onChange={handleChange} required />
          </div>
          <div>
            <label>Função</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="recepcionista">Recepcionista</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button type="submit">Cadastrar</button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <Link to="/login">
            <button>Voltar para Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
