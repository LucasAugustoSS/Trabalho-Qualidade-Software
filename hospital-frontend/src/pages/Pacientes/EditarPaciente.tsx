import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../../api/axios";
import "../../index.css";

export default function EditarPaciente() {
  const { id } = useParams();
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

  useEffect(() => {
    api.get(`/pacientes/buscar?termo=${id}`).then((res) => {
      if (res.data.length > 0) {
        const p = res.data[0];
        setForm({
          nome: p.nome,
          nascimento: p.nascimento,
          cpf: p.cpf,
          sexo: p.sexo,
          telefone: p.telefone,
          endereco: p.endereco,
          email: p.email || "",
          tipo_sanguineo: p.tipo_sanguineo || "",
          alergias: p.alergias || ""
        });
      }
    });
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.put(`/pacientes/${id}`, form);
    navigate("/");
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="page-title">Editar Paciente</h1>
        <form onSubmit={handleSubmit}>
          {Object.entries(form).map(([key, value]) => (
            <div key={key}>
              <label htmlFor={key}>{key}</label>
              <input
                type="text"
                name={key}
                id={key}
                value={value}
                onChange={handleChange}
              />
            </div>
          ))}
          <button type="submit">Salvar</button>
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
