import { useState } from "react";
import { api } from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../../index.css";

export default function CadastrarMedico() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", especialidade: "" });
  const [erro, setErro] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro(""); // limpa erro ao digitar
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validação no frontend
    if (!form.nome.trim() || !form.especialidade.trim()) {
      setErro("Preencha todos os campos corretamente.");
      return;
    }

    try {
      await api.post("/medicos", form);
      navigate("/medicos");
    } catch (err: any) {
      if (err.response && err.response.data?.detail) {
        setErro(err.response.data.detail);
      } else {
        setErro("Erro ao cadastrar médico.");
      }
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Cadastrar Médico</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              name="nome"
              id="nome"
              value={form.nome}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="especialidade">Especialidade</label>
            <input
              type="text"
              name="especialidade"
              id="especialidade"
              value={form.especialidade}
              onChange={handleChange}
            />
          </div>

          {/* Mensagem de erro */}
          {erro && <p style={{ color: "red", marginTop: "10px" }}>{erro}</p>}

          <button type="submit">Cadastrar</button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <Link to="/">
            <button>Voltar para Página Inicial</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
