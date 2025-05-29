import { useState } from "react";
import { api } from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../../index.css";

export default function CadastrarPaciente() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    nascimento: "",
    cpf: "",
    sexo: "",
    telefone: "",
    endereco: "",
    email: "",
    tipo_sanguineo: "",
    alergias: ""
  });

  const [erro, setErro] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setErro(""); // limpa erro anterior
      await api.post("/pacientes", form);
      navigate("/");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Erro ao cadastrar paciente.";
      setErro(msg);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Cadastrar Paciente</h1>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <form onSubmit={handleSubmit}>
          {Object.entries(form).map(([key, value]) => (
            <div key={key}>
              <label htmlFor={key}>{key}</label>

              {/* Campo "sexo" como select */}
              {key === "sexo" ? (
                <select name={key} id={key} value={value} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              ) : (
                <input
                  type={key === "nascimento" ? "date" : "text"}
                  name={key}
                  id={key}
                  value={value}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
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
