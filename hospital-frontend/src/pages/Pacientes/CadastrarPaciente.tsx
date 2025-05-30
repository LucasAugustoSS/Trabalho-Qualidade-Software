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

  function limpar(obj: Record<string, any>) {
    const novo: Record<string, any> = {};
    for (const chave in obj) {
      const valor = obj[chave];
      novo[chave] = valor === "" ? null : valor;
    }
    return novo;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setErro("");
      const formLimpo = limpar(form);
      await api.post("/pacientes", formLimpo);
      navigate("/");
    } catch (err: any) {
      if (err.response?.status === 422 && Array.isArray(err.response.data?.detail)) {
        const mensagens = err.response.data.detail.map(
          (e: any) => `${e.loc[1]}: ${e.msg}`
        );
        setErro(mensagens.join(" | "));
      } else {
        setErro("Erro ao cadastrar paciente.");
      }
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

              {key === "sexo" ? (
                <select name={key} id={key} value={value} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
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
          <Link to="/home">
            <button>Voltar para Página Inicial</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
